import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import {useGoogleLogin} from '@react-oauth/google';
import {useLoginMutation, useAuthGoogleMutation} from '../slices/usersApiSlice';
import {setCredentials} from '../slices/authSlice';
import {toast} from 'react-toastify';
import {FcGoogle} from 'react-icons/fc';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, {isLoading}] = useLoginMutation();

  const [authGoogle, {isLoading: isLoadingGoogle}] = useAuthGoogleMutation();

  const loading = isLoading || isLoadingGoogle;

  const {userInfo} = useSelector((state) => state.auth);

  const {search} = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await login({email, password}).unwrap();
      dispatch(setCredentials({...res}));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async ({code}) => {
      try {
        const res = await authGoogle({code}).unwrap();
        dispatch(setCredentials({...res}));
        navigate(redirect);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    },
    flow: 'auth-code',
  });

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder='Enter email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder='Enter password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>

        <Row className='mt-2'>
          <Col md={3}>
            <Button type='submit' variant='primary' disabled={loading}>
              Sign In
            </Button>
          </Col>
          <Col md={9}>
            <Button variant='light' onClick={() => googleLogin()}>
              <FcGoogle />{' '}
              Continue with Google
            </Button>
          </Col>
        </Row>
        
        {loading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
            New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;