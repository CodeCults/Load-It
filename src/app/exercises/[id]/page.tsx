'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Exercise } from '@/types/database.types';

export default function ExerciseDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && params.id) {
      fetchExercise();
    }
  }, [user, params.id]);

  const fetchExercise = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setExercise(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1115] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-[#0F1115] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold">Egzersiz bulunamadı</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-white pb-24">
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
            <h1 className="text-xl font-bold">Egzersiz Detayı</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </header>

      <main className="pt-20 px-4 container mx-auto max-w-2xl">
        <div className="bg-[#1C1F26] rounded-xl p-6 border border-white/5 mb-6">
          <h2 className="text-3xl font-black mb-2">{exercise.name}</h2>
          <p className="text-gray-400 mb-4 capitalize">{exercise.category}</p>
          
          {exercise.description && (
            <p className="text-gray-300 mb-4">{exercise.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {exercise.muscle_groups.map((muscle) => (
              <span
                key={muscle}
                className="text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-semibold"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => alert('Antrenman başlatma özelliği yakında gelecek!')}
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl transition-all mb-6"
        >
          Bu Egzersizle Antrenman Başlat
        </button>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">Geçmiş Performans</h3>
          <p className="text-gray-400 mb-6">Bu özellik yakında eklenecek!</p>
          <p className="text-sm text-gray-500">Set/rep/ağırlık geçmişini burada görebileceksin</p>
        </div>
      </main>
    </div>
  );
}

