import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
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
  ext-align: center;
  height: 30px;

  &:last-child {
    border-right: 1px solid transparent;
  }

  &:hover {
    background-color: #f5f5f5;
  }

  color: #333;

  .attachment-link {
    cursor: pointer; /* 커서를 포인터로 변경 */
    color: #007bff;
    text-decoration: underline;
  }
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

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9998,
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px', // 여기를 조절해서 상단과 하단의 여백을 조절합니다.
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '30%', // Adjusted for a better width
    maxHeight: '70%', // Adjusted for a better height
    overflow: 'auto',
    zIndex: 9999,
  },
};

// EditableField 컴포넌트
const EditableField = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 5px;
  margin-top: -30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  ${(props) => (props.disabled ? 'pointer-events: none;' : '')}

  &.attachment-link {
    cursor: pointer;
    color: #007bff;
    text-decoration: underline;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
`;

const RadioContainer = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
`;

const RadioLabel = styled.label`
  padding: 0.5rem 1rem;
  height: 2.25rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #383838;
  background-color: ${(props) => (props.checked ? '#545454' : 'transparent')}; // Add this line

  &:hover {
    background-color: #f2f4f6;
  }
`;

const RadioInput = styled.input`
  position: relative;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;

  &:checked + label {
    background-color: #545454;
    color: #FFFFFF;
  }
`;



// EditButton 스타일 수정
const EditButton = styled.button`
  padding: 15px; // 더 큰 패딩으로 조절
  border: none;
  border-radius: 4px;
  background-color: #545454;
  color: white;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s;
  width: 100%; // 가로폭을 100%로 조절

  &:hover {
    background-color: #545454;
  }
`;

// EditButtonContainer 스타일 수정
const EditButtonContainer = styled.div`
  margin-top: 20px; // 상단 여백 추가
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const StatusFilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StatusFilterLabel = styled.label`
  margin-right: 10px;
`;

const OpenLicenseButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  color: black;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s;

  }
`;


const StoreManagement = ({ limit, isHomeView, hideFilter, hideEdit }) => {
  const [originalStores, setOriginalStores] = useState([]);  // 원본 상점 목록
  const [stores, setStores] = useState([]);  // 현재 상점 목록
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 번호
  const [searchKeyword, setSearchKeyword] = useState('');  // 검색어
  const [itemsPerPage] = useState(isHomeView ? limit : 20);  // 페이지당 아이템 수
  const [totalPages, setTotalPages] = useState(0);  // 전체 페이지 수
  const [modalIsOpen, setModalIsOpen] = useState(false);  // 모달 오픈 여부
  const [selectedImage, setSelectedImage] = useState(null);  // 선택된 이미지 URL
  const [selectedStore, setSelectedStore] = useState({
    businessLicenseImgId: null,
  });

////////////////API 백엔드 데이터 연결 시작////////////////////

// 컴포넌트가 마운트될 때 한 번만 데이터를 가져옴
useEffect(() => {
  fetchStores();
}, []);

// API 데이터 들고오기
const userId = 1; // 현재 사용자의 ID

// 함수를 컴포넌트 외부로 이동
const fetchStores = async () => {
  // 이미 클라이언트 측에서 가지고 있는 데이터가 없는 경우에만 서버에 요청
  if (originalStores.length === 0) {
    try {
      const apiUrl = `https://usms.serveftp.com/api/users/1/stores`;
      const params = {
        offset: (currentPage - 2) + 1,
        size: itemsPerPage * 10,
      };

      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        withCredentials: true,
        params,
      });

      const responseData = response.data;
      console.log(responseData);

      if (Array.isArray(responseData)) {
        setOriginalStores(responseData);
        setStores(responseData);
        setTotalPages(Math.ceil(responseData.length / itemsPerPage));
      } else {
        console.error('잘못된 응답 형식', response);
      }
    } catch (error) {
      console.error('서버 요청 오류', error);
    }
  }
};

// 변경 사항 저장
const handleSaveChanges = async () => {
  if (!selectedStore) {
    console.error('selectedStore가 정의되지 않았습니다.');
    return;
  }

  console.log('selectedStore:', selectedStore);
  let userId = selectedStore.userId;
  let storeId = selectedStore.id;

  if (storeId === undefined) {
    console.error('selectedStore.id가 정의되지 않았습니다.');
    return;
  }
  try {
    // API 호출을 통한 매장 상태 변경
    const apiUrl = `https://usms.serveftp.com/api/users/${userId}/stores/${storeId}`;
    const response = await axios.patch(
      apiUrl,
      {
        state: selectedStore.storeState,
        message: " ",
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        withCredentials: true,
      }
    );

    // API 응답 상태가 204 (NO CONTENT)인 경우, 변경 사항 저장 성공
    if (response.status === 204) {
      console.log('매장 상태 변경 성공');
      setStores((prevStores) => {
        const updatedStores = [...prevStores];
        const storeIndex = updatedStores.findIndex(store => store.id === storeId);
        if (storeIndex !== -1) {
          updatedStores[storeIndex].storeState = selectedStore.storeState;
        }
        return updatedStores;
      });
    } else {
      console.error('매장 상태 변경 실패', response);
    }
  } catch (error) {
    console.error('API 호출 오류', error);
  } finally {
    // 변경 사항 저장 후 모달을 닫음
    closeModal();
  }
};

