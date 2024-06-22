import { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap/';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiInstance } from '../util/api';

function Products() {
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [itemsOffset, setItemsOffset] = useState(0);
  const itemsPerPage = 9;
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    apiInstance.get('/items')
      .then((result) => {
        setItems(result.data);
        setDisplayItems(result.data.slice(0, itemsPerPage));
      })
      .catch((error) => {
        console.error("상품 데이터를 못 가져왔음요: ", error);
      });
  }, []);

  useEffect(() => {
    let filteredItems = items;
    if (categoryId) {
      filteredItems = filteredItems.filter(item => item.categoryId === parseInt(categoryId));
    }
    if (query) {
      filteredItems = filteredItems.filter(item => item.itemName.toLowerCase().includes(query.toLowerCase()));
    }
    setDisplayItems(filteredItems.slice(0, itemsPerPage));
    setItemsOffset(0);
  }, [categoryId, query, items]);

  const loadMoreItems = () => {
    const newOffset = itemsOffset + itemsPerPage;
    setItemsOffset(newOffset);
    setDisplayItems(displayItems.concat(items.slice(newOffset, newOffset + itemsPerPage)));
  };

  const chunkedItems = (items, size) => {
    const result = [];
    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size));
    }
    return result;
  };

  const itemsInRows = Array.isArray(displayItems) ? chunkedItems(displayItems, 3) : [];

  const getMainImageSrc = (itemImageDTOs) => {
    const mainImage = itemImageDTOs.find(image => image.isMain);
    return mainImage ? mainImage.filePath : '';
  };

  return (
    <div className="Products">
      {Array.isArray(itemsInRows) && itemsInRows.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {Array.isArray(row) && row.map((item, index) => (
            <Col xs key={index}>
              <img src={getMainImageSrc(item.itemImageDTOs)} width="150px" height="150px" alt={item.itemName}></img>
              <Link style={{ textDecoration: "none" }} to={`/detail/${item.id}`} state={{ item }}>
                <h4>{item.itemName}</h4>
              </Link>
              <p style={{ color: "black" }}>{item.content}</p>
              <p>가격 : {item.price}</p>
            </Col>
          ))}
        </div>
      ))}
      {displayItems.length < items.length && (
        <button onClick={loadMoreItems}>상품 더보기</button>
      )}
    </div>
  );
}

export default Products;
