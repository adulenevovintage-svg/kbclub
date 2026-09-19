import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Check } from 'lucide-react';

interface PhotoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string;
  title: string;
  onSaveImage: (newUrl: string) => void;
  onAddToast: (type: 'success' | 'warning' | 'info', title: string, message: string) => void;
}

export const PhotoEditModal: React.FC<PhotoEditModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  title,
  onSaveImage,
  onAddToast,
}) => {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setImageUrl(currentImageUrl);
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onAddToast('warning', 'Invalid File', 'Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPreviewUrl(dataUrl);
        setImageUrl(dataUrl);
        onAddToast('info', 'Image Loaded', 'Local file ready to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl.trim()) return;
    onSaveImage(previewUrl);
    onAddToast('success', 'Photo Updated', 'Club cover photo has been updated.');
    onClose();
  };

  const sampleImages = [
    { label: 'Robotics Lab', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Debate Chamber', url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80' },
    { label: 'Art Studio', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Aerospace Bay', url: 'https://images.unsplash.com/photo-1517976487502-53b92dc1791a?w=800&auto=format&fit=crop&q=80' },
    { label: 'Model UN Hall', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80' },
    { label: 'Computer Lab', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Change Photo</h3>
              <p className="text-[11px] text-zinc-400 truncate max-w-xs">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Image Preview */}
          <div className="relative h-44 w-full rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shadow-inner flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={() => {
                  onAddToast('warning', 'Image Load Failed', 'Could not load the provided URL.');
                }}
              />
            ) : (
              <div className="text-zinc-400 text-xs flex flex-col items-center gap-1">
                <ImageIcon className="w-8 h-8" />
                <span>No image selected</span>
              </div>
            )}
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Image Web URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-mono text-zinc-800 focus:outline-none focus:border-amber-500 pr-9"
                />
                <LinkIcon className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Local Upload */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Or Upload from Computer
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-zinc-300 hover:border-amber-400 hover:bg-amber-50/50 text-xs font-semibold text-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                <span>Choose Local Image File</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                School Image Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(s.url);
                      setPreviewUrl(s.url);
                    }}
                    className="p-1.5 rounded-lg border border-zinc-200 hover:border-amber-400 text-[10px] text-zinc-700 font-medium text-left truncate transition-colors hover:bg-zinc-50 cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Photo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
