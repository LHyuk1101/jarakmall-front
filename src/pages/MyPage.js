import { ListGroup, Stack } from 'react-bootstrap/';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import './MyPage.css';
import LINKS from '../links/links';

function MyPage() {
    const navigate = useNavigate();

    return (
        <div className='MyPage'>
            <div className='header'>헉! My Page임.</div>
            <div className='left-menu'>
                <ListGroup variant="flush">
                    <ListGroup.Item action onClick={() => { navigate(LINKS.MYPAGE.path + '/edit') }}>회원정보 수정</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.MYPAGE.path + '/orders') }}>주문 내역</ListGroup.Item>
                    <ListGroup.Item></ListGroup.Item>
                </ListGroup>
            </div>
            <div className='content'>
                <Outlet></Outlet>
            </div>
            <div className='footer'></div>
        </div>
    );
}

export default MyPage;
