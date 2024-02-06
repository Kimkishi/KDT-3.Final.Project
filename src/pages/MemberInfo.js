import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

// Styled Components
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: margin-left 0.3s ease;
  margin-left: 0;
`;

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
  padding: 10px; /* 수정된 부분 */
  text-align: center;
  height: 20px; /* 수정된 부분 */

  &:last-child {
    border-right: 1px solid transparent;
  }

  &:hover {
    background-color: #f5f5f5;
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


// MemberInfo 컴포넌트 정의
const MemberInfo = ({ limit, isHomeView }) => {
  // 상태 정의
  const [currentItems, setCurrentItems] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userSession, setUserSession] = useState(null);

  // 랜덤 가입일 생성 함수
  const generateRandomDate = (() => {
    const fixedDate = new Date(2022, 0, 1);
    return fixedDate.toISOString().split('T')[0];
  })();

  // 전체 회원 정보 생성
  const totalMembers = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `사용자 ${index + 1}`,
    email: `user${index + 1}@example.com`,
    phone: `010-0000-${String(index + 1).padStart(4, '0')}`,
    registrationDate: generateRandomDate,
  }));

  // 페이지 및 수정 상태 관리 State
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지당 아이템 수 및 검색 키워드 State
  const [itemsPerPage] = useState(isHomeView ? 5 : 20);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchingKeyword, setSearchingKeyword] = useState('');

  // 페이지 변경 및 검색 키워드 변경에 따른 처리
  useEffect(() => {
    updateCurrentItems();
    
  }, [currentPage, itemsPerPage, searchingKeyword, isSearching, searchResult]);
  

  // 현재 페이지에 보여질 아이템 업데이트
  const updateCurrentItems = () => {
    const filteredMembers = isSearching ? searchResult : totalMembers;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filteredMembers.slice(indexOfFirstItem, indexOfLastItem));
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil((isHomeView ? limit : totalMembers.length) / itemsPerPage);

  // 검색 핸들러
  const handleSearch = () => {
    console.log('검색 중...');
    setCurrentPage(1);
    setIsSearching(true);
    setSearchingKeyword(searchKeyword);
  
// 검색 결과를 찾기 위해 비동기로 처리
const searchResults = searchKeyword !== ''
  ? totalMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        member.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        member.phone.includes(searchKeyword)
    )
  : [];

setSearchResult(searchResults, () => {
  setIsSearching(false);
});
  }
  // Enter 키로 검색
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

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
        <DataTableHeader>회원 정보</DataTableHeader>

        <DataTableTable>
          <thead>
            <tr>
              <DataTableTh>번호</DataTableTh>
              <DataTableTh>이름</DataTableTh>
              <DataTableTh>이메일</DataTableTh>
              <DataTableTh>연락처</DataTableTh>
              <DataTableTh>가입일</DataTableTh>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((member, index) => (
              <tr key={member.id}>
                <DataTableTd>{index + 1}</DataTableTd>
                <DataTableTd>{member.name}</DataTableTd>
                <DataTableTd>{member.email}</DataTableTd>
                <DataTableTd>{member.phone}</DataTableTd>
                <DataTableTd>{member.registrationDate}</DataTableTd>
              </tr>
            ))}
          </tbody>
        </DataTableTable>

        {!isHomeView && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </DataTable>
    </div>
  );
};

export default MemberInfo;