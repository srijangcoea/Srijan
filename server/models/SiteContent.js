import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    draftData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    publishedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    hasUnpublishedChanges: {
      type: Boolean,
      default: false,
    },
    lastPublishedAt: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: String,
      default: 'system',
    },
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model('SiteContent', siteContentSchema);
