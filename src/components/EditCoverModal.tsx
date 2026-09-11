import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Check } from 'lucide-react';

interface EditCoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoverStyle?: string;
  onSelectCover: (coverStyle: string) => void;
}

export const COVER_PRESETS = [
  {
    id: 'circuit',
    name: 'Circuit Board & Matrix',
    description: 'Gold micro-traces on obsidian black surface',
    gradientClass: 'from-[#08090A] via-[#141517] to-[#1E170F]',
    accentGlow: 'radial-gradient(ellipse at top right, rgba(212,163,115,0.3), transparent 65%)',
    bgPattern: 'radial-gradient(circle, rgba(212,163,115,0.12) 1px, transparent 1px)',
    bgSize: '24px 24px',
  },
  {
    id: 'nebula',
    name: 'Amber Cosmic Horizon',
    description: 'Warm interstellar particles with luminous gold horizon',
    gradientClass: 'from-[#0A0603] via-[#1C140D] to-[#0D0E10]',
    accentGlow: 'radial-gradient(circle at 75% 30%, rgba(212,163,115,0.38), transparent 60%)',
    bgPattern: 'linear-gradient(to right, rgba(212,163,115,0.06) 1px, transparent 1px)',
    bgSize: '40px 40px',
  },
  {
    id: 'cybergrid',
    name: 'Quantum Orthogonal Grid',
    description: 'Crisp geometric engineering grid with subtle elevation',
    gradientClass: 'from-[#000000] via-[#0C0D0E] to-[#141517]',
    accentGlow: 'radial-gradient(circle at 20% 80%, rgba(212,163,115,0.25), transparent 50%)',
    bgPattern: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
    bgSize: '32px 32px',
  },
  {
    id: 'minimalist',
    name: 'Matte Obsidian & Gold Beacon',
    description: 'Minimalist high-contrast executive finish',
    gradientClass: 'from-[#050505] via-[#0D0D0E] to-[#121315]',
    accentGlow: 'linear-gradient(135deg, rgba(212,163,115,0.18) 0%, transparent 70%)',
    bgPattern: 'none',
    bgSize: 'auto',
  },
];

export function EditCoverModal({
  isOpen,
  onClose,
  currentCoverStyle = 'circuit',
  onSelectCover,
}: EditCoverModalProps) {
  const [selectedPreset, setSelectedPreset] = useState(currentCoverStyle);

  if (!isOpen) return null;

  const handleApply = () => {
    onSelectCover(selectedPreset);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#0C0D0E] border border-[#26282A] w-full max-w-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Accent border top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4A373] to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#26282A] mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#141517] border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373]">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Update Cover Banner
                </h3>
                <p className="text-xs font-subheading text-[#8E9296]">
                  Select an engineering backdrop for your member workspace
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[#8E9296] hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preset list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
            {COVER_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#D4A373] ring-1 ring-[#D4A373]/40 bg-[#141517]'
                      : 'border-[#26282A] bg-[#000000] hover:border-[#3D4042]'
                  }`}
                >
                  {/* Miniature preview */}
                  <div
                    className={`h-16 w-full rounded-xl mb-3 relative overflow-hidden bg-gradient-to-br ${preset.gradientClass} border border-[#26282A]`}
                    style={{
                      backgroundImage: `${preset.accentGlow}, ${preset.bgPattern}`,
                      backgroundSize: `auto, ${preset.bgSize}`,
                    }}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#D4A373] text-black flex items-center justify-center shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-heading font-bold text-white mb-0.5">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] font-subheading text-[#8E9296] line-clamp-2">
                      {preset.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#26282A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-subheading text-[#D1D5DB] hover:text-white border border-[#26282A] hover:bg-[#141517] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-[#D4A373] hover:bg-[#c49363] text-black text-xs font-heading font-bold transition-all shadow-md shadow-[#D4A373]/20 cursor-pointer"
            >
              Apply Cover
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
