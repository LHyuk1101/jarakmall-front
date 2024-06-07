import {NavDropdown,Navbar,Nav,Form,Container,Button, Row,Col} from 'react-bootstrap/';
import BgImg from './images/bg.png'; 
import { useState } from 'react';
import data from './pages/data.js';
import {Routes, Route, Link, useNavigate, Outlet} from 'react-router-dom'
import Detail from './pages/Detail.js';
import AdminPage from './adminpage/AdminMainPage.js';
import RegisterPage from './pages/RegisterPage.js';
import LoginPage from './pages/LoginPage.js';
import axios from 'axios';
import './App.css';

function App() {

    let [items, setItems] = useState(data);
    let navigate = useNavigate();

    // shoes 배열을 3개씩 나누어 2차원 배열로 변환하는 함수
  const chunkedItems = (items, size) => {
    let result = [];
    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size));
    }
    return result;
  }

  const itemsInRows = chunkedItems(items, 3);


  return (
    
    <div className="App">

      <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href='/'>쑈핑모올</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <NavDropdown title="MAN" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">머슬핏 티셔츠</NavDropdown.Item>
              <NavDropdown.Item href="#action4">개쩌는 반바지</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">상당한 자켓</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="WOMAN" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">엄청난 셔츠</NavDropdown.Item>
              <NavDropdown.Item href="#action4">굉장한 블라우스</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">기가막힌 슬랙스</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="ACCESSORIES" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">비싼 목걸이</NavDropdown.Item>
              <NavDropdown.Item href="#action4">진짜비싼 반지</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">롤렉스</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#" disabled>
              비활성화
            </Nav.Link>
          </Nav>

          <Nav>
            <Navbar.Text>
              <Button href='/login' variant="outline-dark">로그인</Button>
            </Navbar.Text>
            <Navbar.Text>
              <Button href='/register' variant="outline-dark">회원가입</Button>
            </Navbar.Text>
            <Navbar.Text>
              <Button href="/admin-page" variant="outline-dark">관리자</Button>
            </Navbar.Text>
          </Nav>

        
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>

      <Routes>
        <Route path='/' element={
          <>
          <div className='main-bg' style={{backgroundImage : 'url('+BgImg+')'}}></div>

          <div>전체상품목록</div>
    
          <Container>
          
          {
            itemsInRows.map((row, rowIndex) => (
              <Row key={rowIndex}>
                {
                  row.map((item, index) => (
                    <Products items = {item} itemImg={rowIndex * 3 + index + 1} key={index}></Products>
                  ))
                }
              </Row>
            ))
          }
            <button onClick={() => {
              axios.get('https://codingapple1.github.io/shop/data2.json')
              .then((result)=>{ console.log(result); 
                let copy = [...items, ...result.data];
                setItems(copy);
              })
              
            }}>axios get요청으로 api요청해다가 상품 목록 추가해서 늘리기</button>
        </Container>
        </>
        } />
        <Route path='/detail/:itemId' element={<Detail items={items}/>}/>

        <Route path='/admin-page' element={<AdminPage/>}> 
          <Route path='main' element={<div>여긴 관리자 메인이 있어야할거같고</div>}/>
          <Route path='member' element={<div>여긴 사용자관리가 있어야할거같고</div>}/>
          <Route path='category' element={<div>여긴 카테고리관리가 있어야할거같고</div>}/>
          <Route path='item' element={<div>여긴 상품관리를 해야할거같고</div>}/>
          <Route path='order' element={<div>여긴 주문을 관리해야할거같아요</div>}/>
        </Route>

        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>

        <Route path='/about' element={<About/>}>
            <Route path='team6' element={<div>안녕하세요 6팀이에요</div>}/>
        </Route>
        <Route path='*' element={<div>404냄새나요</div>} />
      </Routes>


      {/* <div className='main-bg' style={{backgroundImage : 'url('+BgImg+')'}}></div>

      <div>상품목록</div>

      <Container>
      
      {
        itemsInRows.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {
              row.map((item, index) => (
                <Products items = {item} itemImg={rowIndex * 3 + index + 1}/>
              ))
            }
          </Row>
        ))
      }

    </Container> */}
    </div>
  );
}

function About(){
  return(
    <div>
      <h4>데단헤! 앨리스 구름길 3기!</h4>
      <Outlet></Outlet>
    </div>
  )
}

function DetailPage(props){
  return(
    <div className="container">
  <div className="row">
    <div className="col-md-6">
      <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="100%" />
    </div>
    <div className="col-md-6">
      <h4 className="pt-5">상품명</h4>
      <p>상품설명</p>
      <p>120000원</p>
      <button className="btn btn-danger">주문하기</button> 
    </div>
  </div>
</div> 
  )
}

function Products(props){
  return (
    
        <Col xs>
          <img src={'https://codingapple1.github.io/shop/shoes'+props.itemImg+'.jpg'} width="150px" height="150px"></img>
          <Link style={{ textDecoration: "none"}} to={'/detail/'+props.items.id}><h4>{props.items.title}</h4></Link>
          <p style={{color: "black"}}>{props.items.content}</p>
          <p>가격 : {props.items.price}</p>
        </Col>
      
  )
}

export default App;
