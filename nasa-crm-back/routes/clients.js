import express from 'express';

import { getClients, createClient, getClient, deleteClient, updateClient, getClientsByName } from '../controllers/clientsController.js';

const router = express.Router();

router.get('/', getClients);
router.get('/:name', getClientsByName);
router.post('/', createClient);
router.get('/:id', getClient);
router.delete('/:id', deleteClient);
router.post('/:id', updateClient);

export default router;