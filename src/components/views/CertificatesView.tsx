import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Download,
  Eye,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { MemberProfile, MemberCertificate } from '../../types';

interface CertificatesViewProps {
  profile: MemberProfile;
  onPreviewCertificate: (cert: MemberCertificate) => void;
}

export function CertificatesView({ profile, onPreviewCertificate }: CertificatesViewProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const certificates = profile.certificates || [];

  const handleDownload = (cert: MemberCertificate) => {
    setDownloadingId(cert.id);
    setTimeout(() => {
      setDownloadingId(null);
      setSuccessId(cert.id);
      setTimeout(() => setSuccessId(null), 2500);
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Bar */}
      <div className="bg-[#0C0D0E] border border-[#26282A] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Certifications</h1>
        </div>

        <div className="flex items-center gap-3 bg-[#000000] border border-[#26282A] rounded-xl px-4 py-2.5 shrink-0">
          <Award className="w-5 h-5 text-[#D4A373]" />
          <div>
            <div className="font-heading text-base font-bold text-white">{certificates.length} Total</div>
            <div className="text-[10px] text-emerald-400 font-subheading">All Credentials Verified</div>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificates.map((cert) => {
          const isDownloading = downloadingId === cert.id;
          const isSuccess = successId === cert.id;

          return (
            <div
              key={cert.id}
              className="bg-[#0C0D0E] border border-[#26282A] hover:border-[#D4A373]/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-1 text-[11px] text-[#8E9296] font-mono-tech">
                    <Calendar className="w-3 h-3" />
                    <span>{cert.issueDate}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-base font-bold text-white group-hover:text-[#D4A373] transition-colors">
                    {cert.title}
                  </h3>
                  <p className="font-subheading text-xs text-[#8E9296] mt-1.5 leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#000000] border border-[#26282A] space-y-1 font-mono-tech text-[11px]">
                  <div className="flex justify-between text-[#8E9296]">
                    <span>Issuer:</span>
                    <span className="text-white truncate max-w-[140px]">{cert.issuer}</span>
                  </div>
                  <div className="flex justify-between text-[#8E9296]">
                    <span>Verification Code:</span>
                    <span className="text-[#D4A373]">{cert.verificationCode}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#26282A] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPreviewCertificate(cert)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#141517] hover:bg-[#1E2022] text-white border border-[#26282A] hover:border-[#D4A373]/40 text-xs font-subheading flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(cert)}
                  disabled={isDownloading}
                  className={`py-2 px-3 rounded-xl text-xs font-subheading flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                    isSuccess
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-[#000000] hover:bg-[#141517] text-[#D1D5DB] border-[#26282A]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloading ? 'Saving...' : isSuccess ? 'Saved' : 'Download'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
