import { motion } from 'motion/react';
import { Box, Layers, Sparkles, Compass } from 'lucide-react';

interface ThreeDVisualAreaProps {
  className?: string;
}

/**
 * Dedicated 3D Visual Area component.
 * Engineered as an isolated mount point for a future Three.js / WebGL / Canvas scene.
 * Inspired by the sleek showcase framing in the reference design.
 * Does not implement Three.js or fake 3D graphics now; provides the exact container
 * structure, responsive boundaries, and coordinate anchor required for seamless injection.
 */
export function ThreeDVisualArea({ className = '' }: ThreeDVisualAreaProps) {
  return (
    <div
      className={`relative w-full h-full min-h-[360px] md:min-h-[460px] lg:min-h-[580px] rounded-3xl bg-[#000000] border border-[#26282A] overflow-hidden flex flex-col justify-between p-6 sm:p-8 shadow-2xl transition-all duration-300 group hover:border-[#D4A373]/50 ${className}`}
      data-testid="3d-visual-container"
    >
      {/* Background Precision Grid & Warm Radial Ambient Glow */}
      <div className="absolute inset-0 bg-tech-grid opacity-70 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#D4A373]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Target DOM Element for Future Three.js Renderer Mount */}
      <div
        id="three-canvas-container"
        className="absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center justify-center"
        aria-label="3D Canvas Mount Point"
      >
        {/* Three.js canvas will append here directly */}
      </div>

      {/* Modern Technical Reticles in Brand Secondary #D4A373 */}
      <div className="absolute top-4 left-4 text-[#D4A373]/50 font-mono-tech text-xs select-none pointer-events-none">
        +
      </div>
      <div className="absolute top-4 right-4 text-[#D4A373]/50 font-mono-tech text-xs select-none pointer-events-none">
        +
      </div>
      <div className="absolute bottom-4 left-4 text-[#D4A373]/50 font-mono-tech text-xs select-none pointer-events-none">
        +
      </div>
      <div className="absolute bottom-4 right-4 text-[#D4A373]/50 font-mono-tech text-xs select-none pointer-events-none">
        +
      </div>

      {/* Top Header Bar */}
      <div className="relative z-20 flex items-center justify-between border-b border-[#26282A] pb-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A373] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4A373]" />
          </span>
          <span className="font-heading text-xs font-semibold tracking-wide text-[#E5E7EB]">
            3D Visual Stage
          </span>
          <span className="text-[10px] font-subheading text-[#8E9296] hidden sm:inline">
            // Dedicated WebGL Viewport
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-subheading text-[11px] text-[#D4A373] bg-[#0C0D0E] px-3 py-1 rounded-full border border-[#D4A373]/30">
          <Layers className="w-3 h-3 text-[#D4A373]" />
          <span>CANVAS READY</span>
        </div>
      </div>

      {/* Center Showcase Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-20 my-auto flex flex-col items-center text-center px-4 py-8"
      >
        {/* Floating Geometric Reticle Card */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Ambient warm glow halo */}
          <div className="absolute -inset-4 rounded-full bg-[#D4A373]/10 blur-xl group-hover:bg-[#D4A373]/20 transition-all" />

          <div className="relative w-24 h-24 rounded-3xl bg-[#0C0D0E] border border-[#26282A] flex items-center justify-center shadow-2xl group-hover:border-[#D4A373]/60 transition-colors">
            <Box className="w-10 h-10 text-[#D4A373] stroke-[1.5]" />
          </div>

          {/* Orbiting dashed precision indicator */}
          <div className="absolute -inset-3 rounded-3xl border border-dashed border-[#D4A373]/30 animate-[spin_25s_linear_infinite]" />
        </div>

        {/* Headings in Inter, Subheadings in Century Gothic */}
        <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          3D Visual Area
        </h3>
        <p className="font-subheading text-sm text-[#A3A3A3] max-w-sm mb-5 leading-relaxed">
          Dedicated interactive stage reserved for Ascent’s 3D technology visual. Seamlessly mount a
          Three.js or WebGL scene without altering the layout.
        </p>

        {/* Spec Pill Tags inspired by the reference image tags */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-subheading text-xs px-3 py-1 rounded-full bg-[#0C0D0E] text-[#D1D5DB] border border-[#26282A]">
            Target: <code className="text-[#D4A373] font-mono-tech">#three-canvas-container</code>
          </span>
          <span className="font-subheading text-xs px-3 py-1 rounded-full bg-[#0C0D0E] text-[#D1D5DB] border border-[#26282A]">
            Engine: Three.js / WebGL
          </span>
          <span className="font-subheading text-xs px-3 py-1 rounded-full bg-[#0C0D0E] text-[#D1D5DB] border border-[#26282A] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#D4A373]" /> Responsive 100% W/H
          </span>
        </div>
      </motion.div>

      {/* Bottom Footer Telemetry */}
      <div className="relative z-20 pt-3.5 border-t border-[#26282A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-subheading text-[#717579]">
        <span className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#D4A373]" />
          Viewport Container: Active
        </span>
        <span className="text-[#A3A3A3]">Ascent Tech Club Interactive Module</span>
      </div>
    </div>
  );
}
