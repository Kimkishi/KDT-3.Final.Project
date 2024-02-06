import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const IntroContainerNoSidebar = styled.div`
  text-align: center;
  padding: 50px;
  background-size: cover; /* 배경 이미지를 컨테이너에 맞게 조절 */
  background-position: center center; /* 배경 이미지를 가운데 정렬 */

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: #333; /* Darken the color for better readability */
  }

  p {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    color: #666;
  }

  .login-button {
    padding: 1rem 2rem;
    font-size: 1rem;
    background-color: #383838;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
`;

const Intro = () => {
  return (
    <IntroContainerNoSidebar>
      <h1>USMS 관리자 페이지</h1>
      <p>로그인 후 이용해주세요</p>
      <Link to="/login">
        <button className="login-button">Login</button>
      </Link>
    </IntroContainerNoSidebar>
  );
};

export default Intro;
