import { Form, Button, Stack } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';

function RegisterPage(){

    let [formData, setFormData] = useState({
        displayName: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        gender: ''
    });

    let navigate = useNavigate();

    let handleChange = (e) => {
        let {name, value} = e.target;
        setFormData({
            ...formData,[name]: value
        });
    };

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = await axios.post('/register', formData);
            console.log(response.data);
            navigate('/');
        } catch (error) {
            console.error('에러터졌어요', error);
            // 에러 처리 로직 추가하면 될듯...
        }
    };
    

    return(
       
        <div className='Register'>
            <div>회원가입페이지 뭐 그런느낌이에요</div>
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="이름을 입력하세요"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>아이디</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="아이디를 입력하세요"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>이메일</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="이메일을 입력하세요"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>휴대폰번호</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="휴대폰번호를 입력하세요"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>성별</Form.Label>
                    <div>
                        <Form.Check
                            inline
                            type="radio"
                            label="남"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleChange}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            label="여"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleChange}
                        />
                    </div>
                </Form.Group>

                <Button variant="primary" type="submit">
                    회원가입
                </Button>
            </Form>
        </div>
        

    )
}

export default RegisterPage;