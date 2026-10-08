import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { SplitResult } from '../types/split';
import { formatBaht } from '../utils/formatters';

interface ValidationBannerProps {
  splitResult: SplitResult;
  hasErrors: boolean;
  errorMessage?: string;
}

export const ValidationBanner: React.FC<ValidationBannerProps> = ({
  splitResult,
  hasErrors,
  errorMessage,
}) => {
  if (hasErrors || !splitResult.isValid) {
    return (
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200/80 mb-3.5 text-xs animate-fade-in">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-medium">
          {errorMessage || splitResult.validationMessage || '⚠️ กรุณาตรวจสอบข้อมูล'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 mb-3.5 text-xs animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-emerald-950 block">
            ✅ ยอดตรงกันพอดี
          </span>
          <span className="text-[11px] text-emerald-700">
            รวมรายการได้ {formatBaht(splitResult.sumWeighted)} บาท (คลาดเคลื่อน 0.00 บาท)
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-lg text-emerald-800">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>0 Satang Drift</span>
      </div>
    </div>
  );
};
