import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import LiqPay from 'liqpay-sdk-nodejs';
dotenv.config();
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import Order from './models/orderModel.js';
import asyncHandler from './middleware/asyncHandler.js';

const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookie parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}));
app.get('/api/config/liqpay/:orderId', asyncHandler(async (req, res) => {
  const {orderId} = req.params;
  if (!orderId) {
    res.status(400);
    throw Error('Order ID is not provided');
  } else {
    const order = await Order.findById(orderId);
    console.log('order', order);
    const description = order.orderItems.map(({name, qty}) => `${name}(x${qty})`).join(', ');

    if (!order) {
      res.status(404);
      throw Error('Order not found');
    } else {
      const jsonString = {
        public_key: process.env.LIQPAY_PUBLIC_KEY,
        version : 3,
        action: 'pay',
        amount: order.totalPrice,
        currency: 'UAH',
        description: description,
        order_id: orderId,
        result_url: `http://localhost:3000/order/${orderId}`
      };
  
      const liqpay = new LiqPay(process.env.LIQPAY_PUBLIC_KEY, process.env.LIQPAY_SECRET);
      const objectData = liqpay.cnb_object(jsonString);
  
      res.status(200).send({...objectData});
    }
  }
}));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));