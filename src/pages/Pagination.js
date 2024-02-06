// Pagination.js
import React from 'react';
import styled from 'styled-components';

// Styled Components
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;

  &:hover {
    background-color: #f3f3f3;
  }

  &.active {
    background-color: #f5f5f5;
  }

  &:disabled {
    cursor: not-allowed;
    color: #999;
  }
`;

function Pagination({ currentPage, totalPages, onPageChange }) {
  // 부모 컴포넌트에서 전달된 onPageChange를 이용한 handlePageChange 함수
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <PaginationContainer>
      {/* 이전 페이지 버튼 */}
      <PaginationButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전 페이지
      </PaginationButton>

      {/* 페이지 번호 버튼 */}
      {Array.from({ length: totalPages }, (_, index) => (
        <PaginationButton
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
        </PaginationButton>
      ))}

      {/* 다음 페이지 버튼 */}
      <PaginationButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음 페이지
      </PaginationButton>
    </PaginationContainer>
  );
}

export default Pagination;
