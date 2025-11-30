import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { createWebsite, listWebsites, updateWebsite, deleteWebsite } from '../controllers/websiteController.js';

const router = Router();

router.use(auth);
router.get('/', listWebsites);
router.post('/', createWebsite);
router.put('/:id', updateWebsite);
router.delete('/:id', deleteWebsite);

export default router;



