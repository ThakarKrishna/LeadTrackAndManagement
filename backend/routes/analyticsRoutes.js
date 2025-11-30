import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { leadsPerDay, leadsPerForm } from '../controllers/analyticsController.js';

const router = Router();

router.use(auth);
router.get('/leads-per-day', leadsPerDay);
router.get('/leads-per-form', leadsPerForm);

export default router;



