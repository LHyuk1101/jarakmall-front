import 'bootstrap/dist/css/bootstrap.css';
import { Routes, Route, Outlet } from 'react-router-dom';
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
import Order from './pages/Order.js';
import OrderComplete from './pages/OrderComplete';
import Orders from './pages/Orders.js';
import OrderDetail from './pages/OrderDetail';
import AdminOrder from './adminpage/AdminOrder';
import Category from './pages/Category.js';
import Carts from './pages/Carts.js';
import Brand from './pages/Brand.js';
import AdminItemPage from './adminpage/AdminItemPage.js';
import BannerSlider from './BannerSlider.js';
import useBannerStore from './stores/useBannerStore';
import SearchResults from './SearchResults.js';

function App() {
  const { currentBanner } = useBannerStore();
  return (
    <div className="App">
      <NavigationBar />
      <Routes>
        <Route path={LINKS.HOME.path} element={
          <>
            <div className="banner-container">
              <BannerSlider />
            </div>
            <Container>
              <Products />
            </Container>
          </>
        } />
        <Route path='/detail/:itemId' element={<Detail />} />
        <Route path='/categories/:categoryId' element={<Products />} />

        <Route path={LINKS.ADMIN_PAGE.path} element={<AdminPage />}>
          <Route path='main' element={<AdminMain/>} />
          <Route path='member' element={<Members></Members>} />
          <Route path='category' element={<Category/>} />
          <Route path='item' element={<AdminItemPage/>} />
          <Route path='orders' element={<AdminOrder/>} />
          <Route path='brand' element={<Brand/>} />
        </Route>

        <Route path={LINKS.MYPAGE.path} element={<MyPage/>}>
          <Route path='edit' element={<MemberEdit/>} />
          <Route path='orders' element={<Orders />} />
          <Route path='orders/order/:orderId' element={<OrderDetail />} />
        </Route>

        <Route path={LINKS.REGISTER.path} element={<RegisterPage />} />
        <Route path={LINKS.LOGIN.path} element={<LoginPage />} />
        <Route path='/about' element={<About />}>
          <Route path='team6' element={<div>안녕하세요 6팀이에요</div>} />
        </Route>

        <Route path='/orders' element={<Order />} />
        <Route path='/orders/complete' element={<OrderComplete />} />

        <Route path='/carts' element={<Carts/>} />

        <Route path='/search' element={<SearchResults/>}/>

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
  );
}

export default App;
