import express from 'express';

import { getConsultants, createConsultant, getConsultant, deleteConsultant, updateConsultant, updateProjectConsultant } from '../controllers/consultantsController.js';

const router = express.Router();

router.get('/', getConsultants);
router.post('/', createConsultant);
router.get('/:id', getConsultant);
router.delete('/:id', deleteConsultant);
router.post('/:id', updateConsultant);
router.post('/project/:id', updateProjectConsultant);

export default router;