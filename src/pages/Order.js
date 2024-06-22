/* global daum */
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, ListGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../stores/useUserStore.js';
import { apiInstance } from '../util/api.js';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Order.css';

function Order() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems = [], productTotal = 0, shipping = 0, total = 0 } = location.state || {};
    const user = useUserStore(state => state.user);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [customDeliveryReq, setCustomDeliveryReq] = useState(false);
    const [itemImages, setItemImages] = useState({});

    const jwtToken = Cookies.get('jwtToken'); // 쿠키에서 JWT 토큰 가져오기

    const [formData, setFormData] = useState({
        orderCustomer: user ? user.displayName : '',
        recipientName: '',
        addrName: '',
        recipientTel: '',
        zipcode: '',
        addr: '',
        addrDetail: '',
        deliveryReq: '',
        phone: ''
    });
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        recipientName: '', // 수령자
        addrName: '', // 배송지명
        recipientTel: '', // 휴대전화 번호
        zipcode: '', // 우편번호
        addr: '', // 주소
        addrDetail: '', // 상세주소
        deliveryReq: ''
    });

    useEffect(() => {
        if (user && jwtToken) {
            fetchAddresses();
        }
    }, [user, jwtToken]);

    useEffect(() => {
        console.log('cartItems:', cartItems);
    }, [cartItems]);

    useEffect(() => {
        cartItems.forEach(item => {
            fetchItemImages(item.itemId);
        });
    }, [cartItems]);

    const fetchItemImages = async (itemId) => {
        try {
            const response = await apiInstance.get(`/items/${itemId}/itemimages`);
            console.log('Fetched images for item', itemId, response.data); // 데이터 확인을 위한 로그 추가
            setItemImages(prevState => ({
                ...prevState,
                [itemId]: response.data
            }));
        } catch (error) {
            console.error('Failed to fetch item images:', error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await apiInstance.get('/addresses', { headers: { 'Authorization': `Bearer ${jwtToken}` } });
            console.log('Fetched addresses:', response.data); // 서버로부터 받아온 데이터 구조 확인
            setAddresses(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            setAddresses([]); // 오류 발생 시 빈 배열로 초기화
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDeliveryReqChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setCustomDeliveryReq(true);
            setFormData({
                ...formData,
                deliveryReq: ''
            });
        } else {
            setCustomDeliveryReq(false);
            setFormData({
                ...formData,
                deliveryReq: value
            });
        }
    };

    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const handleAddAddress = async () => {
        console.log('User:', user); // 유저 정보 확인
        console.log('JWT Token:', jwtToken); // JWT 토큰 확인
        if (!jwtToken || jwtToken.split('.').length !== 3) {
            console.error('Invalid JWT Token');
            return;
        }
        try {
            const response = await apiInstance.post('/addresses', newAddress, { headers: { 'Authorization': `Bearer ${jwtToken}` } });
            console.log('Added address:', response.data); // 추가된 데이터 구조 확인
            setAddresses([...addresses, response.data]);
            setNewAddress({
                recipientName: '',
                addrName: '',
                recipientTel: '',
                zipcode: '',
                addr: '',
                addrDetail: '',
                deliveryReq: ''
            });
            setShowAddAddressModal(false);
        } catch (error) {
            console.error('Failed to add address:', error);
        }
    };

    const handleEditAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditAddress = async (address) => {
        setEditAddressId(address.id);
        try {
            const response = await apiInstance.get(`/addresses/${address.id}`, { headers: { 'Authorization': `Bearer ${jwtToken}` } });
            const addressData = response.data;
            setFormData({
                recipientName: addressData.recipientName,
                addrName: addressData.addrName,
                recipientTel: addressData.recipientTel,
                zipcode: addressData.zipcode,
                addr: addressData.addr,
                addrDetail: addressData.addrDetail,
                deliveryReq: ''
            });
            setShowEditAddressModal(true);
        } catch (error) {
            console.error('Failed to fetch address for editing:', error);
        }
    };

    const handleSaveEditedAddress = async () => {
        try {
            await apiInstance.post(`/addresses/${editAddressId}`, formData, { headers: { 'Authorization': `Bearer ${jwtToken}` } });
            fetchAddresses();
            setShowEditAddressModal(false);
        } catch (error) {
            console.error('Failed to edit address:', error);
        }
    };

    const handleDeleteAddress = async (id) => {
        const confirmed = window.confirm("정말 주소를 삭제하시겠습니까?");
        if (!confirmed) return;
        try {
            await apiInstance.delete(`/addresses/${id}`, { headers: { 'Authorization': `Bearer ${jwtToken}` } });
            setAddresses(addresses.filter(address => address.id !== id));
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    };

    const handleSelectAddress = (address) => {
        setFormData({
            ...formData,
            recipientName: address.recipientName,
            addrName: address.addrName,
            recipientTel: address.recipientTel,
            zipcode: address.zipcode,
            addr: address.addr,
            addrDetail: address.addrDetail
        });
        setShowAddressModal(false);
    };

    const handlePostcode = () => {
        new daum.Postcode({
            oncomplete: function (data) {
                setNewAddress({
                    ...newAddress,
                    zipcode: data.zonecode,
                    addr: data.address
                });
            }
        }).open();
    };

    const handleCloseAddressModal = () => {
        setShowAddressModal(false);
        window.location.reload();
    };

    const getMainImageSrc = (itemId) => {
        const images = itemImages[itemId];
        if (!images) return '';
        const mainImage = images.find(image => image.isMain);
        return mainImage ? mainImage.filePath : '';
    };

    const handleSubmitOrder = async () => {
        const orderDTO = {
            shippingCost: shipping,
            recipientName: formData.recipientName,
            zipcode: formData.zipcode,
            addr: formData.addr,
            addrDetail: formData.addrDetail,
            recipientTel: formData.recipientTel,
            addrName: formData.addrName,
            deliveryReq: formData.deliveryReq || '' // 빈 값 처리
        };

        const orderDetailDTOs = cartItems.flatMap(cartItem =>
            cartItem.options.map(option => ({
                itemId: cartItem.itemId,
                price: cartItem.price,
                quantity: option.quantity,
                color: option.color,
                size: option.size
            }))
        );

        const orderRequestDTO = {
            orderDTO,
            orderDetailDTOs
        };

        console.log('Order Request Data:', JSON.stringify(orderRequestDTO, null, 2)); // 요청 데이터 출력 (formatted)
        console.log('JWT Token:', jwtToken); // 토큰 출력

        try {
            const response = await apiInstance.post('/orders', orderRequestDTO, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
            console.log('Response:', response.data); // 응답 데이터 출력
            toast.success('주문이 성공적으로 진행되었습니다!');
            clearPurchasedItemsFromLocalStorage(cartItems, user.id);
            navigate('/orders/complete'); // 주문 내역 조회 페이지로 이동
        } catch (error) {
            if (error.response) {
                console.error('Failed to create order:', error.response.status, error.response.data);
                toast.error(`주문 생성에 실패했습니다: ${error.response.data.message || '다시 시도해 주세요.'}`);
            } else {
                console.error('Failed to create order:', error.message);
                toast.error('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
            }
            console.error('Error Object:', error); // 전체 오류 객체 출력
        }
    };

    const clearPurchasedItemsFromLocalStorage = (purchasedItems, userId) => {
        const cartKey = `cart_${userId}`;
        const storedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
        const remainingItems = storedCartItems.filter(storedItem =>
            !purchasedItems.some(purchasedItem => purchasedItem.itemId === storedItem.itemId)
        );
        localStorage.setItem(cartKey, JSON.stringify(remainingItems));
    };

    return (
        <div className="order-container-unique">
            <h1>ORDER</h1>
            <div className="order-form-unique">
                <div className="order-shipping-info-unique">
                    <h2>배송 정보</h2>
                    <Form>
                        <Form.Group controlId="formOrderCustomer">
                            <Form.Label>주문고객</Form.Label>
                            <Form.Control type="text" name="orderCustomer" value={formData.orderCustomer} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>휴대폰 번호</Form.Label>
                            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formAddrName">
                            <Form.Label>배송지명</Form.Label>
                            <Form.Control type="text" name="addrName" value={formData.addrName} onClick={() => setShowAddressModal(true)} placeholder="배송지 선택" readOnly />
                        </Form.Group>
                        <Form.Group controlId="formRecipientName">
                            <Form.Label>받는 분</Form.Label>
                            <Form.Control type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formRecipientTel">
                            <Form.Label>받는 분 휴대폰 번호</Form.Label>
                            <Form.Control type="text" name="recipientTel" value={formData.recipientTel} onChange={handleChange} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formZipcode">
                            <Form.Label>우편번호</Form.Label>
                            <Form.Control type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>배송 주소</Form.Label>
                            <Form.Control type="text" name="addr" value={formData.addr} onChange={handleChange} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formAddressDetail">
                            <Form.Label>배송 상세 주소</Form.Label>
                            <Form.Control type="text" name="addrDetail" value={formData.addrDetail} onChange={handleChange} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formDeliveryReq">
                            <Form.Label>배송요청사항</Form.Label>
                            <Form.Control
                                as="select"
                                name="deliveryReq"
                                value={formData.deliveryReq || ''}
                                onChange={handleDeliveryReqChange}
                            >
                                <option value="" disabled>배송 요청 사항을 선택하세요</option>
                                <option value="문 앞에 두고 가주세요">문 앞에 두고 가주세요</option>
                                <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                                <option value="택배함에 넣어주세요">택배함에 넣어주세요</option>
                                <option value="custom">직접 입력</option>
                            </Form.Control>
                            {customDeliveryReq && (
                                <Form.Control
                                    type="text"
                                    name="deliveryReq"
                                    placeholder="배송 요청 사항을 입력하세요"
                                    value={formData.deliveryReq}
                                    onChange={handleChange}
                                />
                            )}
                        </Form.Group>

                    </Form>
                </div>
                <div className="order-payment-info-unique">
                    <h2>결제 정보</h2>
                    {cartItems.map((item, itemIndex) => (
                        item.options.map((option, optionIndex) => (
                            <div key={`${itemIndex}-${optionIndex}`} className="order-product-item-unique d-flex">
                                <div className="order-product-image-container">
                                    <img src={getMainImageSrc(item.itemId)} alt={item.itemName} className="order-product-image-unique" />
                                </div>
                                <div className="order-product-details-unique">
                                    <p className="order-product-title-unique">상품: {item.itemName} / {option.size} / {option.color} </p>
                                    <p className="order-product-price-unique">가격: {item.price?.toLocaleString()} 원</p>
                                    <p className="order-product-quantity-unique">수량: {option.quantity}</p>
                                </div>
                            </div>
                        ))
                    ))}
                    <p className="order-total-amount-unique">총 상품 금액: {productTotal.toLocaleString()} 원</p>
                    <p className="order-total-amount-unique">배송비: {shipping.toLocaleString()} 원</p>
                    <p className="order-total-amount-unique">총 결제 금액: {total.toLocaleString()} 원</p>
                    <button
                        className="custom-button-primary submit-order-button"
                        onClick={handleSubmitOrder}
                    >
                        결제하기
                    </button>
                </div>
            </div>

            {/* 주소선택화면 */}
            <Modal show={showAddressModal} onHide={handleCloseAddressModal}>
                <Modal.Header closeButton>
                    <Modal.Title>배송지 선택</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {addresses.length > 0 ? addresses.filter(address => {
                            console.log('Filtering address:', address);
                            return address.memberId === user.id;
                        }).map(address => (
                            <ListGroup.Item key={address.id} action onClick={() => handleSelectAddress(address)} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p><strong>{address.addrName}</strong></p>
                                    <p>{address.addr} {address.addrDetail}</p>
                                </div>
                                <div>
                                    <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleEditAddress(address); }}>수정</Button>
                                    <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address.id); }}>삭제</Button>
                                </div>
                            </ListGroup.Item>
                        )) : <p>저장된 주소가 없습니다.</p>}
                    </ListGroup>
                    <Button variant="secondary" onClick={() => setShowAddAddressModal(true)}>주소 추가</Button>
                </Modal.Body>
            </Modal>

            {/* 주소추가화면 */}
            <Modal show={showAddAddressModal} onHide={() => setShowAddAddressModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>주소 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formAddrName">
                            <Form.Label>배송지명</Form.Label>
                            <Form.Control type="text" name="addrName" value={newAddress.addrName} onChange={handleNewAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="formRecipientName">
                            <Form.Label>수령자</Form.Label>
                            <Form.Control type="text" name="recipientName" value={newAddress.recipientName} onChange={handleNewAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="formRecipientTel">
                            <Form.Label>휴대전화 번호</Form.Label>
                            <Form.Control type="text" name="recipientTel" value={newAddress.recipientTel} onChange={handleNewAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="formZipcode">
                            <Form.Label>우편번호</Form.Label>
                            <div className="d-flex">
                                <Form.Control type="text" name="zipcode" value={newAddress.zipcode} onChange={handleNewAddressChange} readOnly className="order-custom-zipcode" />
                                <Button variant="secondary" onClick={handlePostcode}>주소찾기</Button>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formAddr">
                            <Form.Label>주소</Form.Label>
                            <Form.Control type="text" name="addr" value={newAddress.addr} onChange={handleNewAddressChange} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formAddrDetail">
                            <Form.Label>상세주소</Form.Label>
                            <Form.Control type="text" name="addrDetail" value={newAddress.addrDetail} onChange={handleNewAddressChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddAddress}>저장</Button>
                </Modal.Footer>
            </Modal>

            {/* 주소수정화면 */}
            <Modal show={showEditAddressModal} onHide={() => setShowEditAddressModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>주소 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formRecipientName">
                            <Form.Label>수령자</Form.Label>
                            <Form.Control type="text" name="recipientName" value={formData.recipientName} onChange={handleEditAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="formAddrName">
                            <Form.Label>배송지명</Form.Label>
                            <Form.Control type="text" name="addrName" value={formData.addrName} onChange={handleEditAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="formRecipientTel">
                            <Form.Label>휴대전화 번호</Form.Label>
                            <Form.Control type="text" name="recipientTel" value={formData.recipientTel} onChange={handleEditAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="formZipcode">
                            <Form.Label>우편번호</Form.Label>
                            <div className="d-flex">
                                <Form.Control type="text" name="zipcode" value={formData.zipcode} onChange={handleEditAddressChange} readOnly />
                                <Button variant="secondary" onClick={handlePostcode}>주소찾기</Button>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formAddr">
                            <Form.Label>주소</Form.Label>
                            <Form.Control type="text" name="addr" value={formData.addr} onChange={handleEditAddressChange} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formAddrDetail">
                            <Form.Label>상세주소</Form.Label>
                            <Form.Control type="text" name="addrDetail" value={formData.addrDetail} onChange={handleEditAddressChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSaveEditedAddress}>수정하기</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default Order;
