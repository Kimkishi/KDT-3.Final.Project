// App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom'; // HashRouter로 변경
import Modal from 'react-modal';
import './App.css';
import './pages/SideNavbar.css';

import SideNavbar from './pages/SideNavbar';
import StoreManagement from './pages/StoreManagement';
import MemberInfo from './pages/MemberInfo';
import PaymentHistory from './pages/PaymentHistory';
import Home from './pages/Home';
import Login from './pages/Login';
import Intro from './pages/Intro';


Modal.setAppElement('#root'); // 모달에서 사용할 appElement 설정

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);



  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus) {
      setLoggedIn(JSON.parse(storedLoginStatus));
    }
  }, []);

  const updateLoginStatus = (status) => {
    setLoggedIn(status);
    localStorage.setItem('isLoggedIn', JSON.stringify(status));
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Router>
      {/* HashRouter로 변경 */}
      <div className="App">
        <SideNavbar />
        <main>
          <Switch>
            <Route exact path="/" render={() => <Intro />} />
            <Route path="/home" render={() => <Home isLoggedIn={isLoggedIn} />} />
            <Route
              path="/store-management"
              render={() => (
                <StoreManagement
                  openModal={openModal}
                  closeModal={closeModal}
                  modalIsOpen={modalIsOpen}
                  selectedImage={selectedImage}
                  isLoggedIn={isLoggedIn}
                />
              )}
            />
            <Route path="/member-info" component={MemberInfo} />
            <Route path="/payment-history" component={PaymentHistory} />
            <Route
              path="/login"
              render={() => (
                <Login
                  updateLoginStatus={updateLoginStatus}
                />
              )}
            />
          </Switch>
        </main>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
        >
          {selectedImage && <img src={selectedImage} alt="Selected" style={{ width: '100%' }} />}
        </Modal>
        
      </div>
    </Router>
  );
}

export default App;