const fetchBusinessLicenseImage = async (userId, storeId, licenseKey) => {
  try {
    const fileUrl = `https://usms.serveftp.com/api/users/${userId}/stores/${storeId}/license/${licenseKey}`;
    const response = await axios.get(fileUrl, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      withCredentials: true,
      responseType: 'arraybuffer',
    });

    if (response.status === 200 && response.data) {
      const extensionMatch = fileUrl.match(/\.([a-zA-Z]+)$/);
      const extension = extensionMatch ? extensionMatch[1] : '';
      const contentType = extension === 'pdf' ? 'application/pdf' : `image/${extension}`;

      if (contentType.includes('image') || ['png', 'jpg', 'jpeg', 'gif'].includes(extension)) {
        // 이미지 파일인 경우 이미지 뷰어로 열기
        const url = URL.createObjectURL(new Blob([response.data], { type: contentType }));
        window.open(url, '_blank');
      } else if (contentType === 'application/pdf' || extension === 'pdf') {
        // PDF 파일인 경우 현재 창에 콘텐츠 표시
        const url = URL.createObjectURL(new Blob([response.data], { type: contentType }));

        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '600px';
        document.body.appendChild(iframe);
      } else {
        console.error('지원하지 않는 파일 형식입니다.');
      }
    } else {
      console.error('파일 가져오기 실패');
    }
  } catch (error) {
    console.error('파일 가져오기 오류', error);
  }
};
  
  
////////////////API 백엔드 데이터 연결 끝////////////////////  

// 검색 버튼 클릭 또는 Enter 키 입력 시 필터링
const handleSearch = () => {
  const sanitizedKeyword = searchKeyword.replace(/-/g, ''); // 하이픈 제거
  const filteredStores = originalStores.filter((store) => {
    const sanitizedBusinessLicenseCode = store.businessLicenseCode.replace(/-/g, ''); // 상점의 사업자 등록 번호에서 하이픈 제거
    return (
      sanitizedBusinessLicenseCode.includes(sanitizedKeyword) ||
      (/\d{10}/.test(sanitizedKeyword) &&
        sanitizedBusinessLicenseCode.includes(sanitizedKeyword))
    );
  });
  setStores(filteredStores);
  setCurrentPage(1);
};

const handleSearchKeyDown = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};


  // 상태코드 파싱 코드
  const parseStoreState = (code) => {
    switch (code) {
      case 0:
        return '승인 대기';
      case 1:
        return '승인';
      case 2:
        return '부적합';
      case 3:
        return '정지';
      default:
        return '알 수 없음';
    }
  };


// 페이지 변경 시
const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
};

// useEffect를 사용하여 페이지 변경 시 데이터를 갱신
useEffect(() => {
  if (userId && itemsPerPage && currentPage) {
    fetchStores(currentPage);
  }
}, [userId, itemsPerPage, currentPage]);

