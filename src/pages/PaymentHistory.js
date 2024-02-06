import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

// Styled Components
const DataTable = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  width: 1200px;
  transition: transform 0.2s;
  z-index: 1;
`;

const DataTableHeader = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  z-index: 1;
`;

const DataTableTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  z-index: 1;

  tbody tr:hover {
    background-color: #f5f5f5;
  }
`;

const DataTableTh = styled.th`
  border-bottom: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  height: 30px;
  background-color: #ffffff;
  color: #9a9a9a;
`;

const DataTableTd = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  height: 30px;

  &:last-child {
    border-right: 1px solid transparent;
  }

  color: #333;
`;

const SearchBarContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  width: 1200px;
  margin-bottom: 20px;
  position: relative;
  transition: transform 0.2s;
  z-index: 1;
`;

const SearchBarInput = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid transparent;
  background-color: white;
  cursor: text;
  outline: none;
  width: 1120px;
  height: 1px;
  padding-left: 80px;
  font-size: 16px;
`;

const SearchBarButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: rgb(143, 143, 143);
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 70px;
  font-size: 18px;
`;

// ---------------------------------------스타일 끝---------------------------------

function PaymentHistory({ limit, isHomeView }) {
  // 랜덤 결제금액 생성 함수
  const getRandomAmount = () => {
    const amountInWon = Math.floor(Math.random() * 1000) * 1000;
    return `${amountInWon.toLocaleString()}원`;
  };

  // 랜덤 구매일시 생성 함수
  const getRandomPurchaseTime = () => {
    const year = 2023;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isHomeView ? limit : 20);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [setSearchingKeyword] = useState('');

  useEffect(() => {
    // 결제 내역 샘플 데이터 생성
    const sampleData = Array.from({ length: 100 }, (_, index) => ({
      purchaser: `결제자 ${index + 1}`,
      email: `이메일 ${index + 1}`,
      description: `상세 내용 ${index + 1}`,
      purchaseTime: getRandomPurchaseTime(),
      amount: getRandomAmount(),
    }));
    setPaymentHistory(sampleData);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setIsSearching(true);
    setSearchResult(
      searchKeyword !== ''
        ? paymentHistory.filter(
            (payment) =>
              payment.purchaser.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              payment.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              payment.description.toLowerCase().includes(searchKeyword.toLowerCase())
          )
        : []
    );
    setIsSearching(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // 현재 페이지의 결제 내역의 시작 인덱스와 끝 인덱스 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // 현재 페이지에 보여질 결제 내역 데이터
  const currentPaymentHistory = isSearching
    ? [] // 검색 중이면 검색 결과를 보여줌
    : (searchResult.length > 0 && searchKeyword !== '')
    ? searchResult.slice(startIndex, endIndex)
    : paymentHistory.slice(startIndex, endIndex);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);

  // 페이지 번호 목록 생성
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {!isHomeView && (
        <SearchBarContainer className={searchKeyword ? 'search-bar-container-expanded' : ''}>
          <SearchBarInput
            type="text"
            placeholder="검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchBarButton onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </SearchBarButton>
        </SearchBarContainer>
      )}

      <DataTable>
        <DataTableHeader>결제 내역</DataTableHeader>

        <DataTableTable>
          <thead>
            <tr>
              <DataTableTh>번호</DataTableTh>
              <DataTableTh>결제자</DataTableTh>
              <DataTableTh>이메일</DataTableTh>
              <DataTableTh>상세내용</DataTableTh>
              <DataTableTh>구매일시</DataTableTh>
              <DataTableTh>결제금액</DataTableTh>
            </tr>
          </thead>
          <tbody>
            {currentPaymentHistory.map((payment, index) => (
              <tr key={index + 1}>
                <DataTableTd>{index + 1}</DataTableTd>
                <DataTableTd>{payment.purchaser}</DataTableTd>
                <DataTableTd>{payment.email}</DataTableTd>
                <DataTableTd>{payment.description}</DataTableTd>
                <DataTableTd>{payment.purchaseTime}</DataTableTd>
                <DataTableTd>{payment.amount}</DataTableTd>
              </tr>
            ))}
          </tbody>
        </DataTableTable>

        {!isHomeView && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </DataTable>
    </div>
  );
}

export default PaymentHistory;