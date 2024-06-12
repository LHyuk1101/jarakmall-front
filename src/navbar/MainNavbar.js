import { NavDropdown, Navbar, Nav, Form, Container, Button } from 'react-bootstrap/';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LINKS from '../links/links.js';
import useUserStore from '../stores/useUserStore.js';

function NavigationBar() {

  const user = useUserStore(state => state.user);
  const logout = useUserStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('/logout'); // 로그아웃 API 요청
      logout(); // 상태 초기화
      navigate(LINKS.HOME.path); // 메인 페이지로 리다이렉션
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href={LINKS.HOME.path}>쑈핑모올</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
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
            <Nav.Link href="#" disabled>비활성화</Nav.Link>
          </Nav>
          <Nav>
            <Navbar.Text>
            {
              !user && (
                <>
                  <Link to={LINKS.LOGIN.path}>
                    <Button variant="outline-dark">로그인</Button>
                  </Link>
                </>
              )
            }
            </Navbar.Text>
            <Navbar.Text>
              {
              user && (
                <>
                  <Link to={LINKS.LOGOUT.path}>
                    <Button variant="outline-dark" onClick={handleLogout}>로그아웃</Button>
                  </Link>
                </>
              )
            }
            </Navbar.Text>
            <Navbar.Text>
              {
              !user && (
                <>
                  <Link to={LINKS.REGISTER.path}>
                    <Button variant="outline-dark">회원가입</Button>
                  </Link>
                </>
              )
            }
            </Navbar.Text>
            <Navbar.Text>
            {
              user && (
                <>
                  <Link to={LINKS.MYPAGE.path}>
                    <Button variant="outline-dark">마이페이지</Button>
                  </Link>
                </>
              )
            }
            </Navbar.Text>
            <Navbar.Text>
            {
              user && user.authority === 'ADMIN' && (
                <Navbar.Text>
                  <Link to={LINKS.ADMIN_PAGE.path}>
                    <Button variant="outline-dark">관리자</Button>
                  </Link>
                </Navbar.Text>
              )
            }
            </Navbar.Text>
            <Navbar.Text>
              {
              user && (
                <>
                  <Link to={LINKS.CART.path}>
                    <Button variant="outline-dark">장바구니</Button>
                  </Link>
                </>
              )
            }
            </Navbar.Text>
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
