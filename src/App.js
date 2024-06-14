import 'bootstrap/dist/css/bootstrap.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import BgImg from './images/bg.png';
import { Container } from 'react-bootstrap/';
import Detail from './pages/Detail.js';
import AdminPage from './adminpage/AdminMainPage.js';
import RegisterPage from './pages/RegisterPage.js';
import LoginPage from './pages/LoginPage.js';
import './App.css';
import LINKS from './links/links.js';
import NavigationBar from './navbar/MainNavbar.js';
import Products from './products/Products.js';
import Members from './pages/Members.js';
import MemberEdit from './pages/MemberEdit.js';
import MyPage from './pages/MyPage.js';
import AdminMain from './adminpage/AdminMain.js';
import useBannerStore from './stores/useBannerStore';
import Order from './pages/Order.js';
import Category from './pages/Category.js';
import Carts from './pages/Carts.js';

function App() {
const { mainBanner } = useBannerStore();
  return (
    <div className="App">
      <NavigationBar />
      <Routes>
        <Route path={LINKS.HOME.path} element={
          <>
            <div className='main-bg' style={{ backgroundImage: 'url(' + mainBanner + ')' }}></div>
            <div>전체상품목록</div>
            <Container>
              <Products />
            </Container>
          </>
        } />
        <Route path='/detail/:itemId' element={<Detail />} />

        <Route path={LINKS.ADMIN_PAGE.path} element={<AdminPage />}>
          <Route path='main' element={<AdminMain/>} />
          <Route path='member' element={<Members></Members>} />
          <Route path='category' element={<Category/>} />
          <Route path='item' element={<div>여긴 상품관리를 해야할거같고</div>} />
          <Route path='order' element={<div>여긴 주문을 관리해야할거같아요</div>} />
        </Route>

        <Route path={LINKS.MYPAGE.path} element={<MyPage/>}>
          <Route path='edit' element={<MemberEdit/>}/>
          <Route path='orders' element={<div>내 주문내역 보는 영역</div>}/>
        </Route>

        <Route path={LINKS.REGISTER.path} element={<RegisterPage />} />
        <Route path={LINKS.LOGIN.path} element={<LoginPage />} />
        <Route path='/about' element={<About />}>
          <Route path='team6' element={<div>안녕하세요 6팀이에요</div>} />
        </Route>

        <Route path='/order' element={<Order />} />

        <Route path='/carts' element={<Carts/>} />

        <Route path='*' element={<div>404</div>} />
      </Routes>
    </div>
  );
}
function About() {
  return (
    <div>
      <h4>데단헤! 앨리스 구름길 3기!</h4>
      <Outlet></Outlet>
    </div>
  )
}

export default App;
