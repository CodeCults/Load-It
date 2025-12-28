'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Exercise } from '@/types/database.types';

interface WorkoutExercise {
  exercise_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  last_weight?: number;
  suggested_weight?: number;
}

export default function CreateWorkoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchExercises();
    }
  }, [user]);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addExercise = async (exercise: Exercise) => {
    // Fetch last workout data for this exercise
    try {
      const { data: lastSet, error } = await supabase
        .from('set_logs')
        .select(`
          weight_kg,
          reps,
          exercise_logs!inner(
            exercise_id,
            session_id,
            workout_sessions!inner(
              user_id
            )
          )
        `)
        .eq('exercise_logs.exercise_id', exercise.id)
        .eq('exercise_logs.workout_sessions.user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let lastWeight = 0;
      let suggestedWeight = 0;

      if (!error && lastSet) {
        lastWeight = lastSet.weight_kg;
        // Progressive overload: +2.5kg suggestion
        suggestedWeight = lastWeight + 2.5;
      }

      setWorkoutExercises([
        ...workoutExercises,
        {
          exercise_id: exercise.id,
          exercise_name: exercise.name,
          sets: 3,
          reps: lastSet?.reps || 10,
          rest_seconds: 90,
          last_weight: lastWeight,
          suggested_weight: suggestedWeight,
        },
      ]);
      setShowExercisePicker(false);
      setSearchQuery('');
    } catch (err) {
      console.error('Error fetching last workout:', err);
      // Fallback if error
      setWorkoutExercises([
        ...workoutExercises,
        {
          exercise_id: exercise.id,
          exercise_name: exercise.name,
          sets: 3,
          reps: 10,
          rest_seconds: 90,
        },
      ]);
      setShowExercisePicker(false);
      setSearchQuery('');
    }
  };

  const removeExercise = (index: number) => {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: string | number) => {
    const updated = [...workoutExercises];
    updated[index] = { ...updated[index], [field]: value };
    setWorkoutExercises(updated);
  };

  const startWorkout = async () => {
    if (workoutExercises.length === 0) {
      alert('En az 1 egzersiz eklemelisin!');
      return;
    }

    try {
      // Create workout session
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user?.id,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Navigate to active workout page with exercises data
      const exercisesData = encodeURIComponent(JSON.stringify(workoutExercises));
      router.push(`/workout/active/${session.id}?exercises=${exercisesData}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Antrenman başlatılırken hata oluştu!');
    }
  };

  const categories = ['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'];
  const categoryNames: Record<string, string> = {
    all: 'Tümü',
    chest: 'Göğüs',
    back: 'Sırt',
    legs: 'Bacak',
    shoulders: 'Omuz',
    arms: 'Kol',
    core: 'Karın',
    cardio: 'Kardio',
  };

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
            <h1 className="text-xl font-bold">Antrenman Oluştur</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </header>

      <main className="pt-20 px-4 container mx-auto max-w-2xl">
        {/* Workout Exercises List */}
        <div className="mb-6">
          <h2 className="text-2xl font-black mb-4">Egzersizler</h2>
          
          {workoutExercises.length === 0 ? (
            <div className="bg-[#1C1F26] rounded-xl p-8 border border-white/5 text-center">
              <div className="text-5xl mb-3">💪</div>
              <p className="text-gray-400 mb-4">Henüz egzersiz eklemedin</p>
              <button
                onClick={() => setShowExercisePicker(true)}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                İlk Egzersizi Ekle
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {workoutExercises.map((exercise, index) => (
                <div key={index} className="bg-[#1C1F26] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{exercise.exercise_name}</h3>
                      {exercise.last_weight && exercise.last_weight > 0 && (
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-gray-400">
                            Geçen: <span className="font-bold text-blue-400">{exercise.last_weight}kg</span>
                          </span>
                          {exercise.suggested_weight && (
                            <>
                              <span className="text-gray-600">→</span>
                              <span className="text-gray-400">
                                Öner: <span className="font-bold text-green-400">{exercise.suggested_weight}kg</span>
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeExercise(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Set</label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Rep</label>
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Dinlenme (sn)</label>
                      <input
                        type="number"
                        value={exercise.rest_seconds}
                        onChange={(e) => updateExercise(index, 'rest_seconds', parseInt(e.target.value) || 0)}
                        min="0"
                        step="30"
                        className="w-full bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-center font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowExercisePicker(true)}
                className="w-full bg-[#1C1F26] border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-xl p-4 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-semibold">Egzersiz Ekle</span>
              </button>
            </div>
          )}
        </div>

        {/* Start Workout Button */}
        {workoutExercises.length > 0 && (
          <button
            onClick={startWorkout}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-black py-5 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            ANTRENMANA BAŞLA ({workoutExercises.length} Egzersiz)
          </button>
        )}
      </main>

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-[#0F1115] w-full max-h-[85vh] rounded-t-3xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold">Egzersiz Seç</h3>
                <button
                  onClick={() => setShowExercisePicker(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1C1F26] border border-white/10 rounded-xl px-4 py-3 mb-3"
              />

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-500 text-white'
                        : 'bg-[#1C1F26] text-gray-400 hover:text-white'
                    }`}
                  >
                    {categoryNames[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => addExercise(exercise)}
                    className="w-full bg-[#1C1F26] rounded-xl p-4 border border-white/5 hover:border-blue-500/30 transition-all text-left"
                  >
                    <div className="font-bold text-lg mb-1">{exercise.name}</div>
                    <div className="flex gap-2">
                      {exercise.muscle_groups.slice(0, 2).map((muscle) => (
                        <span
                          key={muscle}
                          className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full font-semibold"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

