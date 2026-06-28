import React from 'react';

export default function HeroSection() {
  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col justify-between p-8 md:p-12 pointer-events-none select-none text-white font-mono">
      {/* Top Header */}
      <div className="flex justify-between items-start w-full">
        <div>
          <div className="text-[10px] tracking-[4px] text-gray-500 uppercase">SYS_STATUS</div>
          <div className="text-xs text-[#00ffd5] mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffd5] animate-ping" />
            INTEGRITY NOMINAL
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] tracking-[4px] text-gray-500 uppercase">CORE_VERSION</div>
          <div className="text-xs text-gray-400 mt-1">V2.4.9 // ACTIVE</div>
        </div>
      </div>

      {/* Middle Headline Section */}
      <div className="max-w-xl self-start my-auto">
        <h1 className="text-4xl md:text-5xl font-light tracking-[8px] uppercase text-white font-sans">
          Null State
        </h1>
        <p className="text-xs text-gray-400 mt-4 leading-relaxed font-mono tracking-wide">
          An atmospheric cyberintelligence visualization simulating vector anomaly paths, wavefront expansions, and structural node groupings in dynamic equilibrium.
        </p>
        <div className="mt-8 flex gap-4 text-[10px] text-gray-500 tracking-[2px] uppercase">
          <div>[ HOVER TO ORIENT ]</div>
          <div>[ SCROLL TO AWAKEN ]</div>
        </div>
      </div>

      {/* Bottom Interface */}
      <div className="flex justify-between items-end w-full">
        {/* Placeholder element for the NarrativeSystem typewriter to hook onto */}
        <div className="min-h-[50px] max-w-sm">
          <div className="text-[9px] uppercase tracking-[3px] text-gray-500 mb-2">TELEMETRY_STREAM</div>
          {/* This target is mutated directly by NarrativeSystem and VisualLanguageSystem */}
          <div id="narrative-telemetry-hud" className="text-xs text-[#00ffd5]">
            &gt; Awaiting presence...
          </div>
        </div>
        
        <div className="text-right text-[10px] text-gray-500 tracking-[3px] uppercase">
          SECURE VECTOR ANALYSIS
        </div>
      </div>
    </div>
  );
}
