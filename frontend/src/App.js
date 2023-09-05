import React from 'react';
import {Container} from 'react-bootstrap';
import {Outlet} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {GoogleOAuthProvider} from '@react-oauth/google';
import Header from './components/Header';
import Footer from './components/Footer';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  
  const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <Header />
        <main className='py-3'>
          <Container>
            <Outlet />
          </Container>
        </main>
        <Footer />
        <ToastContainer />
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
