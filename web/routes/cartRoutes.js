import express from 'express';
import * as CartSessionController from '../controllers/cartController.js';
const router = express.Router();

router.get('/', CartSessionController.getCart);
router.post('/', CartSessionController.saveCart);

export default router;