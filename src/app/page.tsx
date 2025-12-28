'use client';

import { useState } from 'react';

type Tab = 'workout' | 'discover' | 'trophies';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('workout');

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0F1115]/80 backdrop-blur-xl border-b border-white/5 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
              Load It
            </h1>
            <button className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-base font-bold text-white shadow-lg shadow-blue-500/50">
              E
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - with padding for fixed header and bottom nav */}
      <main className="pt-20 pb-24 px-4 container mx-auto">
        {activeTab === 'workout' && <WorkoutTab />}
        {activeTab === 'discover' && <DiscoverTab />}
        {activeTab === 'trophies' && <TrophiesTab />}
      </main>

      {/* Bottom Navigation - Glassmorphism */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1C1F26]/60 backdrop-blur-2xl border-t border-white/5 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ${
                activeTab === 'workout'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs font-bold">Antrenman</span>
            </button>

            <button
              onClick={() => setActiveTab('discover')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ${
                activeTab === 'discover'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-bold">Keşfet</span>
            </button>

            <button
              onClick={() => setActiveTab('trophies')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ${
                activeTab === 'trophies'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="text-xs font-bold">Kupalar</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

// Antrenman Tab Component
function WorkoutTab() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2 tracking-tight">Bugünkü Antrenman</h2>
        <p className="text-gray-500 text-sm font-semibold">Pazartesi, 28 Aralık 2025</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#1C1F26] rounded-xl p-4 border border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-all">
          <div className="text-3xl font-black text-white mb-1">12</div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Antrenman</div>
        </div>
        <div className="bg-[#1C1F26] rounded-xl p-4 border border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-all">
          <div className="text-3xl font-black text-white mb-1">3</div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bu Hafta</div>
        </div>
        <div className="bg-[#1C1F26] rounded-xl p-4 border border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-all">
          <div className="text-3xl font-black text-white mb-1">8</div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">PR</div>
        </div>
      </div>

      {/* Start Workout Button */}
      <button className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-black py-5 rounded-xl mb-6 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 hover:scale-[1.02] active:scale-[0.98]">
        <div className="flex items-center justify-center gap-3">
          <span className="text-lg tracking-wide">ANTRENMAN BAŞLAT</span>
        </div>
      </button>

      {/* Recent Workouts */}
      <div className="space-y-3">
        <h3 className="text-xl font-black mb-4 tracking-tight">Son Antrenmanlar</h3>
        
        <div className="bg-[#1C1F26] rounded-xl p-5 border border-white/5 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg">Göğüs & Triceps</h4>
            <span className="text-xs text-gray-500 font-semibold">2 gün önce</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-gray-400">
            <span>45 dk</span>
            <span>•</span>
            <span>8 egzersiz</span>
            <span>•</span>
            <span className="text-blue-400 font-bold">+2.5kg PR 🔥</span>
          </div>
        </div>

        <div className="bg-[#1C1F26] rounded-xl p-5 border border-white/5 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg">Bacak Günü</h4>
            <span className="text-xs text-gray-500 font-semibold">4 gün önce</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-gray-400">
            <span>60 dk</span>
            <span>•</span>
            <span>6 egzersiz</span>
            <span>•</span>
            <span className="text-blue-400 font-bold">+5kg Squat PR 💪</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keşfet Tab Component
function DiscoverTab() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2 tracking-tight">Keşfet</h2>
        <p className="text-gray-500 text-sm font-semibold">Topluluğun başarılarını gör</p>
      </div>

      <div className="space-y-4">
        {/* Post 1 */}
        <div className="bg-[#1C1F26] rounded-xl p-5 border border-white/5 hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30">
              A
            </div>
            <div>
              <h4 className="font-bold text-base">Ahmet Yılmaz</h4>
              <p className="text-xs text-gray-500 font-semibold">2 saat önce</p>
            </div>
          </div>
          <p className="mb-4 text-base font-medium leading-relaxed">Yeni Bench Press PR! 🎉 <span className="text-blue-400 font-black text-lg">100kg</span> x 5 rep</p>
          <div className="flex items-center gap-5 text-sm font-bold text-gray-400">
            <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <span>❤️</span>
              <span>24</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <span>💬</span>
              <span>8</span>
            </button>
          </div>
        </div>

        {/* Post 2 */}
        <div className="bg-[#1C1F26] rounded-xl p-5 border border-white/5 hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-violet-500/30">
              M
            </div>
            <div>
              <h4 className="font-bold text-base">Mehmet Demir</h4>
              <p className="text-xs text-gray-500 font-semibold">5 saat önce</p>
            </div>
          </div>
          <p className="mb-4 text-base font-medium leading-relaxed"><span className="text-violet-400 font-black text-lg">30 gün</span> streak tamamladım! 🔥 Hedef 100 gün</p>
          <div className="flex items-center gap-5 text-sm font-bold text-gray-400">
            <button className="flex items-center gap-2 hover:text-violet-400 transition-colors">
              <span>❤️</span>
              <span>42</span>
            </button>
            <button className="flex items-center gap-2 hover:text-violet-400 transition-colors">
              <span>💬</span>
              <span>12</span>
            </button>
          </div>
        </div>

        {/* Post 3 */}
        <div className="bg-[#1C1F26] rounded-xl p-5 border border-white/5 hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30">
              Z
            </div>
            <div>
              <h4 className="font-bold text-base">Zeynep Kara</h4>
              <p className="text-xs text-gray-500 font-semibold">1 gün önce</p>
            </div>
          </div>
          <p className="mb-4 text-base font-medium leading-relaxed">Deadlift <span className="text-blue-400 font-black text-lg">120kg</span> 💪 Kadınlar da kaldırır!</p>
          <div className="flex items-center gap-5 text-sm font-bold text-gray-400">
            <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <span>❤️</span>
              <span>67</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <span>💬</span>
              <span>15</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Kupalar Tab Component
function TrophiesTab() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2 tracking-tight">Kupalarım</h2>
        <p className="text-gray-500 text-sm font-semibold">Başarılarını topla, ilerle</p>
      </div>

      {/* Trophy Stats */}
      <div className="bg-[#1C1F26] rounded-xl p-8 border border-blue-500/30 mb-6 shadow-lg shadow-blue-500/20">
        <div className="text-center">
          <div className="text-6xl mb-3">🏆</div>
          <div className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">8 / 20</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kupa Kazandın</div>
        </div>
      </div>

      {/* Unlocked Trophies */}
      <div className="mb-8">
        <h3 className="text-xl font-black mb-4 tracking-tight">Kazanılan Kupalar</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1C1F26] rounded-xl p-5 border border-white/5 text-center hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
            <div className="text-4xl mb-3">🥇</div>
            <div className="font-bold text-base mb-1">İlk Antrenman</div>
            <div className="text-xs font-semibold text-gray-500">Başlangıç yap</div>
          </div>
          
          <div className="bg-[#1C1F26] rounded-xl p-5 border border-white/5 text-center hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 transition-all">
            <div className="text-4xl mb-3">💪</div>
            <div className="font-bold text-base mb-1">100kg Club</div>
            <div className="text-xs font-semibold text-gray-500">Bench Press</div>
          </div>
          
          <div className="bg-[#1C1F26] rounded-xl p-5 border border-white/5 text-center hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
            <div className="text-4xl mb-3">🔥</div>
            <div className="font-bold text-base mb-1">30 Gün Streak</div>
            <div className="text-xs font-semibold text-gray-500">Kararlılık</div>
          </div>
          
          <div className="bg-[#1C1F26] rounded-xl p-5 border border-white/5 text-center hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 transition-all">
            <div className="text-4xl mb-3">📊</div>
            <div className="font-bold text-base mb-1">İlk PR</div>
            <div className="text-xs font-semibold text-gray-500">Rekor kır</div>
          </div>
        </div>
      </div>

      {/* Locked Trophies */}
      <div>
        <h3 className="text-xl font-black mb-4 tracking-tight">Kilit Kupalar</h3>
        <div className="space-y-3">
          <div className="bg-[#1C1F26]/40 rounded-xl p-4 border border-white/5 flex items-center gap-4 opacity-50">
            <div className="text-3xl">🔒</div>
            <div className="flex-1">
              <div className="font-bold text-base mb-1">60 Gün Streak</div>
              <div className="text-xs font-semibold text-gray-600">30 gün daha antrenman yap</div>
            </div>
          </div>

          <div className="bg-[#1C1F26]/40 rounded-xl p-4 border border-white/5 flex items-center gap-4 opacity-50">
            <div className="text-3xl">🔒</div>
            <div className="flex-1">
              <div className="font-bold text-base mb-1">200kg Deadlift</div>
              <div className="text-xs font-semibold text-gray-600">120kg'dan 200kg'a çık</div>
            </div>
          </div>

          <div className="bg-[#1C1F26]/40 rounded-xl p-4 border border-white/5 flex items-center gap-4 opacity-50">
            <div className="text-3xl">🔒</div>
            <div className="flex-1">
              <div className="font-bold text-base mb-1">Topluluk Yıldızı</div>
              <div className="text-xs font-semibold text-gray-600">100 beğeni topla</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

