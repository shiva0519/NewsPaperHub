import React, { useState } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Content from './Components/Content';
import LoginModal from './Components/LoginModal';
import './App.css';
import { store } from './Components/ContextAPI';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login'); // 'login', 'signup', 'forgotPassword'

  const handleModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const [loginData, setLoginData]=useState('')

  return (

    

        <div className='wrapper background'>
          <store.Provider value={[loginData, setLoginData]}>
              <Header onLoginClick={() => handleModal('login')}/>
              <Content/>

              <Footer/>
            <LoginModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    modalType={modalType}
                    onChangeModal={handleModal}
                  />
              </store.Provider>



        </div>

  );
};

export default App;
