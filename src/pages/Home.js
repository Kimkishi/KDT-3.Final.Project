import React from 'react';
import { useHistory } from 'react-router-dom';
import StoreManagement from './StoreManagement';
import MemberInfo from './MemberInfo';
import PaymentHistory from './PaymentHistory';
import QA from './QA';
import Dashboard from './Dashboard';
import styled from 'styled-components';

// 스타일을 적용한 버튼 컴포넌트
const MoreButton = styled.button`
  background-color: transparent;
  color: black;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  float: right;
  margin-top: 27px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &::after {
    content: "\f105";
    font-family: FontAwesome;
    margin-left: 5px;
  }

  &:hover {
    background-color: #ccc; /* 마우스 오버 시 배경색 변경 예시 */
  }
`;

function Home() {
  const history = useHistory();

  const handleMoreClick = (path) => {
    history.push(path);
  };

  return (
    <div>
      <h1>홈 화면</h1>
      <div className="component-margin">
        <Dashboard />
      </div>

      <div className="component-margin">
        <div className="container-header">
          {/* 스타일이 적용된 버튼 컴포넌트 사용 */}
          <MoreButton onClick={() => handleMoreClick('/store-management')}>더 보기</MoreButton>
        </div>
        {/* hideFilter와 hideEdit prop을 사용하여 필터 및 수정 기능을 숨깁니다. */}
        <StoreManagement limit={5} isHomeView={true} hideFilter={true} hideEdit={true} />
      </div>

      <div className="component-margin">
        <div className="container-header">
          {/* 스타일이 적용된 버튼 컴포넌트 사용 */}
          <MoreButton onClick={() => handleMoreClick('/member-info')}>더 보기</MoreButton>
        </div>
        <MemberInfo limit={5} isHomeView={true} />
      </div>

      <div className="component-margin">
        <div className="container-header">
          {/* 스타일이 적용된 버튼 컴포넌트 사용 */}
          <MoreButton onClick={() => handleMoreClick('/payment-history')}>더 보기</MoreButton>
        </div>
        <PaymentHistory limit={5} isHomeView={true} />
      </div>

      <div className="component-margin">
        <div className="container-header">
          {/* 스타일이 적용된 버튼 컴포넌트 사용 */}
          <MoreButton onClick={() => handleMoreClick('/qa')}>더 보기</MoreButton>
        </div>
        <QA limit={5} isHomeView={true} />
      </div>
    </div>
  );
}

export default Home;
