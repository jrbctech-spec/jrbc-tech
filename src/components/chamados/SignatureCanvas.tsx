'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenLine, Trash2, CheckCircle2 } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void;
  onClear?: () => void;
  width?: number;
  height?: number;
  disabled?: boolean;
}

export default function SignatureCanvas({ onSave, onClear, width = 600, height = 180, disabled }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a'; // slate-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    } else {
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(e, canvas);
    setIsDrawing(true);
    setLastPos(pos);
    setHasSig(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setLastPos(pos);
  };

  const stopDrawing = () => { setIsDrawing(false); };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
    onClear?.();
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSig) return;
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <PenLine className="w-3.5 h-3.5" />
        <span>Assine com o dedo (celular) ou mouse (computador)</span>
      </div>

      <div className={`relative rounded-xl border-2 overflow-hidden ${disabled ? 'border-slate-700 opacity-60' : hasSig ? 'border-sky-500/60' : 'border-slate-600 border-dashed'}`}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full cursor-crosshair select-none touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: 'none' }}
        />
        {!hasSig && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-600 text-xs font-medium">Assine aqui</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-700" />
      </div>

      <div className="flex gap-2.5">
        <button type="button" onClick={clear} disabled={!hasSig} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:border-rose-500/50 hover:text-rose-300 disabled:opacity-30 min-h-[44px] transition-colors">
          <Trash2 className="w-4 h-4" /> Limpar Assinatura
        </button>
        <button type="button" onClick={save} disabled={!hasSig || disabled} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-xs font-bold disabled:opacity-30 min-h-[44px] shadow-glow-cyan hover:from-sky-400 hover:to-cyan-400 transition-all">
          <CheckCircle2 className="w-4 h-4" /> Confirmar Assinatura
        </button>
      </div>
    </div>
  );
}
