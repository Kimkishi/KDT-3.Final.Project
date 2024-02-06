import React from 'react';
import styled from 'styled-components';

// Styled Components
const DashboardContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
`;

const DashboardTitle = styled.h2`
  color: #333;
`;

const DashboardContent = styled.div`
  display: flex;
  justify-content: space-around;
`;

const DashboardItem = styled.div`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ItemLabel = styled.p`
  margin: 0;
  font-size: 16px;
  color: #666;
`;

const ItemValue = styled.h3`
  margin-top: 10px;
  font-size: 28px;
  color: #333;
`;

function Dashboard() {
  // 대시보드에 표시할 데이터 예시
  const data = {
    totalMembers: 150,
    totalStores: 75,
    totalQuestions: 40,
    totalTransactions: 200
  };

  return (
    <DashboardContainer>
      <DashboardTitle>대시보드</DashboardTitle>
      <DashboardContent>
        <DashboardItem>
          <ItemLabel>총 회원 수</ItemLabel>
          <ItemValue>{data.totalMembers}</ItemValue>
        </DashboardItem>
        <DashboardItem>
          <ItemLabel>총 매장 수</ItemLabel>
          <ItemValue>{data.totalStores}</ItemValue>
        </DashboardItem>
        <DashboardItem>
          <ItemLabel>총 질문 수</ItemLabel>
          <ItemValue>{data.totalQuestions}</ItemValue>
        </DashboardItem>
        <DashboardItem>
          <ItemLabel>총 거래 수</ItemLabel>
          <ItemValue>{data.totalTransactions}</ItemValue>
        </DashboardItem>
      </DashboardContent>
    </DashboardContainer>
  );
}

export default Dashboard;
