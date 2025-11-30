import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { autoDetectForms, extractPreview, createForm, listForms, deleteForm } from '../controllers/formController.js';

const router = Router();

router.use(auth);
router.get('/', listForms);
router.post('/extract', extractPreview); // preview; no save
router.post('/', createForm); // manual save
router.post('/auto-detect/:websiteId', autoDetectForms); // auto detect & save
router.delete('/:id', deleteForm);

export default router;



