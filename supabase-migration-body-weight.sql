-- Add body_weight column to workout_sessions table
-- This allows users to track their body weight for each workout session

ALTER TABLE workout_sessions
ADD COLUMN body_weight DECIMAL(5, 2);

COMMENT ON COLUMN workout_sessions.body_weight IS 'User body weight in kg at the time of workout';