// 페이지 변경을 감지하고 페이지 변경 함수 호출
useEffect(() => {
  handlePageChange(currentPage);
}, [currentPage]);



    // 모달 닫기
    const closeModal = () => {
      setModalIsOpen(false);
      document.body.classList.remove('modal-open');
      const overlay = document.querySelector('.overlay');
      if (overlay) {
        overlay.remove();
      }
    };

    // 상세 모달 열기
    const openDetailModal = (store) => {
      setSelectedStore(store);
      console.log('선택된 매장 정보:', store); // 추가된 부분
      setModalIsOpen(true);
      document.body.classList.add('modal-open');
      document.body.insertAdjacentHTML('beforeend', '<div class="overlay"></div>');
    };

  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStores = stores.slice(startIndex, endIndex);

  // 이미지 팝업 컴포넌트
  const ImagePopup = ({ attachment }) => {
    const openPopup = () => {
      window.open(attachment.url, '_blank', 'width=800,height=600');
    };

    return (
      <div>
        <h3>첨부파일</h3>
        <EditableField
          className="attachment-link"
          value={attachment.name}
          onClick={openPopup}
          readOnly  // 추가된 부분: 읽기 전용으로 설정
        />
      </div>
    );
  };

  return (
    <div>
      {!isHomeView && !hideFilter && (
        <SearchBarContainer className={searchKeyword ? 'search-bar-container-expanded' : ''}>
          <SearchBarInput
            type="text"
            placeholder="검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <SearchBarButton onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </SearchBarButton>
        </SearchBarContainer>
      )}


      <DataTable>
        <DataTableHeader>매장 관리</DataTableHeader>
        <DataTableTable>
          <thead>
            <tr>
              <DataTableTh>번호</DataTableTh>
              <DataTableTh>업주명</DataTableTh>
              <DataTableTh>매장명</DataTableTh>
              <DataTableTh>주소</DataTableTh>
              <DataTableTh>사업자등록번호</DataTableTh>
              <DataTableTh>상태</DataTableTh>
            </tr>
          </thead>
          <tbody>
          {currentStores.map((store, index) => (
          <tr key={store.id} onClick={() => openDetailModal(store)}>
          <DataTableTd>{index + 1}</DataTableTd>
          <DataTableTd>{store.userId}</DataTableTd>
          <DataTableTd>{store.name}</DataTableTd>
          <DataTableTd>{store.address}</DataTableTd>
          <DataTableTd>{store.businessLicenseCode}</DataTableTd>
          <DataTableTd>{parseStoreState(store.storeState)}</DataTableTd>
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

      {selectedStore && (
  <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    style={modalStyles}
    contentLabel="Example Modal"
    portalClassName="modal-portal"
  >
          <CloseButton onClick={closeModal}>&times;</CloseButton>
          <div>
            <h2>매장 상세 정보</h2>
            <div>
              <h3>업주명</h3>
              <EditableField
                type="text"
                value={selectedStore.userId}
                onChange={(e) => setSelectedStore({ ...selectedStore, userId: e.target.value })}
                disabled
                className="userId"
              />
            </div>
            <div>
              <h3>매장명</h3>
              <EditableField
                type="text"
                value={selectedStore.name}
                onChange={(e) => setSelectedStore({ ...selectedStore, name: e.target.value })}
                disabled
                className="storeName"
              />
            </div>
            <div>
            <h3>주소</h3>
            <EditableField
              type="text"
              value={selectedStore.address}
              onChange={(e) => setSelectedStore({ ...selectedStore, address: e.target.value })}
              disabled
              className="address"
            />
          </div>
            <div>
              <h3>사업자등록번호</h3>
              <EditableField
                type="text"
                value={selectedStore.businessLicenseCode}
                onChange={(e) => setSelectedStore({ ...selectedStore, businessLicenseCode: e.target.value })}
                disabled
                className="businessLicenseCode"
              />
            </div>

            {
  selectedStore.businessLicenseCode ? (
    <div className="attachment-section">
      <h3>첨부 파일</h3>
      {selectedStore.businessLicenseImgUrl ? (
        <iframe
          src={selectedStore.businessLicenseImgUrl}
          width="100%"
          height="600px"
          title="사업자등록증 이미지"
        />
      ) : (
        <OpenLicenseButton onClick={() => fetchBusinessLicenseImage(selectedStore.userId, selectedStore.id, selectedStore.businessLicenseImgId)}>
          사업자등록증 열기
        </OpenLicenseButton>
      )}
    </div>
  ) : (
    <p>첨부 파일이 없습니다.</p>
  )
}


<EditButtonContainer>
  <StatusFilterContainer>
    <StatusFilterLabel></StatusFilterLabel>
<RadioContainer>
  <RadioInput
    id="approval_wait"
    type="radio"
    name="storeStatus"
    value="승인 대기"
    checked={selectedStore.storeState === 0}
    onChange={() => {
      console.log('승인 대기 선택됨');
      setSelectedStore({ ...selectedStore, storeState: 0 });
    }}
  />
  <RadioLabel htmlFor="approval_wait" checked={selectedStore.storeState === 0}>
    승인 대기
  </RadioLabel>
</RadioContainer>

<RadioContainer>
  <RadioInput
    id="approval"
    type="radio"
    value="승인"
    checked={selectedStore.storeState === 1}
    onChange={() => {
      console.log('승인 선택됨');
      setSelectedStore({ ...selectedStore, storeState: 1 });
    }}
  />
  <RadioLabel htmlFor="approval" checked={selectedStore.storeState === 1}>
    승인
  </RadioLabel>
</RadioContainer>

<RadioContainer>
  <RadioInput
    id="inappropriate"
    type="radio"
    value="부적합"
    checked={selectedStore.storeState === 2}
    onChange={() => {
      console.log('부적합 선택됨');
      setSelectedStore({ ...selectedStore, storeState: 2 });
    }}
  />
  <RadioLabel htmlFor="inappropriate" checked={selectedStore.storeState === 2}>
    부적합
  </RadioLabel>
</RadioContainer>

<RadioContainer>
  <RadioInput
    id="stop"
    type="radio"
    value="정지"
    checked={selectedStore.storeState === 3}
    onChange={() => {
      console.log('정지 선택됨');
      setSelectedStore({ ...selectedStore, storeState: 3 });
    }}
  />
  <RadioLabel htmlFor="stop" checked={selectedStore.storeState === 3}>
    정지
  </RadioLabel>
</RadioContainer>
</StatusFilterContainer>
             <EditButton onClick={handleSaveChanges}>변경 사항 저장</EditButton>
            </EditButtonContainer>
          </div>
        </Modal>
      )}

{selectedImage && <ImagePopup imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};

export default StoreManagement;