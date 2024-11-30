import React, { useContext } from 'react';
import { store } from './ContextAPI';

const Header = ({ onLoginClick }) => {
  const [loginData, setLoginData] = useContext(store);

  const handleButtonClick = () => {
    if (loginData) {
      // Clear loginData when logging out
      setLoginData(null);
    } else {
      // Trigger the onLoginClick function when logging in
      if (onLoginClick) {
        onLoginClick();
      }
    }
  };

  return (
    <header className="bg-primary text-white d-flex justify-content-between align-items-center">
      <h1 className="ms-5">NEWS PAPER HUB</h1>
      <div className="me-5 d-flex gap-2">
        {/* Feedback Button */}

        { loginData &&
            <a
            href="https://forms.gle/XurF2b3xbtyLy6AJ6"
            className="btn btn-secondary"
          >
            Feedback
          </a>
        }
        
        {/* Login/Logout Button */}
        <button
          className={`btn ${loginData ? 'btn-danger' : 'btn-primary'}`}
          onClick={handleButtonClick}
        >
          {loginData ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  );
};

export default Header;
