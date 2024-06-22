import { ListGroup } from 'react-bootstrap/';
import { useNavigate, Outlet } from 'react-router-dom';
import LINKS from '../links/links';
import './AdminMainPage.css';

function AdminPage() {
    const navigate = useNavigate();

    return (
        <div className='AdminMainPage_Admin'>
            <div className='AdminMainPage_header'>헉! Admin Page임.</div>
            <div className='AdminMainPage_left-menu'>
                <ListGroup variant="flush">
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/main') }}>관리자 메인</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/member') }}>사용자 관리</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/category') }}>카테고리 관리</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/item') }}>상품 관리</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/orders') }}>주문 관리</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.ADMIN_PAGE.path + '/brand') }}>브랜드 관리</ListGroup.Item>
                    <ListGroup.Item></ListGroup.Item>
                </ListGroup>
            </div>
            <div className='AdminMainPage_content'>
                <Outlet></Outlet>
            </div>
        </div>
    );
}

export default AdminPage;
