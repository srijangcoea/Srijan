import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadCmsImage, resolveAssetUrl } from '../../services/adminService';
import { notify } from '../../utils/toast';

export default function CmsImageUploader({ label = 'Image', value = '', onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify.error('Invalid File', 'Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      notify.error('File Too Large', 'Image must be smaller than 3 MB.');
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const res = await uploadCmsImage(file.name, dataUrl);
      if (res.success && res.url) {
        onChange(res.url);
        notify.success('Image Uploaded', 'Asset uploaded and ready to preview.');
      }
    } catch (err) {
      notify.error('Upload Failed', err.message || 'Could not upload image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-400">{label}</label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Preview Thumbnail */}
        <div className="w-16 h-16 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <img
              src={resolveAssetUrl(value)}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon size={20} className="text-slate-600" />
          )}
        </div>

        {/* URL Input + Upload Button */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste image URL or upload a file..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                title="Clear image"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/20 text-xs font-medium cursor-pointer transition-colors">
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
