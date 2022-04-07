
  import { UserModel } from '../models/index.js';
  import httpStatus from 'http-status';
  
  import APIError from '../utils/APIError.js';
  import bcrypt from 'bcryptjs';
  
  const fetchUserFromEmailAndPassword = async ({ email, password }) => {
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    })
      .lean();
  
    if (!user || user.membershipHalted)
      throw new APIError(httpStatus.BAD_REQUEST, 'invalid credentials');
  
    let passwordMatches = await bcrypt.compare(password, user.password);
  
    if (!passwordMatches)
      throw new APIError(httpStatus.BAD_REQUEST, 'invalid credentials');
  
    return user;
  };
  
  const verifyUserFromRefreshTokenPayload = async ({ userId }) => {
    const userExists = await UserModel.exists({
      _id: userId,
    });
  
    if (!userExists)
      throw new APIError(httpStatus.FORBIDDEN, 'Invalid Refresh Token - logout');
  };
  
  const fetchUserFromAuthData = async ({ userId }) => {
    const user = await UserModel.findOne({
      _id: userId,
    })
      // .select('name image') //search what is select
      .lean();
  
    if (!user)
      throw new APIError(httpStatus.UNAUTHORIZED, 'invalid access token user');
  
    return user;
  };
  
  const verifyCurrentPassword = async (userId, password) => {
    const user = await UserModel.findOne({
      _id: userId,
    })
      .select('password')
      .lean();
  
    let passwordMatches = await bcrypt.compare(password, user.password);
  
    if (!passwordMatches)
      throw new APIError(httpStatus.BAD_REQUEST, 'invalid current password');
  };
  
  const updatePassword = async (userId, newPassword) => {
    let newHash = await bcrypt.hash(newPassword, 10);
  
    let user = await UserModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        password: newHash,
      },
      {
        new: true,
        select: 'name email',
      }
    );

  };

  

  export {
    fetchUserFromEmailAndPassword,
    verifyUserFromRefreshTokenPayload,
    fetchUserFromAuthData,
    verifyCurrentPassword,
    updatePassword,
  };
  