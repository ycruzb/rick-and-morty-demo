import asyncHandler from 'express-async-handler';

export default asyncHandler(async (_req, res) => {
  res.status(200).json({message: 'healthy'});
});