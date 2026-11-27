import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SiteContent } from '../models/SiteContent.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { CMS_DEFAULTS } from '../data/cmsDefaults.js';
import { checkDBConnection } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

const logCmsAction = async (req, action, details) => {
  try {
    if (req.admin && checkDBConnection()) {
      await ActivityLog.create({
        adminId: req.admin._id,
        adminName: req.admin.name || req.admin.email,
        action,
        details,
      });
    }
  } catch (err) {
    console.warn('CMS ActivityLog skipped:', err.message);
  }
};

/**
 * Ensure all default CMS sections exist in MongoDB
 */
const ensureSeeded = async () => {
  const keys = Object.keys(CMS_DEFAULTS);
  const existing = await SiteContent.find({ section: { $in: keys } }).select('section').lean();
  const existingSet = new Set(existing.map((e) => e.section));

  const toInsert = keys
    .filter((k) => !existingSet.has(k))
    .map((k) => ({
      section: k,
      draftData: CMS_DEFAULTS[k],
      publishedData: CMS_DEFAULTS[k],
      status: 'published',
      hasUnpublishedChanges: false,
      lastPublishedAt: new Date(),
      updatedBy: 'system',
    }));

  if (toInsert.length > 0) {
    await SiteContent.insertMany(toInsert);
  }
};

/**
 * GET /api/cms/public
 * Public endpoint: returns published content for all sections.
 * If ?preview=1 and valid admin token (optional), returns draftData.
 */
