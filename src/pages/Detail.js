import React, { useState, useEffect, useRef } from 'react';
import { Button, Nav, DropdownButton, Dropdown } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUserStore from '../stores/useUserStore.js';
import { apiInstance } from '../util/api';
import './Detail.css';
import ReviewModal from '../ReviewModal.js';
import GuideModal from '../GuideModal.js';

function Detail() {
  const { state } = useLocation();
  const { item } = state || {};
  const { itemId } = useParams();
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [modal, setModal] = useState('detail');
  const [brandName, setBrandName] = useState('');
  const optionAddButtonRef = useRef(null);

  useEffect(() => {
    if (item && item.brandId) {
      apiInstance.get(`/brands/${item.brandId}`)
        .then(response => {
          setBrandName(response.data.name);
        })
        .catch(error => {
          console.error("브랜드 정보를 가져오는데 실패했습니다:", error);
        });
    }
  }, [item]);

  if (!item) {
    return <div>상품 정보를 불러오는 중입니다...</div>;
  }

  const handleBuyNow = () => {
    if (selectedOptions.length === 0 || selectedOptions.some(option => !option.size || !option.color || option.stockQuantity === 0)) {
      toast.error("옵션을 먼저 선택해주세요!");
      optionAddButtonRef.current.focus();
      return;
    }

    if (user) {
      const cartKey = `cart_${user.id}`;
      const storedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
      const duplicateItem = storedCartItems.find(storedItem => storedItem.itemId === item.id && compareOptions(storedItem.options, selectedOptions));

      const navigateToOrders = () => {
        const orderItems = selectedOptions.map(option => ({
          itemId: item.id,
          itemName: item.itemName,
          price: item.price,
          options: [option],
          quantity: option.quantity,
          mainImage: getMainImageSrc(item.itemImageDTOs) // Add image URL
        }));
        const productTotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const total = productTotal + 2500;

        navigate('/orders', {
          state: {
            cartItems: orderItems,
            productTotal: productTotal,
            shipping: 2500,
            total: total
          }
        });
      };

      if (duplicateItem) {
        if (window.confirm("장바구니에 이미 추가된 상품입니다. 장바구니로 이동하시겠습니까?")) {
          navigate('/carts');
        } else {
          navigateToOrders();
        }
      } else {
        navigateToOrders();
      }
    }
  };

  const handleAddToCart = () => {
    if (selectedOptions.length === 0 || selectedOptions.some(option => !option.size || !option.color || option.stockQuantity === 0)) {
      toast.error("옵션을 먼저 선택해주세요!");
      optionAddButtonRef.current.focus();
      return;
    }

    if (user) {
      const cartKey = `cart_${user.id}`;
      const storedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
      const duplicateItem = storedCartItems.find(storedItem => storedItem.itemId === item.id && compareOptions(storedItem.options, selectedOptions));

      if (duplicateItem) {
        if (window.confirm("이미 장바구니에 추가된 상품입니다. 추가로 담으시겠습니까?")) {
          const updatedCartItems = storedCartItems.map(storedItem =>
              storedItem.itemId === item.id && compareOptions(storedItem.options, selectedOptions)
                  ? { ...storedItem, quantity: storedItem.quantity + selectedOptions.reduce((acc, option) => acc + option.quantity, 0) }
                  : storedItem
          );
          localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
          setSelectedOptions([]);
          toast.success("장바구니에 추가되었습니다!");
        }
      } else {
        const newCartItems = selectedOptions.map(option => ({
          itemId: item.id,
          itemName: item.itemName,
          price: item.price,
          options: [option],
          quantity: option.quantity,
          mainImage: getMainImageSrc(item.itemImageDTOs) // Add image URL
        }));

        const updatedCartItems = storedCartItems.concat(newCartItems);
        localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
        setSelectedOptions([]);
        toast.success("장바구니에 추가되었습니다!");
      }
    }
  };

  const compareOptions = (options1, options2) => {
    if (options1.length !== options2.length) return false;
    return options1.every((opt1, index) =>
      opt1.size === options2[index].size &&
      opt1.color === options2[index].color
    );
  };

  const availableSizes = Array.from(new Set(item.itemDetailDTOs.map(detail => detail.size)));

  const getAvailableColors = (size) => {
    return item.itemDetailDTOs.filter(detail => detail.size === size).map(detail => detail.color);
  };

  const handleOptionAdd = () => {
    setSelectedOptions([...selectedOptions, { size: null, color: null, quantity: 1, stockQuantity: null }]);
  };

  const handleSizeChange = (index, size) => {
    const newOptions = [...selectedOptions];
    newOptions[index].size = size;
    newOptions[index].color = null;
    updateStockQuantity(newOptions, index, size, newOptions[index].color);
    setSelectedOptions(newOptions);
  };

  const handleColorChange = (index, color) => {
    const newOptions = [...selectedOptions];
    newOptions[index].color = color;
    updateStockQuantity(newOptions, index, newOptions[index].size, color);
    setSelectedOptions(newOptions);
  };

  const updateStockQuantity = (options, index, size, color) => {
    const selectedDetail = item.itemDetailDTOs.find(detail => detail.size === size && detail.color === color);
    if (selectedDetail) {
      options[index].stockQuantity = selectedDetail.quantity;
      options[index].quantity = 1;
    } else {
      options[index].stockQuantity = null;
    }
  };

  const handleDecreaseQuantity = (index) => {
    const newOptions = [...selectedOptions];
    if (newOptions[index].quantity > 1) {
      newOptions[index].quantity -= 1;
    }
    setSelectedOptions(newOptions);
  };

  const handleIncreaseQuantity = (index) => {
    const newOptions = [...selectedOptions];
    if (newOptions[index].stockQuantity && newOptions[index].quantity < newOptions[index].stockQuantity) {
      newOptions[index].quantity += 1;
    }
    setSelectedOptions(newOptions);
  };

  const handleOptionRemove = (index) => {
    const newOptions = [...selectedOptions];
    newOptions.splice(index, 1);
    setSelectedOptions(newOptions);
  };

  const getMainImageSrc = (itemImageDTOs) => {
    const mainImage = itemImageDTOs.find(image => image.isMain);
    return mainImage ? mainImage.filePath : '';
  };

  const getSubImageSrc = (itemImageDTOs) => {
    const subImage = itemImageDTOs.find(image => !image.isMain);
    return subImage ? subImage.filePath : '';
  };

  return (
    <div className="Detail_detail-container">
      <ToastContainer />
      <div className="row">
        <div className="col-md-6 Detail_detail-image">
          <div className="Detail_image-placeholder">
            <img src={getMainImageSrc(item.itemImageDTOs)} width="100%" alt={item.itemName} />
          </div>
        </div>
        <div className="col-md-6 Detail_detail-info">
          <h5>{brandName}</h5>
          <h2>{item.itemName}</h2>
          <p className="Detail_price">{item.price.toLocaleString()} 원</p>
          <Button variant="outline-secondary" ref={optionAddButtonRef} onClick={handleOptionAdd}>옵션 추가</Button>
          {Array.isArray(selectedOptions) && selectedOptions.map((option, index) => (
            <div key={index} className="Detail_option-selector">
              <div className="Detail_dropdown-container">
                <DropdownButton id={`size-dropdown-${index}`} title={option.size || "사이즈"} className="Detail_dropdown-button">
                  {availableSizes.map((size, idx) => (
                    <Dropdown.Item key={idx} onClick={() => handleSizeChange(index, size)}>{size}</Dropdown.Item>
                  ))}
                </DropdownButton>
                <DropdownButton id={`color-dropdown-${index}`} title={option.color || "색상"} className="Detail_dropdown-button">
                  {option.size && getAvailableColors(option.size).map((color, idx) => (
                    <Dropdown.Item key={idx} onClick={() => handleColorChange(index, color)}>{color}</Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>
              {option.size && option.color && (
                <>
                  {option.stockQuantity === 0 ? (
                    <p className="Detail_out-of-stock">품절입니다!</p>
                  ) : (
                    <>
                      <p className="Detail_current-stock">현재 재고: {option.stockQuantity}</p>
                      <p className="Detail_option-details">{item.itemName} / {option.size} / {option.color}</p>
                      <div className="Detail_quantity-selector">
                        <Button variant="outline-secondary" onClick={() => handleDecreaseQuantity(index)}>{"<"}</Button>
                        <span className="Detail_quantity">{option.quantity}</span>
                        <Button variant="outline-secondary" onClick={() => handleIncreaseQuantity(index)}>{">"}</Button>
                      </div>
                    </>
                  )}
                  <Button variant="danger" className="Detail_remove-option" onClick={() => handleOptionRemove(index)}>x</Button>
                </>
              )}
            </div>
          ))}
          <p className="Detail_total-price">총 상품 금액 {selectedOptions.reduce((acc, option) => acc + (item.price * option.quantity), 0).toLocaleString()} 원</p>
          <div className="Detail_buttons">
            <Button variant="outline-dark" className="Detail_add-to-cart" onClick={handleAddToCart} disabled={selectedOptions.some(option => option.stockQuantity === 0)}>Add to cart</Button>
            <Button variant="outline-dark" className="Detail_buy-now" onClick={handleBuyNow} disabled={selectedOptions.some(option => option.stockQuantity === 0)}>Buy now</Button>
          </div>
        </div>
      </div>
      <Nav justify variant="tabs" defaultActiveKey="detail">
        <Nav.Item>
          <Nav.Link eventKey="detail" onClick={() => setModal('detail')}>상세정보</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="review" onClick={() => setModal('review')}>리뷰</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="guide" onClick={() => setModal('guide')}>배송/교환/반품 안내</Nav.Link>
        </Nav.Item>
      </Nav>
      {modal === 'detail' && <DetailModal />}
      {modal === 'review' && <ReviewModal itemId={itemId} user={user} />}
      {modal === 'guide' && <GuideModal />}
    </div>
  );

  function DetailModal() {
    return (
      <div className="Detail_DetailModal">
        <img src={getSubImageSrc(item.itemImageDTOs)} width="100%" alt="Sub Image" />
      </div>
    );
  }
}

export default Detail;
