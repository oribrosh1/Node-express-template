import express from 'express';
import * as CartSessionController from '../controllers/cartSessionController.js';
const router = express.Router();

router.get('/', CartSessionController.getSession);
router.post('/', CartSessionController.saveSession);

export default router;