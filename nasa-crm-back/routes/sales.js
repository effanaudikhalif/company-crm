import express from 'express';

import { getSales, createSale, getSale, deleteSale, updateSale } from '../controllers/salesController.js';

const router = express.Router();

router.get('/', getSales);
router.post('/', createSale);
router.get('/:id', getSale);
router.delete('/:id', deleteSale);
router.post('/:id', updateSale);

export default router;