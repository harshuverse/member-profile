import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemberCertificate, MemberProfile } from '../types';
import { Download, Printer, X, Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  certificate: MemberCertificate | null;
  member: MemberProfile;
  onClose: () => void;
}

export function CertificateModal({ certificate, member, onClose }: CertificateModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!certificate) return null;

  // Generate and download a crisp high-res 1200x850 certificate image
  const handleDownload = () => {
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 850;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // 1. Background
        ctx.fillStyle = '#08090A';
        ctx.fillRect(0, 0, 1200, 850);

        // 2. Subtle radial gradient glow
        const radGrad = ctx.createRadialGradient(600, 425, 50, 600, 425, 600);
        radGrad.addColorStop(0, 'rgba(212, 163, 115, 0.08)');
        radGrad.addColorStop(1, 'rgba(8, 9, 10, 0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, 1200, 850);

        // 3. Double Golden Border
        ctx.strokeStyle = '#D4A373';
        ctx.lineWidth = 4;
        ctx.strokeRect(36, 36, 1128, 778);

        ctx.strokeStyle = '#3E3427';
        ctx.lineWidth = 1;
        ctx.strokeRect(46, 46, 1108, 758);

        // Decorative corner accents
        const drawCorner = (x: number, y: number) => {
          ctx.strokeStyle = '#D4A373';
          ctx.lineWidth = 3;
          ctx.strokeRect(x - 12, y - 12, 24, 24);
        };
        drawCorner(36, 36);
        drawCorner(1164, 36);
        drawCorner(36, 814);
        drawCorner(1164, 814);

        // 4. Header / Brand
        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '6px';
        ctx.fillText('ASCENT TECH CLUB • EXCELLENCE IN ENGINEERING', 600, 110);

        // 5. Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 38px "Space Grotesk", sans-serif';
        ctx.fillText(certificate.title.toUpperCase(), 600, 175);

        // Gold divider line
        ctx.strokeStyle = '#D4A373';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(450, 205);
        ctx.lineTo(750, 205);
        ctx.stroke();

        // 6. Subtitle
        ctx.fillStyle = '#9CA3AF';
        ctx.font = 'italic 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('This official credential is systematically issued and presented to', 600, 255);

        // 7. Member Name
        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 44px "Space Grotesk", sans-serif';
        ctx.fillText(member.name, 600, 320);

        // 8. Member ID & USN
        ctx.fillStyle = '#E5E7EB';
        ctx.font = 'bold 18px "JetBrains Mono", monospace';
        ctx.fillText(`MEMBER ID: ${member.id}  •  STUDENT USN: ${member.usn}`, 600, 360);

        // Department
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${member.department} (${member.year})`, 600, 395);

        // 9. Citation / Description
        ctx.fillStyle = '#D1D5DB';
        ctx.font = '16px "Plus Jakarta Sans", sans-serif';
        const words = certificate.description.split(' ');
        let line = '';
        let yPos = 460;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 850 && n > 0) {
            ctx.fillText(line, 600, yPos);
            line = words[n] + ' ';
            yPos += 28;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 600, yPos);

        // 10. Security & Verification Section
        ctx.fillStyle = '#6B7280';
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillText(`VERIFICATION CODE: ${certificate.verificationCode}  |  STATUS: AUTHENTICATED`, 600, 590);
        ctx.fillText(`DATE OF ISSUE: ${certificate.issueDate}  |  ISSUING BODY: ${certificate.issuer}`, 600, 615);

        // 11. Signatures
        // Left signature: Lead Faculty Advisor
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(180, 710);
        ctx.lineTo(380, 710);
        ctx.stroke();

        ctx.fillStyle = '#D4A373';
        ctx.font = 'italic 16px "Plus Jakarta Sans", cursive';
        ctx.fillText('Dr. S. K. Venkatesh', 280, 695);

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('FACULTY ADVISOR', 280, 732);
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Dept. of Computer Science & Eng.', 280, 748);

        // Right signature: Student Chapter President
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(820, 710);
        ctx.lineTo(1020, 710);
        ctx.stroke();

        ctx.fillStyle = '#D4A373';
        ctx.font = 'italic 16px "Plus Jakarta Sans", cursive';
        ctx.fillText('Rohit Sharma', 920, 695);

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('PRESIDENT, ASCENT', 920, 732);
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Student Technical Chapter', 920, 748);

        // Center Seal Circle
        ctx.strokeStyle = '#D4A373';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(600, 710, 36, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 10px "Space Grotesk", sans-serif';
        ctx.fillText('ASCENT', 600, 706);
        ctx.font = 'bold 8px "Space Grotesk", sans-serif';
        ctx.fillText('VERIFIED SEAL', 600, 718);

        // Trigger file download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Ascent_${certificate.verificationCode}_${member.name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Download error', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#26282A] bg-[#000000]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#141517] border border-[#D4A373]/50 flex items-center justify-center text-[#D4A373]">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-white">
                  Official Credential Preview
                </h3>
                <span className="text-[11px] font-mono-tech text-[#8E9296]">
                  {certificate.verificationCode}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141517] hover:bg-[#1E2022] text-[#D1D5DB] hover:text-white border border-[#26282A] text-xs font-subheading transition-colors"
                title="Print or Save PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#D4A373] hover:bg-[#c49363] text-black text-xs font-heading font-bold transition-all shadow-md shadow-[#D4A373]/20 cursor-pointer"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloading ? 'Generating...' : 'Download Certificate'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-[#141517] hover:bg-[#1E2022] text-[#8E9296] hover:text-white border border-[#26282A] transition-colors ml-1"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificate Graphical Layout Container */}
          <div className="p-4 sm:p-8 overflow-y-auto flex items-center justify-center bg-[#050607]">
            <div className="w-full max-w-3xl bg-[#08090A] border-2 border-[#D4A373]/70 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
              {/* Inner accent ring */}
              <div className="absolute inset-2 sm:inset-3 border border-[#D4A373]/20 rounded-xl pointer-events-none" />

              {/* Watermark Logo in background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <span className="font-heading text-9xl font-black tracking-widest text-[#D4A373]">
                  ASCENT
                </span>
              </div>

              {/* Certificate Header */}
              <div className="text-center relative z-10 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141517] border border-[#D4A373]/30 text-[#D4A373] text-[11px] font-subheading tracking-widest uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>ASCENT TECH CLUB • EXCELLENCE IN ENGINEERING</span>
                </div>

                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-2">
                  {certificate.title}
                </h1>

                <div className="w-20 h-0.5 bg-[#D4A373] mx-auto my-3" />

                <p className="font-subheading text-xs text-[#9CA3AF] italic">
                  This official club credential is systematically awarded to
                </p>

                {/* Recipient Member Name */}
                <div className="py-2">
                  <span className="font-heading text-3xl sm:text-4xl font-black text-[#D4A373] tracking-wide block">
                    {member.name}
                  </span>
                  <span className="font-mono-tech text-xs text-[#E5E7EB] block mt-1">
                    MEMBER ID: <strong className="text-white">{member.id}</strong> • USN: {member.usn}
                  </span>
                  <span className="text-xs font-subheading text-[#9CA3AF] block">
                    {member.department} ({member.year})
                  </span>
                </div>

                {/* Citation Statement */}
                <p className="font-subheading text-xs sm:text-sm text-[#D1D5DB] max-w-xl mx-auto py-2 leading-relaxed">
                  {certificate.description}
                </p>

                {/* Security Verification Hash */}
                <div className="py-2 flex items-center justify-center gap-2 text-[11px] font-mono-tech text-[#8E9296]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>VERIFICATION: {certificate.verificationCode}</span>
                  <span>•</span>
                  <span>ISSUE DATE: {certificate.issueDate}</span>
                </div>

                {/* Signatures & Seal */}
                <div className="pt-6 mt-6 border-t border-[#26282A] grid grid-cols-3 items-center gap-4 text-center">
                  <div>
                    <div className="border-b border-[#4B5563] pb-1 mx-auto max-w-[150px]">
                      <span className="font-subheading text-xs italic text-[#D4A373]">
                        Dr. S. K. Venkatesh
                      </span>
                    </div>
                    <span className="text-[10px] font-subheading text-[#8E9296] uppercase tracking-wider block mt-1">
                      FACULTY ADVISOR
                    </span>
                  </div>

                  {/* Stamp */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#D4A373] flex items-center justify-center text-[#D4A373] text-[9px] font-heading font-bold text-center leading-tight">
                      ASCENT
                      <br />
                      VERIFIED
                    </div>
                  </div>

                  <div>
                    <div className="border-b border-[#4B5563] pb-1 mx-auto max-w-[150px]">
                      <span className="font-subheading text-xs italic text-[#D4A373]">
                        Rohit Sharma
                      </span>
                    </div>
                    <span className="text-[10px] font-subheading text-[#8E9296] uppercase tracking-wider block mt-1">
                      CLUB PRESIDENT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-[#26282A] bg-[#000000]/60 flex items-center justify-between text-xs font-subheading text-[#8E9296]">
            <span>Authenticated document backed by Ascent Club Public Registry.</span>
            <button
              type="button"
              onClick={handleDownload}
              className="text-[#D4A373] hover:underline font-medium cursor-pointer"
            >
              Download PNG Image →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
