import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components
const LoginContainer = styled.div`
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }

  .loginForm {
    display: flex;
    flex-direction: column;
    gap: 15px;

    input {
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ddd;
      font-size: 16px;
      outline: none;
    }

    button {
      padding: 10px;
      background-color: #383838;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 18px;
      cursor: pointer;
      transition: background-color 0.3s;
      outline: none;
    }

  }

  p {
    font-size: 16px;
    margin-top: 20px;

    .register-link {
      color: #007bff;
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;

function Login({ updateLoginStatus }) {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const token = '';
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://usms.serveftp.com/api/login',
        {
          username,
          password,
          token,
        },
        {
          withCredentials: true, // 이 줄을 추가하여 자격 증명을 포함시킵니다
        }
      );
  
      console.log(document.cookie)
      const { code, data } = response.data;
      switch (response.status) {
        case 200:
          // 로그인 성공
          updateLoginStatus(true);
          const cookie = response.headers['Set-Cookie'];
          document.cookie = cookie;
          history.push('/store-management');
          break;
          
        case 400:
          // 아이디 또는 패스워드가 일치하지 않을 경우
          setWarningMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
          break;
        default:
          console.log(`처리되지 않은 응답 코드: ${code}`);
      }
    } catch (error) {
      console.error('로그인 요청 에러:', error);
      setWarningMessage('로그인 중 에러가 발생했습니다. 다시 시도해주세요.');
    }
  };

// handleRegister 함수 정의
const handleRegister = () => {
  history.push('/register');
};

  return (
    <LoginContainer>
      <h2>로그인</h2>
      <form className="loginForm">
        <input
          type="text"
          value={username}  // 변수명을 'username'으로 변경
          onChange={(e) => setUsername(e.target.value)}  // 변수명을 'username'으로 변경
          placeholder="아이디"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
        <button type="button" onClick={handleLogin}>
          로그인
        </button>
      </form>
    </LoginContainer>
  );
}

export default Login;