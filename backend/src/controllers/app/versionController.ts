import asyncHandler from 'express-async-handler';

export default asyncHandler(async (_req, res) => {
  res.status(200).json({message: 'server v1.0.0'});
});