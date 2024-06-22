import { ListGroup } from 'react-bootstrap/';
import { useNavigate, Outlet } from 'react-router-dom';
import './MyPage.css';
import LINKS from '../links/links';

/** 
 * 마이페이지 메인화면 메뉴통해서 기능접근
 */

function MyPage() {
    const navigate = useNavigate();

    return (
        <div className='MyPage_MyPage'>
            <div className='MyPage_header'>헉! My Page임.</div>
            <div className='MyPage_left-menu'>
                <ListGroup variant="flush">
                    <ListGroup.Item action onClick={() => { navigate(LINKS.MYPAGE.path + '/edit') }}>회원정보 수정</ListGroup.Item>
                    <ListGroup.Item action onClick={() => { navigate(LINKS.MYPAGE.path + '/orders') }}>주문 내역</ListGroup.Item>
                    <ListGroup.Item></ListGroup.Item>
                </ListGroup>
            </div>
            <div className='MyPage_content'>
                <Outlet></Outlet>
            </div>
        </div>
    );
}

export default MyPage;
