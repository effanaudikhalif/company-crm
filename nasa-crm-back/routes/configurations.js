import express from 'express';

import { getConfigurations, createConfiguration, getConfiguration, deleteConfiguration, updateConfiguration } from '../controllers/configurationsController.js';

const router = express.Router();

router.get('/', getConfigurations);
router.post('/', createConfiguration);
router.get('/:id', getConfiguration);
router.delete('/:id', deleteConfiguration);
router.put('/:id', updateConfiguration);

export default router;