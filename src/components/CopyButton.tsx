import React, { useState } from 'react';
import { Copy, Check, Share2, Eye, EyeOff } from 'lucide-react';
import type { SplitResult, PersonShare } from '../types/split';
import { buildShareMessage } from '../utils/formatters';

interface CopyButtonProps {
  splitResult: SplitResult;
  personShares: PersonShare[];
  onTriggerToast: (msg: string) => void;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  splitResult,
  personShares,
  onTriggerToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [includeItems, setIncludeItems] = useState(true);

  if (!splitResult.isValid) return null;

  const message = buildShareMessage(splitResult, personShares, includeItems);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(message);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = message;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      onTriggerToast('📋 คัดลอกข้อความแล้ว พร้อมส่งใน LINE / Messenger!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
      onTriggerToast('ไม่สามารถคัดลอกได้อัตโนมัติ กรุณากดค้างเพื่อคัดลอก');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SplitMeal - สรุปค่าอาหาร',
          text: message,
        });
        onTriggerToast('📤 แชร์สำเร็จ!');
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-150 mb-6 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-stone-800 m-0">ส่งผลลัพธ์ให้เพื่อน</h2>
          <p className="text-[11px] text-stone-400 m-0">ข้อความจัดฟอร์แมตพร้อมส่งใน LINE ทันที</p>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>ซ่อนตัวอย่าง</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>ดูตัวอย่าง</span>
            </>
          )}
        </button>
      </div>

      {/* Preview box if toggled */}
      {showPreview && (
        <div className="mb-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 whitespace-pre-wrap font-mono leading-relaxed animate-fade-in relative">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/80 text-[11px] font-sans">
            <span className="text-stone-500">รูปแบบข้อความ:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeItems}
                onChange={(e) => setIncludeItems(e.target.checked)}
                className="rounded accent-orange-500"
              />
              <span>แนบรายการอาหาร</span>
            </label>
          </div>
          {message}
        </div>
      )}

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          id="copy-result-btn"
          onClick={handleCopy}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-98 text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>คัดลอกเรียบร้อย! 🎉</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>คัดลอกข้อความ (LINE/แชท)</span>
            </>
          )}
        </button>

        {hasNativeShare && (
          <button
            type="button"
            id="share-result-btn"
            onClick={handleShare}
            className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-800 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Share2 className="w-4 h-4 text-stone-600" />
            <span>แชร์ผลลัพธ์</span>
          </button>
        )}
      </div>
    </div>
  );
};
