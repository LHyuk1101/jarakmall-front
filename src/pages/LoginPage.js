import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

function LoginPage(){

    let [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    let navigate = useNavigate();

    let handleChange = (e) => {
      const {name, value} = e.target;
      setCredentials({
        ...credentials,
        [name]: value
      });  
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', credentials);
            console.log(response.data);
            // 로그인 성공 시 "/" 경로로 리다이렉트
            navigate('/');
        } catch (error) {
            console.error('에러터졌어요', error);
        }
    };


    return(
        <div className='LoginPage'>
            <div>로그인 페이지 뭐 그런 느낌적인 느낌이에요</div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>아이디</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="아이디를 입력하세요"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    로그인
                </Button>
            </Form>


        </div>
    );
}

export default LoginPage;