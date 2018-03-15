import { authRoutes } from './authRoutes';
import { adminRoutes } from './adminRoutes';
// import { billingRoutes } from './billingRoutes';
// import { productRoutes } from './productRoutes';
// import { cartRoutes } from './cartRoutes';
const express = require('express');
const router = express.Router();

router.use('/user', authRoutes);

export { router };
// , billingRoutes, productRoutes, cartRoutes};
