'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type Tab = 'workout' | 'discover' | 'trophies';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('workout');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1115] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0F1115]/80 backdrop-blur-xl border-b border-white/5 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
              Load It
            </h1>
            <a 
              href="/settings"
              className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-base font-bold text-white shadow-lg shadow-blue-500/50 hover:from-blue-600 hover:to-violet-700 transition-all"
              title="Ayarlar"
            >
              {user?.user_metadata?.username?.charAt(0)?.toUpperCase() || 'U'}
            </a>
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
      <a 
        href="/workout/create"
        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-black py-5 rounded-xl mb-6 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-lg tracking-wide">ANTRENMAN BAŞLAT</span>
        </div>
      </a>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <a
          href="/exercises"
          className="bg-[#1C1F26] rounded-xl p-4 border border-white/5 hover:border-blue-500/30 transition-all text-center"
        >
          <div className="text-3xl mb-2">💪</div>
          <div className="font-bold text-sm">Egzersizler</div>
          <div className="text-xs text-gray-500">Kütüphane</div>
        </a>
        <button 
          onClick={() => alert('Program oluşturma özelliği yakında gelecek!')}
          className="bg-[#1C1F26] rounded-xl p-4 border border-white/5 hover:border-blue-500/30 transition-all text-center"
        >
          <div className="text-3xl mb-2">📋</div>
          <div className="font-bold text-sm">Programlar</div>
          <div className="text-xs text-gray-500">Planla</div>
        </button>
      </div>

      {/* Recent Workouts */}
      <div className="space-y-3">
        <h3 className="text-xl font-black mb-4 tracking-tight">Son Antrenmanlar</h3>
        
        <button 
          onClick={() => alert('Antrenman detayı yakında eklenecek!')}
          className="w-full bg-[#1C1F26] rounded-xl p-5 border border-white/5 hover:border-blue-500/30 transition-all text-left"
        >
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
        </button>

        <button 
          onClick={() => alert('Antrenman detayı yakında eklenecek!')}
          className="w-full bg-[#1C1F26] rounded-xl p-5 border border-white/5 hover:border-blue-500/30 transition-all text-left"
        >
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
        </button>
      </div>
    </div>
  );
}

// Keşfet Tab Component
function DiscoverTab() {
  const [feedTab, setFeedTab] = useState<'for-you' | 'following'>('for-you');
  const [postText, setPostText] = useState('');

  const handlePost = () => {
    if (postText.trim()) {
      alert('Post özelliği yakında eklenecek!\n\nYazın: ' + postText);
      setPostText('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Twitter-style Tabs */}
      <div className="flex border-b border-white/5 mb-1">
        <button 
          onClick={() => setFeedTab('for-you')}
          className={`flex-1 py-4 font-bold transition-colors ${
            feedTab === 'for-you'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Sizin İçin
        </button>
        <button 
          onClick={() => setFeedTab('following')}
          className={`flex-1 py-4 font-bold transition-colors ${
            feedTab === 'following'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Takip Edilenler
        </button>
      </div>

      {/* Post Creation Area */}
      <div className="border-b border-white/5 p-4">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
            E
          </div>
          <div className="flex-1">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Paylaşım Yap..."
              className="w-full bg-transparent text-white placeholder-gray-600 text-lg font-medium outline-none resize-none"
              rows={2}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => alert('Resim ekleme yakında gelecek!')}
                  className="text-blue-400 hover:bg-blue-500/10 p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <button 
                onClick={handlePost}
                disabled={!postText.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/30 disabled:cursor-not-allowed text-white font-bold px-5 py-2 rounded-full transition-colors text-sm"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div>
        {/* Post 1 */}
        <div className="border-b border-white/5 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white">Ahmet Yılmaz</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">PRO</span>
                <span className="text-gray-500 text-sm">· 2 saat önce</span>
              </div>
              <p className="text-white mb-3 leading-relaxed">
                Yeni Bench Press PR! 🎉 <span className="text-blue-400 font-black">100kg</span> x 5 rep
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Yorum özelliği yakında gelecek!'); }}
                  className="flex items-center gap-2 hover:text-blue-400 group transition-colors"
                >
                  <div className="group-hover:bg-blue-500/10 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">11</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Like özelliği yakında gelecek!'); }}
                  className="flex items-center gap-2 hover:text-red-400 group transition-colors"
                >
                  <div className="group-hover:bg-red-500/10 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">24</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Paylaş özelliği yakında gelecek!'); }}
                  className="hover:text-blue-400 group transition-colors ml-auto"
                >
                  <div className="group-hover:bg-blue-500/10 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post 2 */}
        <div className="border-b border-white/5 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-violet-500/30 flex-shrink-0">
              M
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white">Mehmet Demir</span>
                <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded font-bold">PRO</span>
                <span className="text-gray-500 text-sm">· 5 saat önce</span>
              </div>
              <p className="text-white mb-3 leading-relaxed">
                <span className="text-violet-400 font-black">30 gün</span> streak tamamladım! 🔥 Hedef 100 gün
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Yorum özelliği yakında gelecek!'); }}
                  className="flex items-center gap-2 hover:text-blue-400 group transition-colors"
                >
                  <div className="group-hover:bg-blue-500/10 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">18</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Like özelliği yakında gelecek!'); }}
                  className="flex items-center gap-2 hover:text-red-400 group transition-colors"
                >
                  <div className="group-hover:bg-red-500/10 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">47</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Paylaş özelliği yakında gelecek!'); }}
                  className="hover:text-blue-400 group transition-colors ml-auto"
                >
                  <div className="group-hover:bg-blue-500/10 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post 3 */}
        <div className="border-b border-white/5 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
              Z
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white">Zeynep Kara</span>
                <span className="text-gray-500 text-sm">· 1 gün önce</span>
              </div>
              <p className="text-white mb-3 leading-relaxed">
                Deadlift <span className="text-blue-400 font-black">120kg</span> 💪 Kadınlar da kaldırır!
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Yorum özelliği yakında gelecek!'); }}
                  className="flex items-center gap-2 hover:text-blue-400 group transition-colors"
                >
                  <div className="group-hover:bg-blue-500/10 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">15</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Like özelliği yakında gelecek!'); }}
                  className="flex items-center gap-2 hover:text-red-400 group transition-colors"
                >
                  <div className="group-hover:bg-red-500/10 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">67</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Paylaş özelliği yakında gelecek!'); }}
                  className="hover:text-blue-400 group transition-colors ml-auto"
                >
                  <div className="group-hover:bg-blue-500/10 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
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

