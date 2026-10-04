import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { events } from '../data/events';
import sMarkImg from '../assets/srijan-s-mark.png';

export default function CTASection() {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <section id="register-cta" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background glow flares */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-600/15 rounded-full blur-[100px] pointer-events-none" />

     
    </section>
  );
}
