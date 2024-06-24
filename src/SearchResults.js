import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Col } from 'react-bootstrap/';
import { apiInstance } from './util/api';
import './SearchResults.css';  // 필요한 스타일을 위한 CSS 파일

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const searchQuery = query.get('query');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await apiInstance.get('/items');
        const filteredItems = response.data.filter(item => 
          item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setItems(filteredItems);
      } catch (error) {
        console.error("Failed to fetch items", error);
        setItems([]);
      }
    };
    fetchItems();
  }, [searchQuery]);

  const getMainImageSrc = (itemImageDTOs) => {
    const mainImage = itemImageDTOs.find(image => image.isMain);
    return mainImage ? mainImage.filePath : '';
  };

  const chunkedItems = (items, size) => {
    const result = [];
    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size));
    }
    return result;
  };

  const itemsInRows = Array.isArray(items) ? chunkedItems(items, 3) : [];

  return (
    <div className="searchResults-search-results">
      <h4>"{searchQuery}"로 검색된 결과에요!</h4>
      {items.length > 0 ? (
        <div className="searchResults-Products">
          {itemsInRows.map((row, rowIndex) => (
            <div className="searchResults-row" key={rowIndex}>
              {row.map((item, index) => (
                <Col xs key={index}>
                  <img src={getMainImageSrc(item.itemImageDTOs)} width="150px" height="150px" alt={item.itemName} />
                  <Link style={{ textDecoration: "none" }} to={`/detail/${item.id}`} state={{ item }}>
                    <h4>{item.itemName}</h4>
                  </Link>
                  <p style={{ color: "black" }}>{item.content}</p>
                  <p>가격 : {item.price}</p>
                </Col>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}

export default SearchResults;
