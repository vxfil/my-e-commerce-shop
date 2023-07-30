import React from 'react';
import {Container} from 'react-bootstrap';
import {Outlet} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {GoogleOAuthProvider} from '@react-oauth/google';
import Header from './components/Header';
import Footer from './components/Footer';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  
  const clientId='289330535160-7b45sqiicl5nsqpca1tpnps3for3c30c.apps.googleusercontent.com';

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
