import React, { useEffect, useState } from 'react';
import { NavDropdown, Navbar, Nav, Form, Container, Button } from 'react-bootstrap/';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LINKS from '../links/links.js';
import useUserStore from '../stores/useUserStore.js';

function NavigationBar() {
  const user = useUserStore(state => state.user);
  const logout = useUserStore(state => state.logout);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        // console.log('전체 카테고리 로드:', response.data);  // 콘솔 로그 추가
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/members-logout');
      logout();
      navigate(LINKS.HOME.path);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const renderSubCategories = (parentId) => {
    const subCategories = categories.filter(category => category.parentId === parentId);
    // console.log(`자식카테고리 로드 ${parentId}:`, subCategories);  // 콘솔 로그 추가
    return subCategories.map(subCategory => (
      <NavDropdown.Item key={subCategory.id} href={`/categories/${subCategory.id}`}>
        {subCategory.name}
      </NavDropdown.Item>
    ));
  };

  const renderCategories = () => {
    const parentCategories = categories.filter(category => category.parentId === null);
    // console.log('부모카테고리 로드:', parentCategories);  // 콘솔 로그 추가
    return parentCategories.map(category => (
      <NavDropdown title={category.name} id={`navbarScrollingDropdown-${category.id}`} key={category.id}>
        {renderSubCategories(category.id)}
      </NavDropdown>
    ));
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href={LINKS.HOME.path}>쑈핑모올</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            {renderCategories()}
            <Nav.Link href="#" disabled>비활성화</Nav.Link>
          </Nav>
          <Nav>
            {!user && (
              <Navbar.Text>
                <Link to={LINKS.LOGIN.path}>
                  <Button variant="outline-dark">로그인</Button>
                </Link>
              </Navbar.Text>
            )}
            {user && (
              <Navbar.Text>
                <Link to={LINKS.LOGOUT.path}>
                  <Button variant="outline-dark" onClick={handleLogout}>로그아웃</Button>
                </Link>
              </Navbar.Text>
            )}
            {!user && (
              <Navbar.Text>
                <Link to={LINKS.REGISTER.path}>
                  <Button variant="outline-dark">회원가입</Button>
                </Link>
              </Navbar.Text>
            )}
            {user && (
              <Navbar.Text>
                <Link to={LINKS.MYPAGE.path}>
                  <Button variant="outline-dark">마이페이지</Button>
                </Link>
              </Navbar.Text>
            )}
            {user && user.authority === 'ADMIN' && (
              <Navbar.Text>
                <Link to={LINKS.ADMIN_PAGE.path}>
                  <Button variant="outline-dark">관리자</Button>
                </Link>
              </Navbar.Text>
            )}
            {user && (
              <Navbar.Text>
                <Link to={LINKS.CART.path}>
                  <Button variant="outline-dark">장바구니</Button>
                </Link>
              </Navbar.Text>
            )}
          </Nav>
          <Form className="d-flex">
            <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
