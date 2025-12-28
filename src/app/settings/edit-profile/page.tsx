'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      <header className="fixed top-0 left-0 right-0 bg-[#0F1115]/80 backdrop-blur-xl border-b border-white/5 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Profili Düzenle</h1>
            <button className="text-blue-400 font-bold">Kaydet</button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-24 px-4 container mx-auto max-w-2xl">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold mb-2">Yakında Gelecek!</h2>
          <p className="text-gray-400 mb-6">Profil düzenleme özelliği çok yakında eklenecek.</p>
          <button 
            onClick={() => router.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </main>
    </div>
  );
}