export const getPublicCms = async (req, res, next) => {
  try {
    const isPreview = req.query.preview === '1';

    if (!checkDBConnection()) {
      return res.status(200).json({
        success: true,
        source: 'static',
        data: CMS_DEFAULTS,
      });
    }

    await ensureSeeded();
    const docs = await SiteContent.find().lean();

    const payload = {};
    for (const doc of docs) {
      if (isPreview) {
        payload[doc.section] = doc.draftData ?? doc.publishedData;
      } else if (doc.status === 'published') {
        payload[doc.section] = doc.publishedData;
      } else {
        payload[doc.section] = null; // explicitly unpublished
      }
    }

    res.status(200).json({
      success: true,
      source: 'database',
      preview: isPreview,
      data: payload,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/cms/admin
 * Admin endpoint: returns all sections with both draftData and publishedData
 */
export const getAdminCms = async (req, res, next) => {
  try {
    if (!checkDBConnection()) {
      const fallback = Object.keys(CMS_DEFAULTS).map((section) => ({
        section,
        draftData: CMS_DEFAULTS[section],
        publishedData: CMS_DEFAULTS[section],
        status: 'published',
        hasUnpublishedChanges: false,
        lastPublishedAt: new Date(),
        updatedBy: 'static',
      }));
      return res.status(200).json({ success: true, source: 'static', data: fallback });
    }

    await ensureSeeded();
    const docs = await SiteContent.find().sort({ section: 1 }).lean();

    res.status(200).json({
      success: true,
      source: 'database',
      data: docs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/cms/admin/:section/draft
 * Save working draft without publishing live
 */
export const saveSectionDraft = async (req, res, next) => {
  try {
    const section = req.params.section.toLowerCase();
    const { data } = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, message: 'Section data object is required.' });
    }

    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database unavailable.' });
    }

    const updated = await SiteContent.findOneAndUpdate(
      { section },
      {
        $set: {
          draftData: data,
          hasUnpublishedChanges: true,
          updatedBy: req.admin?.name || req.admin?.email || 'admin',
        },
        $setOnInsert: {
          publishedData: CMS_DEFAULTS[section] || {},
          status: 'draft',
        },
      },
      { new: true, upsert: true }
    );

    await logCmsAction(req, 'CMS_DRAFT_SAVED', `Saved draft for section "${section}"`);

    res.status(200).json({
      success: true,
      message: `Draft saved for "${section}".`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cms/admin/:section/publish
 * Publish draftData (or supplied data) live to public website
 */
export const publishSection = async (req, res, next) => {
  try {
    const section = req.params.section.toLowerCase();
    const { data } = req.body || {};

    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database unavailable.' });
    }

    let doc = await SiteContent.findOne({ section });
    if (!doc) {
      doc = new SiteContent({
        section,
        draftData: data || CMS_DEFAULTS[section] || {},
        publishedData: data || CMS_DEFAULTS[section] || {},
      });
    } else if (data && typeof data === 'object') {
      doc.draftData = data;
      doc.publishedData = data;
    } else {
      doc.publishedData = doc.draftData;
    }

    doc.status = 'published';
    doc.hasUnpublishedChanges = false;
    doc.lastPublishedAt = new Date();
    doc.updatedBy = req.admin?.name || req.admin?.email || 'admin';
    await doc.save();

    await logCmsAction(req, 'CMS_PUBLISHED', `Published section "${section}" live`);

    res.status(200).json({
      success: true,
      message: `Section "${section}" published live.`,
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cms/admin/:section/unpublish
 * Unpublish section from public website (reverts to draft status)
 */
export const unpublishSection = async (req, res, next) => {
  try {
    const section = req.params.section.toLowerCase();
    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database unavailable.' });
    }

    const updated = await SiteContent.findOneAndUpdate(
      { section },
      {
        $set: {
          status: 'draft',
          updatedBy: req.admin?.name || req.admin?.email || 'admin',
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: `Section "${section}" not found.` });
    }

    await logCmsAction(req, 'CMS_UNPUBLISHED', `Unpublished section "${section}"`);

    res.status(200).json({
      success: true,
      message: `Section "${section}" unpublished.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cms/admin/:section/reset
 * Discard unpublished draft changes and revert draftData to publishedData
 */
export const resetSectionDraft = async (req, res, next) => {
  try {
    const section = req.params.section.toLowerCase();
    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database unavailable.' });
    }

    const doc = await SiteContent.findOne({ section });
    if (!doc) {
      return res.status(404).json({ success: false, message: `Section "${section}" not found.` });
    }

    doc.draftData = doc.publishedData;
    doc.hasUnpublishedChanges = false;
    await doc.save();

    res.status(200).json({
      success: true,
      message: `Draft reverted to published version for "${section}".`,
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cms/upload
 * Upload image (base64 dataUrl -> saved to /uploads or returned safely for serverless)
 */
export const uploadCmsImage = async (req, res, next) => {
  try {
    const { filename = 'image.png', dataUrl } = req.body || {};

    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ success: false, message: 'Image dataUrl is required.' });
    }

    const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,(.+)$/i);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Allowed: PNG, JPG, WEBP, GIF, SVG.',
      });
    }

    const ext = match[1].toLowerCase().replace('svg+xml', 'svg').replace('jpeg', 'jpg');
    const base64Body = match[2];
    const buffer = Buffer.from(base64Body, 'base64');

    if (buffer.length > 3 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image exceeds 3MB size limit.',
      });
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.[^.]+$/, '');
    const finalName = `${Date.now()}-${safeName || 'cms-asset'}.${ext}`;

    // Try writing to local server/uploads directory; fallback to dataUrl on read-only serverless (Vercel)
    if (!process.env.VERCEL) {
      try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        await fs.writeFile(path.join(UPLOADS_DIR, finalName), buffer);
        await logCmsAction(req, 'CMS_IMAGE_UPLOADED', `Uploaded image ${finalName}`);
        return res.status(201).json({
          success: true,
          url: `/uploads/${finalName}`,
          filename: finalName,
        });
      } catch (fsErr) {
        console.warn('Local upload write failed, falling back to inline data URL:', fsErr.message);
      }
    }

    await logCmsAction(req, 'CMS_IMAGE_UPLOADED', `Uploaded inline image ${finalName}`);
    res.status(201).json({
      success: true,
      url: dataUrl,
      filename: finalName,
    });
  } catch (error) {
    next(error);
  }
};
