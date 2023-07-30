import jwt from 'jsonwebtoken';
import {OAuth2Client} from 'google-auth-library';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});

  if (user && (await user.matchPassword(password)) && user.provider !== 'google') {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      provider: user.provider,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc Register user
// @route GET /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  const userExist = await User.findOne({email});

  if (userExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      provider: user.provider,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error ('Invalid user data');
  }
});

// @desc Logout user / clear cookie
// @route GET /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {httpOnly: true, expires: new Date(0)});

  res.status(200).json({message: 'Logged out successfully'});
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// @desc Get users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.send('get users');
});

// @desc Get user by ID
// @route GET /api/users/:id
// @access Public
const getUserById = asyncHandler(async (req, res) => {
  res.send('get user by id');
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send('delete user');
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.send('update user');
});

const googleAuth = asyncHandler(async (req, res) => {
  const {code} = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Invalid authorization code!');
  }

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    'postmessage',
  );

  const { tokens } = await oAuth2Client.getToken(code); // Exchange code for tokens
  const { id_token } = tokens;
  const { email_verified, email, name } = jwt.decode(id_token);

  if (!email_verified) {
    res.status(403);
    throw new Error('Google account not verified');
  }

  const existingUser = await User.findOneAndUpdate(
    { email },
    { name },
    { new: true, upsert: true }
  );

  generateToken(res, existingUser._id);

  res.status(200).json({
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    verified: existingUser.verified,
    provider: existingUser.provider,
    isAdmin: existingUser.isAdmin,
  });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  googleAuth,
};
