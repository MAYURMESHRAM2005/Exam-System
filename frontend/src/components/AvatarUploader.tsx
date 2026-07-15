import { useRef, useState } from "react";
import { User, Upload, Loader2, X, AlertCircle } from "lucide-react";
import { uploadProfilePhoto, deleteProfilePhoto } from "../api/auth";

interface Props {
  avatarUrl: string | null;
  apiOrigin: string;
  onChanged: (avatarUrl: string | null) => void;
}

const MAX_SOURCE_FILE_BYTES = 8 * 1024 * 1024; // 8MB — generous, since we compress before upload anyway
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const OUTPUT_SIZE = 320; // px, square
const OUTPUT_QUALITY = 0.82;

/**
 * Resizes + center-crops an image file to a square JPEG using the Canvas
 * API, entirely client-side. This is an automatic center-crop rather than
 * an interactive crop-and-position UI — a full crop tool (drag to
 * reposition, pinch/scroll to zoom) is a meaningfully bigger feature in
 * its own right, so this covers "crop before upload" and "image
 * compression" without that larger scope.
 */
function compressAndCropToSquare(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file doesn't look like a valid image."));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;

        const canvas = document.createElement("canvas");
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Image processing is not supported in this browser."));
          return;
        }
        ctx.drawImage(img, sx, sy, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
        resolve(canvas.toDataURL("image/jpeg", OUTPUT_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function AvatarUploader({ avatarUrl, apiOrigin, onChanged }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = previewUrl || (avatarUrl ? `${apiOrigin}${avatarUrl}` : null);

  const handleFile = async (file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_SOURCE_FILE_BYTES) {
      setError(`Image is too large (max ${Math.round(MAX_SOURCE_FILE_BYTES / (1024 * 1024))}MB).`);
      return;
    }

    setIsProcessing(true);
    try {
      const compressed = await compressAndCropToSquare(file);
      setPreviewUrl(compressed); // instant preview while the upload is in flight
      const updated = await uploadProfilePhoto(compressed);
      onChanged(updated.avatarUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload photo.");
      setPreviewUrl(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      const updated = await deleteProfilePhoto();
      onChanged(updated.avatarUrl);
      setPreviewUrl(null);
    } catch (err: any) {
      setError(err.message || "Failed to remove photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-28 h-28 rounded-full cursor-pointer flex items-center justify-center overflow-hidden border-2 transition-colors ${
          isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-slate-100"
        }`}
        title="Click or drag & drop to upload a photo"
      >
        {displayUrl ? (
          <img src={displayUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="w-12 h-12 text-slate-400" />
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

        {!isProcessing && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
            <Upload className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = ""; // allow re-selecting the same file
        }}
      />

      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
        >
          {avatarUrl ? "Change photo" : "Upload photo"}
        </button>
        {avatarUrl && (
          <button
            onClick={handleRemove}
            disabled={isProcessing}
            className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 max-w-[220px] text-center">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
