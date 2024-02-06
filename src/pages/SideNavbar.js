import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faUser, faCreditCard, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useHistory } from 'react-router-dom';

const SideNavbar = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const handleMenuClick = () => {
    setSidebarExpanded((prevState) => !prevState);
  };

  const handleLinkClick = (e) => {
    const linkColor = document.querySelectorAll('.nav__link');
    linkColor.forEach((l) => l.classList.remove('active'));
    e.target.classList.add('active');
  };

  useEffect(() => {
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach((link) => {
      link.addEventListener('click', function () {
        navLinks.forEach((l) => l.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }, []);

  useEffect(() => {
    if (isSidebarExpanded) {
      document.body.classList.add('body-expanded');
    } else {
      document.body.classList.remove('body-expanded');
    }
  }, [isSidebarExpanded]);

  // 로그인 및 Intro 페이지에서는 사이드바를 숨김
  if (location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    // 로그아웃 로직을 추가
    // 예를 들어, 로그아웃 API 호출 또는 로컬 스토리지에서 사용자 정보 제거 등

    // 사용자 로그아웃 후 페이지 이동
    // 여기서는 로그인 페이지로 이동하도록 설정
    history.push('/login');
  };

  return (
    <div className={`l-navbar ${isSidebarExpanded ? 'expander' : ''}`}>
      <nav className="nav">
        <div className="nav__brand">
          <button className="nav__toggle" onClick={handleMenuClick}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <Link
            to="/home"
            className="nav__logo"
            onClick={() => {
              // 페이지가 현재와 같은 경우에도 페이지를 다시 로드
              if (window.location.pathname === '/home') {
                window.location.reload();
              }
            }}
          >
            USMS
          </Link>
        </div>
        <Link
          to="/store-management"
          className={`nav__link ${
            window.location.pathname === '/store-management' ? 'active' : ''
          }`}
          onClick={handleLinkClick}
        >
          <div className="nav__icon-container">
            <FontAwesomeIcon icon={faHome} className="nav__icon" />
          </div>
          <span className="nav_name">매장관리</span>
        </Link>
        <Link
          to="/member-info"
          className={`nav__link ${
            window.location.pathname === '/member-info' ? 'active' : ''
          }`}
          onClick={handleLinkClick}
        >
          <div className="nav__icon-container">
            <FontAwesomeIcon icon={faUser} className="nav__icon" />
          </div>
          <span className="nav_name">회원정보</span>
        </Link>
        <Link
          to="/payment-history"
          className={`nav__link ${
            window.location.pathname === '/payment-history' ? 'active' : ''
          }`}
          onClick={handleLinkClick}
        >
          <div className="nav__icon-container">
            <FontAwesomeIcon icon={faCreditCard} className="nav__icon" />
          </div>
          <span className="nav_name">사용자 결제내역</span>
        </Link>
        <Link
          to="/login"
          className={`nav__link ${window.location.pathname === '/login' ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <div className="nav__icon-container">
            <FontAwesomeIcon icon={faSignOutAlt} className="nav__icon" />
          </div>
          <span className="nav_name" onClick={handleLogout}>
            로그아웃
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default SideNavbar;