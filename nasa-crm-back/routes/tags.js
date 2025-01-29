import express from 'express';

import { getTags, createTag, getTag, deleteTag, updateTag, updateTrainTag, updateProjectTag } from '../controllers/tagsController.js';

const router = express.Router();

router.get('/', getTags);
router.post('/', createTag);
router.get('/:id', getTag);
router.delete('/:id', deleteTag);
router.post('/:id', updateTag);
router.post('/train/:id', updateTrainTag);
router.post('/project/:id', updateProjectTag);

export default router;