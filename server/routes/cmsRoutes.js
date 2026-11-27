import express from 'express';
import {
  getPublicCms,
  getAdminCms,
  saveSectionDraft,
  publishSection,
  unpublishSection,
  resetSectionDraft,
  uploadCmsImage,
} from '../controllers/cmsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public content endpoint
router.get('/public', getPublicCms);

// Protected Admin CMS endpoints
router.use(protect);
router.get('/admin', getAdminCms);
router.put('/admin/:section/draft', saveSectionDraft);
router.post('/admin/:section/publish', publishSection);
router.post('/admin/:section/unpublish', unpublishSection);
router.post('/admin/:section/reset', resetSectionDraft);
router.post('/upload', uploadCmsImage);

export default router;
