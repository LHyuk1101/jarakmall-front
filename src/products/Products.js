import { Col } from 'react-bootstrap/';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Products({ items, setItems }) {

  const chunkedItems = (items, size) => {
    const result = [];
    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size));
    }
    return result;
  }

  const itemsInRows = chunkedItems(items, 3);

  return (
    <div className="Products">
      {itemsInRows.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((item, index) => (
            <Col xs key={index}>
              <img src={'https://codingapple1.github.io/shop/shoes' + (rowIndex * 3 + index + 1) + '.jpg'} width="150px" height="150px"></img>
              <Link style={{ textDecoration: "none" }} to={'/detail/' + item.id}><h4>{item.title}</h4></Link>
              <p style={{ color: "black" }}>{item.content}</p>
              <p>가격 : {item.price}</p>
            </Col>
          ))}
        </div>
      ))}
      <button onClick={() => {
        axios.get('https://codingapple1.github.io/shop/data2.json')
          .then((result) => {
            console.log(result);
            const copy = [...items, ...result.data];
            setItems(copy);
          })
      }}>axios get요청으로 api요청해다가 상품 목록 추가해서 늘리기</button>
    </div>
  );
}

export default Products;
