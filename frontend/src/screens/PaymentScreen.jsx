import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Form, Button, Col} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import {savePaymentMethod} from '../slices/cartSlice';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('Privat24');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const {shippingAddress} = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              className='my-2'
              label='Privat24 or Credit Card'
              id='Privat24'
              name='paymentMethod'
              onChange={(event) => setPaymentMethod(event.target.id)}
              checked={paymentMethod === 'Privat24'}
            />
            <Form.Check
              type='radio'
              className='my-2'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              onChange={(event) => setPaymentMethod(event.target.id)}
              checked={paymentMethod === 'PayPal'}
            />
          </Col>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-3'>
            Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;