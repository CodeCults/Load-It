# 🗄️ Load It - Database Schema

## 📊 Tablolar ve İlişkiler

### 1. **users** (Kullanıcılar)
```sql
- id: UUID (PK)
- email: STRING (unique)
- username: STRING (unique)
- full_name: STRING
- avatar_url: STRING
- bio: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 2. **exercises** (Egzersiz Kütüphanesi)
```sql
- id: UUID (PK)
- name: STRING (Bench Press, Squat, Deadlift...)
- category: ENUM (chest, back, legs, shoulders, arms, core)
- description: TEXT
- muscle_groups: ARRAY<STRING>
- is_default: BOOLEAN (sistem tarafından tanımlı mı?)
- created_by: UUID (FK -> users.id) (NULL ise sistem egzersizi)
- created_at: TIMESTAMP
```

### 3. **workout_programs** (Antrenman Programları)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- name: STRING (Push Day, Pull Day...)
- description: TEXT
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 4. **workout_sessions** (Antrenman Seansları)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- program_id: UUID (FK -> workout_programs.id) (NULL olabilir)
- name: STRING
- started_at: TIMESTAMP
- completed_at: TIMESTAMP (NULL = devam ediyor)
- duration_minutes: INTEGER
- notes: TEXT
- created_at: TIMESTAMP
```

### 5. **exercise_logs** (Egzersiz Kayıtları)
```sql
- id: UUID (PK)
- session_id: UUID (FK -> workout_sessions.id)
- exercise_id: UUID (FK -> exercises.id)
- order_index: INTEGER (egzersiz sırası)
- created_at: TIMESTAMP
```

### 6. **set_logs** (Set Kayıtları - ağırlık takibi)
```sql
- id: UUID (PK)
- exercise_log_id: UUID (FK -> exercise_logs.id)
- set_number: INTEGER (1, 2, 3...)
- weight_kg: DECIMAL
- reps: INTEGER
- is_warmup: BOOLEAN
- is_completed: BOOLEAN
- rpe: INTEGER (1-10, isteğe bağlı Rate of Perceived Exertion)
- notes: TEXT
- created_at: TIMESTAMP
```

### 7. **personal_records** (PR Takibi)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- exercise_id: UUID (FK -> exercises.id)
- record_type: ENUM (1RM, 3RM, 5RM, volume, max_reps)
- weight_kg: DECIMAL
- reps: INTEGER
- achieved_at: TIMESTAMP
- session_id: UUID (FK -> workout_sessions.id)
- set_log_id: UUID (FK -> set_logs.id)
- created_at: TIMESTAMP
```

### 8. **achievements** (Kupa/Başarı Tanımları)
```sql
- id: UUID (PK)
- name: STRING (100kg Club, 30 Day Streak...)
- description: TEXT
- icon: STRING (emoji veya icon kodu)
- category: ENUM (weight_milestone, streak, pr_count, social)
- criteria_json: JSONB (başarı koşulları)
- created_at: TIMESTAMP
```

### 9. **user_achievements** (Kullanıcı Başarıları)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- achievement_id: UUID (FK -> achievements.id)
- unlocked_at: TIMESTAMP
- created_at: TIMESTAMP
UNIQUE(user_id, achievement_id)
```

### 10. **posts** (Sosyal Paylaşımlar - Keşfet)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- content: TEXT
- session_id: UUID (FK -> workout_sessions.id) (NULL olabilir)
- pr_id: UUID (FK -> personal_records.id) (NULL olabilir)
- image_url: STRING (NULL olabilir)
- visibility: ENUM (public, followers, private)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 11. **post_likes** (Beğeniler)
```sql
- id: UUID (PK)
- post_id: UUID (FK -> posts.id)
- user_id: UUID (FK -> users.id)
- created_at: TIMESTAMP
UNIQUE(post_id, user_id)
```

### 12. **post_comments** (Yorumlar)
```sql
- id: UUID (PK)
- post_id: UUID (FK -> posts.id)
- user_id: UUID (FK -> users.id)
- content: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 13. **follows** (Takip İlişkileri)
```sql
- id: UUID (PK)
- follower_id: UUID (FK -> users.id)
- following_id: UUID (FK -> users.id)
- created_at: TIMESTAMP
UNIQUE(follower_id, following_id)
```

---

## 🔗 İlişkiler Özeti

```
users (1) -----> (N) workout_programs
users (1) -----> (N) workout_sessions
users (1) -----> (N) personal_records
users (1) -----> (N) posts
users (1) -----> (N) user_achievements

workout_sessions (1) -----> (N) exercise_logs
exercise_logs (1) -----> (N) set_logs

exercises (1) -----> (N) exercise_logs
exercises (1) -----> (N) personal_records

posts (1) -----> (N) post_likes
posts (1) -----> (N) post_comments

achievements (1) -----> (N) user_achievements
```

---

## 📈 Progressive Overload Mantığı

**set_logs** tablosundan son antrenmanlar çekilerek:
1. Aynı egzersizin önceki seanslarındaki ağırlıklar karşılaştırılır
2. Kullanıcıya öneri: "Geçen hafta 80kg kaldırdın, bu hafta 82.5kg dene!"
3. PR tespit edilirse otomatik **personal_records** tablosuna kaydedilir

---

## 🏆 Achievement Criteria Örnekleri

```json
{
  "type": "weight_milestone",
  "exercise": "bench_press",
  "weight_kg": 100
}

{
  "type": "streak",
  "days": 30
}

{
  "type": "pr_count",
  "count": 10
}
```

