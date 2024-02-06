import React, { useState } from 'react';
import Pagination from './Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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

// DataTableTable 스타일 수정
const DataTableTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  z-index: 1;

  tbody tr:hover {
    background-color: #f5f5f5;
  }
`;

// TitleTh 스타일 추가
const DataTableTh = styled.th`
  border-bottom: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  height: 30px;
  color: #9a9a9a;
`;

// TitleTh 스타일 추가
const TitleTh = styled(DataTableTh)`
  width: auto;
  white-space: nowrap;
`;

// TitleTr 스타일 추가
const TitleTr = styled.tr`
  ${TitleTh} {
    width: 70%; /* 제목 탭의 너비 조정 */
  }
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

const ModalBackground = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 3;
`;

const ModalContent = styled.div`
  // Add your modal content styles here
`;

const ModalButtons = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`;

const ModalButton = styled.button`
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ddd;
  }
`;

function QA({ isHomeView }) {
  const initialPosts = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    title: `질문 ${index + 1}`,
    content: `질문 내용 ${index + 1}`,
    author: `작성자 ${String.fromCharCode(65 + (index % 26))}`,
    time: `2023-01-${String(index + 1).padStart(2, '0')}`,
  }));

  const [posts, setPosts] = useState(initialPosts);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = isHomeView ? 5 : 20;

  const handleSearch = () => {
    const newFilteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setCurrentPage(1);
    setFilteredPosts(newFilteredPosts);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditPost = () => {
    // Implement edit post logic here
    // You can open another modal for editing or redirect to an edit page
    console.log('Editing post with ID:', selectedPostId);
  };

  const handleDeletePost = () => {
    // Implement delete post logic here
    // You can open a confirmation modal before deleting
    console.log('Deleting post with ID:', selectedPostId);
  };

  const handlePostClick = (postId) => {
    openModal(postId);
  };

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = (filteredPosts.length > 0 ? filteredPosts : posts).slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const totalPages = Math.ceil(
    (filteredPosts.length > 0 ? filteredPosts.length : posts.length) / itemsPerPage
  );

  const selectedPost = selectedPostId
    ? filteredPosts.length > 0
      ? filteredPosts.find((post) => post.id === selectedPostId)
      : posts.find((post) => post.id === selectedPostId)
    : null;

  const openModal = (postId) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPostId(null);
    setIsModalOpen(false);
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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <SearchBarButton onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </SearchBarButton>
        </SearchBarContainer>
      )}

      <DataTable>
        <DataTableHeader>Q&A</DataTableHeader>
        <DataTableTable>
          <thead>
            <TitleTr>
              <DataTableTh>번호</DataTableTh>
              <TitleTh>제목</TitleTh>
              <DataTableTh>작성자</DataTableTh>
              <DataTableTh>작성시간</DataTableTh>
              
            </TitleTr>
          </thead>
          <tbody>
            {currentPosts.map((post, index) => (
              <tr key={post.id} onClick={() => handlePostClick(post.id)}>
                <DataTableTd>{index + 1}</DataTableTd>
                <DataTableTd>{post.title}</DataTableTd>
                <DataTableTd>{post.author}</DataTableTd>
                <DataTableTd>{post.time}</DataTableTd>
                
              </tr>
            ))}
          </tbody>
        </DataTableTable>

        {!isHomeView && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </DataTable>

      {/* Modal */}
      <ModalBackground isOpen={isModalOpen} onClick={closeModal}>
        <ModalContainer>
          <ModalContent>
            {selectedPost && (
              <>
                <h2>{selectedPost.title}</h2>
                <p>{selectedPost.content}</p>
                <p>작성자: {selectedPost.author}</p>
                <p>작성시간: {selectedPost.time}</p>
                <ModalButtons>
                  <ModalButton onClick={handleEditPost}>
                    <FontAwesomeIcon icon={faEdit} /> 수정
                  </ModalButton>
                  <ModalButton onClick={handleDeletePost}>
                    <FontAwesomeIcon icon={faTrash} /> 삭제
                  </ModalButton>
                </ModalButtons>
              </>
            )}
          </ModalContent>
        </ModalContainer>
      </ModalBackground>
    </div>
  );
}

export default QA;
