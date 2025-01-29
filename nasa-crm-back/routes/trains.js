import express from 'express';

import { getTrains, createTrain, getTrain, getProjectTrain, deleteTrain, updateTrain, configurePortfolio } from '../controllers/trainsController.js';

const router = express.Router();

router.get('/', getTrains);
router.post('/', createTrain);
router.get('/:id', getTrain);
router.get('/project/:id', getProjectTrain);
router.delete('/:id', deleteTrain);
router.post('/:id', updateTrain);
router.post('/configureportfolio/:id', configurePortfolio);

export default router;