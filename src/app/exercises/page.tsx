'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Exercise } from '@/types/database.types';

export default function ExercisesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Tümü', emoji: '💪' },
    { id: 'chest', name: 'Göğüs', emoji: '🦾' },
    { id: 'back', name: 'Sırt', emoji: '🏋️' },
    { id: 'legs', name: 'Bacak', emoji: '🦵' },
    { id: 'shoulders', name: 'Omuz', emoji: '💪' },
    { id: 'arms', name: 'Kol', emoji: '💪' },
    { id: 'core', name: 'Karın', emoji: '🔥' },
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchExercises();
    }
  }, [user]); // Sadece ilk yüklemede çalışsın

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      if (error) throw error;
      setExercises(data || []);
    } catch (error: any) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0F1115] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Client-side filtering (instant, no delay!)
  const filteredExercises = exercises.filter((exercise) => {
    // Category filter
    const categoryMatch = selectedCategory === 'all' || exercise.category === selectedCategory;
    
    // Search filter
    const searchMatch = searchQuery === '' || 
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-[#0F1115] text-white pb-24">
      {/* Header */}
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
            <h1 className="text-xl font-bold">Egzersizler</h1>
            <button 
              onClick={() => alert('Egzersiz ekleme özelliği yakında gelecek!')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 container mx-auto max-w-4xl">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Egzersiz ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1C1F26] border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <svg className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#1C1F26] text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {filteredExercises.length} egzersiz bulundu
          </span>
          <span className="text-gray-500">
            {selectedCategory !== 'all' && categories.find(c => c.id === selectedCategory)?.name}
          </span>
        </div>

        {/* Exercises List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Egzersiz Bulunamadı</h3>
            <p className="text-gray-400">Farklı bir arama deneyin</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => router.push(`/exercises/${exercise.id}`)}
                className="bg-[#1C1F26] rounded-xl p-4 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{exercise.name}</h3>
                    {exercise.description && (
                      <p className="text-sm text-gray-400 mb-2">{exercise.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscle_groups.map((muscle) => (
                        <span
                          key={muscle}
                          className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full font-semibold"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

