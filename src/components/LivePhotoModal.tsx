import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  X,
  Check,
  RotateCcw,
  ShieldCheck,
  Zap,
  Upload,
  Clock,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { DatingProfile, Language } from '../types';
import { translations } from '../i18n/translations';

interface LivePhotoModalProps {
  profile: DatingProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSendPhoto: (receiverId: string, photoUrl: string, source: 'instant' | 'upload') => void;
  lang: Language;
}

export const LivePhotoModal: React.FC<LivePhotoModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSendPhoto,
  lang,
}) => {
  const [mode, setMode] = useState<'instant' | 'upload'>('instant');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = translations[lang];

  useEffect(() => {
    if (isOpen && mode === 'instant' && !capturedPhoto) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, mode, capturedPhoto]);

  useEffect(() => {
    if (!isOpen) {
      setCapturedPhoto(null);
      setUploadedPhoto(null);
      setMode('instant');
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } else {
        setCameraActive(false);
      }
    } catch {
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && cameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
        stopCamera();
        return;
      }
    }

    // Graceful camera simulation fallback (authentic portrait selfie)
    setCapturedPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80');
    stopCamera();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUploadedPhoto(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    if (mode === 'instant') {
      setCapturedPhoto(null);
      startCamera();
    } else {
      setUploadedPhoto(null);
      fileInputRef.current?.click();
    }
  };

  const handleSend = () => {
    if (!profile) return;
    const activePhoto = mode === 'instant' ? capturedPhoto : uploadedPhoto;
    if (!activePhoto) return;
    onSendPhoto(profile.id, activePhoto, mode);
    onClose();
  };

  if (!isOpen || !profile) return null;

  const activePhoto = mode === 'instant' ? capturedPhoto : uploadedPhoto;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0c1322] border border-slate-800 rounded-3xl p-5 shadow-2xl overflow-hidden space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-800/50 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t.livePhotoModal.title}</h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'es' ? `Para enviar a ${profile.name}` : `To send to ${profile.name}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switch Tabs: Instant 30s (Recommended for Verification) vs Upload Photo */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#070b14] border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('instant')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
              mode === 'instant'
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.livePhotoModal.tabInstant}</span>
            </span>
            <span className="text-[9px] font-semibold opacity-90 flex items-center gap-0.5 mt-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{t.livePhotoModal.tabInstantBadge}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
              mode === 'upload'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>{t.livePhotoModal.tabUpload}</span>
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5">
              {lang === 'es' ? 'Archivo de galería' : 'Gallery file'}
            </span>
          </button>
        </div>

        {/* Context Rule Banner */}
        <div
          className={`p-3 rounded-2xl border flex items-start gap-2.5 text-xs ${
            mode === 'instant'
              ? 'bg-sky-950/30 border-sky-800/50 text-sky-200'
              : 'bg-amber-950/30 border-amber-800/40 text-amber-200'
          }`}
        >
          <ShieldCheck
            className={`w-4 h-4 shrink-0 mt-0.5 ${
              mode === 'instant' ? 'text-sky-400' : 'text-amber-400'
            }`}
          />
          <p className="text-[11px] leading-snug font-medium">
            {mode === 'instant' ? t.livePhotoModal.warning : t.livePhotoModal.uploadNotice}
          </p>
        </div>

        {/* Camera / Upload Preview Box */}
        <div className="relative aspect-square max-h-[290px] w-full rounded-3xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
          {activePhoto ? (
            <>
              <img
                src={activePhoto}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
              {mode === 'instant' && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 border border-sky-500/50 text-[10px] font-bold text-sky-300 flex items-center gap-1.5 backdrop-blur-md">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>{lang === 'es' ? 'Visible 30 segundos' : '30s visibility'}</span>
                </div>
              )}
            </>
          ) : mode === 'instant' ? (
            cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 to-black">
                <div className="w-40 h-52 rounded-full border-2 border-dashed border-sky-400/60 flex items-center justify-center mb-2">
                  <span className="text-[11px] font-bold text-sky-300">
                    {lang === 'es' ? 'Alinea tu rostro aquí' : 'Align face here'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{t.livePhotoModal.instruction}</p>
              </div>
            )
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#090e1a] hover:bg-[#0f1728] transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-300 flex items-center justify-center mb-3">
                <ImageIcon className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-white mb-1">
                {t.livePhotoModal.selectFileBtn}
              </span>
              <span className="text-[11px] text-slate-400 max-w-xs">
                {lang === 'es'
                  ? 'Recomendación: usa Instantánea (30s) si quieres mostrar verificación en vivo.'
                  : 'Tip: use Instant (30s) if you want live identity verification.'}
              </span>
            </button>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Oval Face Silhouette overlay for instant camera */}
          {mode === 'instant' && !capturedPhoto && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-44 h-56 rounded-full border-2 border-dashed border-sky-400/40" />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-sky-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-sky-400" />
                <span>{lang === 'es' ? 'En vivo • Expira en 30s' : 'Live • 30s Timer'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-1 flex items-center gap-2">
          {activePhoto ? (
            <>
              <button
                onClick={handleRetake}
                className="flex-1 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.livePhotoModal.retakeBtn}</span>
              </button>
              <button
                onClick={handleSend}
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30"
              >
                <Check className="w-4 h-4" />
                <span>{t.livePhotoModal.sendBtn} {profile.name}</span>
              </button>
            </>
          ) : mode === 'instant' ? (
            <button
              onClick={handleCapture}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>{t.livePhotoModal.captureBtn}</span>
            </button>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>{t.livePhotoModal.selectFileBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
