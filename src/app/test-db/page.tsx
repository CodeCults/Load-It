'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDatabase() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [exercises, setExercises] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Bağlantı testi
      const { data, error: queryError } = await supabase
        .from('exercises')
        .select('*')
        .limit(5);

      if (queryError) throw queryError;

      setExercises(data || []);
      setConnectionStatus('success');
    } catch (err: any) {
      console.error('Database error:', err);
      setError(err.message);
      setConnectionStatus('error');
    }
  };

  const addTestExercise = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([
          {
            name: 'Bench Press',
            category: 'chest',
            description: 'Classic chest exercise',
            muscle_groups: ['chest', 'triceps', 'shoulders'],
            is_default: true
          }
        ])
        .select();

      if (error) throw error;
      
      alert('✅ Test egzersiz eklendi!');
      testConnection(); // Refresh
    } catch (err: any) {
      alert('❌ Hata: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8">🧪 Database Test</h1>

        {/* Connection Status */}
        <div className="bg-[#1C1F26] rounded-xl p-6 border border-white/5 mb-6">
          <h2 className="text-xl font-bold mb-4">Bağlantı Durumu</h2>
          
          {connectionStatus === 'testing' && (
            <div className="flex items-center gap-3 text-blue-400">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Test ediliyor...</span>
            </div>
          )}

          {connectionStatus === 'success' && (
            <div className="flex items-center gap-3 text-green-400">
              <span className="text-2xl">✅</span>
              <span className="font-bold">Bağlantı başarılı!</span>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="text-red-400">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">❌</span>
                <span className="font-bold">Bağlantı hatası!</span>
              </div>
              <p className="text-sm mt-2 p-3 bg-red-500/10 rounded border border-red-500/20">
                {error}
              </p>
              <p className="text-sm text-gray-400 mt-3">
                💡 <code className="text-blue-400">.env.local</code> dosyasını kontrol et!
              </p>
            </div>
          )}
        </div>

        {/* Exercises List */}
        <div className="bg-[#1C1F26] rounded-xl p-6 border border-white/5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Egzersizler ({exercises.length})</h2>
            <button
              onClick={addTestExercise}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm"
            >
              + Test Egzersiz Ekle
            </button>
          </div>

          {exercises.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Henüz egzersiz yok. Test ekle butonu ile deneyebilirsin!
            </p>
          ) : (
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-[#0F1115] rounded-lg p-4 border border-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{exercise.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{exercise.category}</p>
                    </div>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-semibold">
                      {exercise.muscle_groups?.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm">
          <p className="text-blue-400">
            <strong>ℹ️ Not:</strong> Environment variables değiştiğinde <code className="bg-black/30 px-2 py-1 rounded">npm run dev</code> komutunu yeniden başlat!
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <a
            href="/"
            className="inline-block text-gray-400 hover:text-white transition-colors"
          >
            ← Ana sayfaya dön
          </a>
        </div>
      </div>
    </div>
  );
}

