import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    verified: true,
    provider: 'app',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@email.com',
    verified: true,
    provider: 'app',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'Viktor Pavlik',
    email: 'viktor@email.com',
    verified: true,
    provider: 'app',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

export default users;