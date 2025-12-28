"use client"

import { useState } from "react"
import Image from "next/image"

export function ReglesIncontournablesContent() {
  const [visibleCount, setVisibleCount] = useState(5)

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white min-h-screen">
      <div className="relative w-full" style={{ minHeight: "620px" }}>

        {/* 1 - Le nom de domaine */}
        <div className={`absolute transition-all duration-500 ${visibleCount >= 1 ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: "2%", left: "2%", zIndex: 10 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#e91e8c] font-bold text-lg">|</span>
            <span className="text-[#1a5a7a] font-bold text-sm">1 - Le nom de domaine</span>
          </div>
          <div className="relative">
            <div className="w-28 h-18 bg-gray-700 rounded-t-lg p-1 shadow-lg">
              <div className="w-full h-full bg-white rounded p-1">
                <div className="flex items-center gap-1 mb-1 bg-gray-100 rounded px-1 py-0.5">
                  <span className="text-[#4fafc4] text-xs">🔍</span>
                  <div className="flex-1 h-1 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 border border-gray-300 rounded-full"></div>
                    <span className="text-[#e91e8c]">.com</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 bg-[#e91e8c] rounded-full"></div>
                    <span className="text-[#1a5a7a]">.fr</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-32 h-1 bg-gray-600 rounded-b mx-auto"></div>
            <div className="w-36 h-0.5 bg-gray-400 rounded mx-auto mt-0.5"></div>
          </div>
        </div>

        {/* 2 - Le site internet */}
        <div className={`absolute transition-all duration-500 ${visibleCount >= 2 ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: "0%", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
          <div className="flex items-center gap-2 mb-2 justify-center">
            <span className="text-[#e91e8c] font-bold text-lg">|</span>
            <span className="text-[#1a5a7a] font-bold text-sm">2 - Le site internet</span>
          </div>
          <div className="relative">
            <div className="w-28 h-20 bg-gray-300 rounded-lg p-1 shadow-lg">
              <div className="w-full h-full bg-white rounded flex overflow-hidden">
                <div className="w-6 bg-[#1a5a7a] flex flex-col gap-0.5 p-1">
                  <div className="w-full h-1 bg-white/50 rounded"></div>
                  <div className="w-full h-1 bg-white/50 rounded"></div>
                  <div className="w-full h-1 bg-white/50 rounded"></div>
                </div>
                <div className="flex-1 p-1 grid grid-cols-2 gap-1">
                  <div className="bg-[#4fafc4] rounded"></div>
                  <div className="bg-[#4fafc4] rounded"></div>
                  <div className="bg-gray-200 rounded"></div>
                  <div className="bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="w-5 h-5 bg-gray-400 mx-auto"></div>
            <div className="w-16 h-1 bg-gray-400 rounded mx-auto"></div>
          </div>
        </div>

        {/* 5 - Le referencement */}
        <div className={`absolute transition-all duration-500 ${visibleCount >= 5 ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: "2%", right: "2%", zIndex: 10 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#e91e8c] font-bold text-lg">|</span>
            <span className="text-[#1a5a7a] font-bold text-sm">5 - Le referencement</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-10 h-16 bg-gray-800 rounded-xl p-0.5 shadow-lg">
              <div className="w-full h-full bg-white rounded-lg p-1">
                <div className="space-y-0.5">
                  <div className="w-full h-1 bg-[#4fafc4] rounded"></div>
                  <div className="w-3/4 h-0.5 bg-gray-300 rounded"></div>
                  <div className="w-full h-1 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-0.5 bg-gray-400 rotate-45 rounded"></div>
              </div>
              <div className="flex items-end gap-0.5">
                <div className="w-1.5 h-2 bg-[#4fafc4] rounded-sm"></div>
                <div className="w-1.5 h-4 bg-[#4fafc4] rounded-sm"></div>
                <div className="w-1.5 h-6 bg-[#e91e8c] rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Globe central */}
        <div className="absolute" style={{ top: "30%", left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
          <button type="button" onClick={() => setVisibleCount(prev => prev < 5 ? prev + 1 : 0)}
            className="group relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl border-4 border-[#4fafc4]">
            <Image src="/p2.jpeg" alt="Globe" fill className="object-cover group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* 3 - L hebergement */}
        <div className={`absolute transition-all duration-500 ${visibleCount >= 3 ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: "78%", left: "5%", zIndex: 10 }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1a5a7a] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">🔒</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="w-12 h-4 bg-[#4fafc4] rounded flex items-center justify-center gap-0.5 shadow">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="w-12 h-4 bg-[#f5a623] rounded flex items-center justify-center gap-0.5 shadow">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              </div>
              <div className="w-12 h-4 bg-[#f5a623] rounded flex items-center justify-center gap-0.5 shadow">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#e91e8c] font-bold text-lg">|</span>
            <span className="text-[#1a5a7a] font-bold text-sm">3 - L hebergement</span>
          </div>
        </div>

        {/* 4 - La mise a jour */}
        <div className={`absolute transition-all duration-500 ${visibleCount >= 4 ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: "70%", right: "28%", zIndex: 10 }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#e91e8c] font-bold text-lg">|</span>
            <span className="text-[#1a5a7a] font-bold text-sm">4 - La mise a jour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-28 h-18 bg-gray-300 rounded-t-lg p-1 shadow-lg">
                <div className="w-full h-full bg-white rounded overflow-hidden">
                  <div className="h-2 bg-gray-100 flex items-center px-1 gap-0.5">
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="p-1 flex gap-1">
                    <div className="flex-1 space-y-0.5">
                      <div className="h-1 bg-[#4fafc4] rounded"></div>
                      <div className="h-1 bg-gray-200 rounded"></div>
                      <div className="h-1 bg-[#4fafc4] rounded"></div>
                    </div>
                    <div className="w-8 space-y-0.5">
                      <div className="h-5 bg-yellow-300 rounded flex items-center justify-center text-[8px]">📁</div>
                      <div className="h-5 bg-[#4fafc4] rounded flex items-center justify-center text-[8px]">🖼️</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-32 h-1 bg-gray-400 rounded-b mx-auto"></div>
            </div>
            <div className="text-xl">📢</div>
          </div>
        </div>

        {/* Encadre noir */}
        <div className="absolute bg-[#1a1a1a] text-white px-3 py-2 rounded-lg shadow-xl"
          style={{ bottom: "2%", right: "3%", zIndex: 10 }}>
          <p className="text-xs font-bold text-center leading-relaxed">
            Les 5 regles incontournables<br />pour avoir une presence<br />efficace sur internet
          </p>
        </div>

        {/* Fleches de navigation */}
        <div className="absolute flex gap-2" style={{ bottom: "2%", right: "4%", zIndex: 30, marginTop: "6px" }}>
          <button 
            onClick={() => setVisibleCount(prev => prev > 0 ? prev - 1 : 5)}
            className="w-7 h-7 bg-[#e91e8c] rounded-full flex items-center justify-center text-white hover:bg-[#d11a7a] shadow-lg transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 19V5l-11 7z"/>
            </svg>
          </button>
          <button 
            onClick={() => setVisibleCount(prev => prev < 5 ? prev + 1 : 0)}
            className="w-7 h-7 bg-[#f5a623] rounded-full flex items-center justify-center text-white hover:bg-[#e09520] shadow-lg transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}
