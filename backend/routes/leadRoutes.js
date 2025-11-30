import { Router } from 'express';
import { captureLead, listLeads } from '../controllers/leadController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Public capture endpoint
router.post('/:formId', captureLead);

// Protected listing endpoint
router.get('/', auth, listLeads);

export default router;



