-- Temel Egzersiz Kütüphanesi
-- Supabase SQL Editor'da çalıştır

-- Önce mevcut default egzersizleri temizle (birden fazla çalıştırılırsa duplicate olmasın)
DELETE FROM exercises WHERE is_default = true;

-- GÖĞÜS (CHEST)
INSERT INTO exercises (name, category, description, muscle_groups, is_default) VALUES
('Bench Press', 'chest', 'Klasik göğüs egzersizi, barbell ile yatay bench press', ARRAY['chest', 'triceps', 'shoulders'], true),
('Incline Bench Press', 'chest', 'Üst göğüs için eğimli bench press', ARRAY['chest', 'triceps', 'shoulders'], true),
('Dumbbell Chest Press', 'chest', 'Dumbbell ile göğüs press', ARRAY['chest', 'triceps', 'shoulders'], true),
('Chest Fly', 'chest', 'Göğüs açma hareketi', ARRAY['chest'], true),
('Push-ups', 'chest', 'Klasik şınav hareketi', ARRAY['chest', 'triceps', 'core'], true),
('Cable Crossover', 'chest', 'Kabloda göğüs çaprazlama', ARRAY['chest'], true);

-- SIRT (BACK)
INSERT INTO exercises (name, category, description, muscle_groups, is_default) VALUES
('Deadlift', 'back', 'Tüm vücut için compound egzersiz', ARRAY['back', 'legs', 'core'], true),
('Barbell Row', 'back', 'Barbell ile sırt kürek hareketi', ARRAY['back', 'biceps'], true),
('Pull-ups', 'back', 'Klasik barfiks hareketi', ARRAY['back', 'biceps'], true),
('Lat Pulldown', 'back', 'Lat çekişi, arkadan geniş tutuş', ARRAY['back', 'biceps'], true),
('T-Bar Row', 'back', 'T-bar ile sırt küreği', ARRAY['back', 'biceps'], true),
('Seated Cable Row', 'back', 'Oturarak kabloda kürek', ARRAY['back', 'biceps'], true);

-- BACAK (LEGS)
INSERT INTO exercises (name, category, description, muscle_groups, is_default) VALUES
('Squat', 'legs', 'Klasik barbell squat, bacak antrenmanının kralı', ARRAY['quads', 'glutes', 'hamstrings'], true),
('Front Squat', 'legs', 'Ön squat, quadriceps odaklı', ARRAY['quads', 'core'], true),
('Leg Press', 'legs', 'Makine ile bacak press', ARRAY['quads', 'glutes', 'hamstrings'], true),
('Romanian Deadlift', 'legs', 'Arka bacak ve kalça için', ARRAY['hamstrings', 'glutes', 'back'], true),
('Leg Extension', 'legs', 'Quadriceps izolasyonu', ARRAY['quads'], true),
('Leg Curl', 'legs', 'Hamstring izolasyonu', ARRAY['hamstrings'], true),
('Bulgarian Split Squat', 'legs', 'Tek bacak squat varyasyonu', ARRAY['quads', 'glutes'], true),
('Calf Raise', 'legs', 'Baldır çalışması', ARRAY['calves'], true);

-- OMUZ (SHOULDERS)
INSERT INTO exercises (name, category, description, muscle_groups, is_default) VALUES
('Overhead Press', 'shoulders', 'Barbell ile omuz press', ARRAY['shoulders', 'triceps'], true),
('Dumbbell Shoulder Press', 'shoulders', 'Dumbbell ile omuz press', ARRAY['shoulders', 'triceps'], true),
('Lateral Raise', 'shoulders', 'Yan omuz açma', ARRAY['shoulders'], true),
('Front Raise', 'shoulders', 'Ön omuz kaldırma', ARRAY['shoulders'], true),
('Face Pull', 'shoulders', 'Kabloda yüze çekiş, arka omuz', ARRAY['shoulders', 'back'], true),
('Arnold Press', 'shoulders', 'Arnold Schwarzenegger''in press hareketi', ARRAY['shoulders', 'triceps'], true);

-- KOL (ARMS)
INSERT INTO exercises (name, category, description, muscle_groups, is_default) VALUES
('Barbell Curl', 'arms', 'Barbell ile biceps curl', ARRAY['biceps'], true),
('Dumbbell Curl', 'arms', 'Dumbbell ile biceps curl', ARRAY['biceps'], true),
('Hammer Curl', 'arms', 'Çekiç tutuşu ile curl', ARRAY['biceps', 'forearms'], true),
('Triceps Dip', 'arms', 'Parallel bar dips, triceps için', ARRAY['triceps', 'chest'], true),
('Triceps Pushdown', 'arms', 'Kabloda triceps itişi', ARRAY['triceps'], true),
('Skull Crusher', 'arms', 'Yatarak triceps extension', ARRAY['triceps'], true),
('Close-Grip Bench Press', 'arms', 'Dar tutuşlu bench press, triceps odaklı', ARRAY['triceps', 'chest'], true);

-- KARDIYO VE CORE
INSERT INTO exercises (name, category, description, muscle_groups, is_default) VALUES
('Plank', 'core', 'Klasik plank hareketi', ARRAY['core'], true),
('Russian Twist', 'core', 'Oblique çalışması', ARRAY['core', 'obliques'], true),
('Hanging Leg Raise', 'core', 'Bardan asılı bacak kaldırma', ARRAY['core'], true),
('Ab Wheel Rollout', 'core', 'Ab wheel ile karın çalışması', ARRAY['core'], true),
('Cable Crunch', 'core', 'Kabloda karın çalışması', ARRAY['core'], true);

