const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const authService = require('./auth.service')
const { userService } = require('../user')
const emailService = require('../email/email.service');
const tokenService = require('../token/token.service')
const ApiSuccess = require('../../utils/ApiSuccess');
const { responseMessage } = require('../../utils/common');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  return new ApiSuccess(res, httpStatus.CREATED, "User registered successfully", user, tokens)
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  return new ApiSuccess(res, httpStatus.OK, "Logged in successfully", user, tokens)
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  return new ApiSuccess(res, httpStatus.NO_CONTENT, "Logged out successfully")
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  return new ApiSuccess(res, httpStatus.OK, "Refreshed", {}, tokens)
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  return new ApiSuccess(res, httpStatus.OK, responseMessage.FORGOT_MESSAGE)

});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  return new ApiSuccess(res, httpStatus.OK, responseMessage.PASSWORD_RESET);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
