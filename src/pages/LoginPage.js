import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/useUserStore';
import { apiInstance } from '../util/api';
import Cookies from 'js-cookie';
import './LoginPage.css';

/** 
 * 로그인페이지
 */

function LoginPage() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태 추가

    const login = useUserStore(state => state.login);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiInstance.post('/login', credentials);
            console.log('Login response:', response.data); // 로그인 응답 디버깅
            // 응답에 JWT 토큰이 포함되어 있지 않으므로 쿠키에서 JWT 토큰을 읽습니다.
            const jwtToken = Cookies.get('jwtToken');
            console.log('쿠키에 있는 토큰 : ',jwtToken);
            if (jwtToken) {
                sessionStorage.setItem('user', JSON.stringify(response.data)); // 사용자 정보 세션 스토리지에 저장
                login({ ...response.data, jwtToken }); // Zustand 상태 업데이트
                navigate('/');
            } else {
                setErrorMessage('JWT token is not found in the cookies.'); // JWT 토큰이 쿠키에 없을 때의 에러 처리
            }
        } catch (error) {
            console.error("Login failed:", error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message); // 서버에서 반환된 에러 메시지 설정
            } else {
                setErrorMessage('Login failed. Please try again.'); // 일반적인 에러 메시지 설정
            }
        }
    };

    return (
        <div className='LoginPage_LoginPage'>
            <div>자락몰에 오신것을 환영합니다!</div>
            {errorMessage && <div className="LoginPage_error-message">{errorMessage}</div>} {/* 에러 메시지 표시 */}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 LoginPage_form-group" controlId="formUsername">
                    <Form.Label className="LoginPage_form-label">아이디</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="아이디를 입력하세요"
                     required
                     className="LoginPage_form-control"/>
                </Form.Group>

                <Form.Group className="mb-3 LoginPage_form-group" controlId="formPassword">
                    <Form.Label className="LoginPage_form-label">비밀번호</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                    required
                    className="LoginPage_form-control"/>
                </Form.Group>

                <Button variant="primary" type="submit" className="LoginPage_btn-primary">
                    로그인
                </Button>
            </Form>
        </div>
    );
}

export default LoginPage;
