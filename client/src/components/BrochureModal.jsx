import React from 'react';
import { X, Clock, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrochureModal({ isOpen, onClose, event }) {
  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#151c26] border border-[#00e5ff]/30 shadow-2xl shadow-[#00e5ff]/10 text-center text-[#dce3f0]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 border border-transparent hover:border-[#3b494c]/40 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#0d141d] border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.2)]">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        {/* Title */}
        <span className="inline-block px-3 py-1 rounded text-xs font-mono font-medium tracking-wider uppercase bg-[#0d141d] text-[#ffd799] border border-[#ffd799]/30 mb-3">
          Event {event.number} // {event.name}
        </span>
        <h3 id="modal-title" className="text-2xl font-display font-bold text-white mb-2">
          Brochure Finalizing
        </h3>

        {/* Message */}
        <p className="text-sm text-[#bac9cc] mb-6 leading-relaxed">
          The official specification rulebook and problem statements for{' '}
          <span className="text-[#00daf3] font-semibold">{event.name}</span> are currently undergoing final faculty and committee review.
        </p>

        {/* Informative box */}
        <div className="p-4 rounded-xl bg-[#0d141d] border border-[#3b494c]/30 text-xs sm:text-sm text-[#bac9cc] text-left mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#ffd799] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-medium mb-1 font-mono">BROCHURE_RELEASE_STATUS</p>
            <p className="text-xs text-[#bac9cc]">
              Once approved, the PDF will be directly downloadable here and sent to all verified participant emails.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-mono uppercase text-[#bac9cc] hover:text-white bg-[#19202a] hover:bg-[#242a34] border border-[#3b494c]/40 transition-colors"
          >
            Dismiss
          </button>
          <Link
            to={`/register/${event.id}`}
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-mono uppercase font-bold text-[#00363d] bg-[#00e5ff] hover:bg-[#00daf3] shadow-[0_0_16px_rgba(0,229,255,0.4)] transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Register Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
