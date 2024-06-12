import { ListGroup, Stack } from 'react-bootstrap/';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import './Admin.css';
import LINKS from '../links/links';
import Members from '../Members';

function AdminPage() {
    const navigate = useNavigate();

    return (
        <div className='Admin'>
            <div className='header'>헉! Admin Page임.</div>
            <div className='left-menu'>
                <ListGroup variant="flush">
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/main') }}>관리자 메인</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/member') }}>사용자 관리</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/category') }}>카테고리 관리</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/item') }}>상품 관리</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/order') }}>주문 관리</ListGroup.Item>
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

export default AdminPage;
