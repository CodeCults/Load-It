'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface WorkoutExercise {
  exercise_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
}

interface SetLog {
  set_number: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface ExerciseProgress {
  exercise: WorkoutExercise;
  sets: SetLog[];
  currentSet: number;
}

export default function ActiveWorkoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.id as string;

  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime] = useState(new Date());
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [bodyWeight, setBodyWeight] = useState<number>(0);

  useEffect(() => {
    const exercisesParam = searchParams.get('exercises');
    if (exercisesParam) {
      const workoutExercises: WorkoutExercise[] = JSON.parse(decodeURIComponent(exercisesParam));
      
      const progress: ExerciseProgress[] = workoutExercises.map((exercise) => ({
        exercise,
        sets: Array.from({ length: exercise.sets }, (_, i) => ({
          set_number: i + 1,
          reps: exercise.reps,
          weight: 0,
          completed: false,
        })),
        currentSet: 0,
      }));

      setExercises(progress);
    }

    // Fetch body weight from session
    fetchBodyWeight();
  }, [searchParams]);

  const fetchBodyWeight = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('body_weight')
        .eq('id', sessionId)
        .single();

      if (!error && data) {
        setBodyWeight(data.body_weight || 0);
      }
    } catch (error) {
      console.error('Error fetching body weight:', error);
    }
  };

  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      const timer = setTimeout(() => setRestTimeLeft(restTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isResting && restTimeLeft === 0) {
      setIsResting(false);
    }
  }, [isResting, restTimeLeft]);

  const currentExercise = exercises[currentExerciseIndex];

  const updateSet = (setIndex: number, field: 'reps' | 'weight', value: number) => {
    const updated = [...exercises];
    updated[currentExerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const completeSet = (setIndex: number) => {
    const updated = [...exercises];
    const currentSet = updated[currentExerciseIndex].sets[setIndex];
    
    if (currentSet.weight === 0) {
      alert('Ağırlık gir!');
      return;
    }

    currentSet.completed = true;
    updated[currentExerciseIndex].currentSet = setIndex + 1;
    setExercises(updated);

    // Start rest timer
    const restSeconds = currentExercise.exercise.rest_seconds;
    if (restSeconds > 0 && setIndex < currentExercise.sets.length - 1) {
      setRestTimeLeft(restSeconds);
      setIsResting(true);
    }
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setIsResting(false);
      setRestTimeLeft(0);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setIsResting(false);
      setRestTimeLeft(0);
    }
  };

  const finishWorkout = async () => {
    const completedSets = exercises.flatMap(ex => ex.sets.filter(s => s.completed));
    
    if (completedSets.length === 0) {
      if (!confirm('Hiç set tamamlamadın. Antrenmandan çıkmak istediğine emin misin?')) {
        return;
      }
    }

    try {
      const endTime = new Date();
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

      // Update session
      const { error: sessionError } = await supabase
        .from('workout_sessions')
        .update({
          ended_at: endTime.toISOString(),
          duration_minutes: durationMinutes,
        })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      // Save all completed sets
      for (const exerciseProgress of exercises) {
        for (const set of exerciseProgress.sets) {
          if (set.completed) {
            await supabase.from('set_logs').insert({
              workout_session_id: sessionId,
              exercise_id: exerciseProgress.exercise.exercise_id,
              set_number: set.set_number,
              reps: set.reps,
              weight: set.weight,
              rest_seconds: exerciseProgress.exercise.rest_seconds,
            });
          }
        }
      }

      alert(`🎉 Antrenman tamamlandı!\n\n⏱️ Süre: ${durationMinutes} dakika\n💪 ${completedSets.length} set tamamlandı`);
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Antrenman kaydedilirken hata oluştu!');
    }
  };

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-[#0F1115] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
  const progress = (completedSets / totalSets) * 100;

  return (
    <div className="min-h-screen bg-[#0F1115] text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0F1115]/80 backdrop-blur-xl border-b border-white/5 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => {
                if (confirm('Antrenmandan çıkmak istediğine emin misin?')) {
                  router.push('/');
                }
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center">
              <div className="text-sm text-gray-400">Egzersiz {currentExerciseIndex + 1}/{exercises.length}</div>
              <div className="font-bold">{completedSets}/{totalSets} Set</div>
              {bodyWeight > 0 && (
                <div className="text-xs text-blue-400 font-semibold mt-1">⚖️ {bodyWeight}kg</div>
              )}
            </div>
            <button
              onClick={finishWorkout}
              className="text-blue-400 hover:text-blue-300 font-bold text-sm"
            >
              Bitir
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-violet-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      <main className="pt-28 px-4 container mx-auto max-w-2xl">
        {/* Rest Timer */}
        {isResting && (
          <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 rounded-xl p-6 mb-6 text-center">
            <div className="text-6xl font-black mb-2">{restTimeLeft}</div>
            <div className="text-gray-400 font-semibold">Dinlenme Süresi</div>
            <button
              onClick={() => setIsResting(false)}
              className="mt-4 text-blue-400 hover:text-blue-300 font-bold text-sm"
            >
              Atla
            </button>
          </div>
        )}

        {/* Exercise Info */}
        <div className="bg-[#1C1F26] rounded-xl p-6 border border-white/5 mb-6">
          <h2 className="text-3xl font-black mb-4">{currentExercise.exercise.exercise_name}</h2>
          <div className="flex gap-4 text-sm">
            <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg font-bold">
              {currentExercise.exercise.sets} Set
            </div>
            <div className="bg-violet-500/10 text-violet-400 px-4 py-2 rounded-lg font-bold">
              {currentExercise.exercise.reps} Rep
            </div>
            <div className="bg-gray-500/10 text-gray-400 px-4 py-2 rounded-lg font-bold">
              {currentExercise.exercise.rest_seconds}sn
            </div>
          </div>
        </div>

        {/* Sets */}
        <div className="space-y-3 mb-6">
          {currentExercise.sets.map((set, index) => (
            <div
              key={index}
              className={`bg-[#1C1F26] rounded-xl p-4 border transition-all ${
                set.completed
                  ? 'border-green-500/50 bg-green-500/5'
                  : 'border-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-black">
                  {index + 1}
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Rep</label>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
                      disabled={set.completed}
                      className="w-full bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-center font-bold disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Ağırlık (kg)</label>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                      disabled={set.completed}
                      step="2.5"
                      className="w-full bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-center font-bold disabled:opacity-50"
                    />
                  </div>
                </div>

                {set.completed ? (
                  <div className="text-green-400">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <button
                    onClick={() => completeSet(index)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                  >
                    ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={prevExercise}
            disabled={currentExerciseIndex === 0}
            className="flex-1 bg-[#1C1F26] hover:bg-[#252830] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all border border-white/5"
          >
            ← Önceki
          </button>
          <button
            onClick={nextExercise}
            disabled={currentExerciseIndex === exercises.length - 1}
            className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all"
          >
            Sonraki →
          </button>
        </div>
      </main>
    </div>
  );
}

