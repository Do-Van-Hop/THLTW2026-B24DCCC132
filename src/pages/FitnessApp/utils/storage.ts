export const STORAGE_KEYS = {
  WORKOUTS: 'fitness_workouts',
  HEALTH: 'fitness_health',
  GOALS: 'fitness_goals',
  EXERCISES: 'fitness_exercises',
};

export const getData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const setData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const seedInitialData = () => {
  const workouts = getData(STORAGE_KEYS.WORKOUTS);
  if (workouts.length === 0) {
    const demoWorkouts = [
      { id: '1', date: new Date(2026, 3, 20).toISOString(), exerciseName: 'Chạy bộ', type: 'Cardio', duration: 30, calories: 250, note: 'Sáng sớm', status: 'done' },
      { id: '2', date: new Date(2026, 3, 22).toISOString(), exerciseName: 'Gym ngực', type: 'Strength', duration: 45, calories: 180, note: 'Tạ đẩy', status: 'done' },
      { id: '3', date: new Date(2026, 3, 23).toISOString(), exerciseName: 'Yoga thư giãn', type: 'Yoga', duration: 40, calories: 120, note: '', status: 'missed' },
      { id: '4', date: new Date(2026, 3, 25).toISOString(), exerciseName: 'HIIT đốt mỡ', type: 'HIIT', duration: 20, calories: 300, note: 'Cường độ cao', status: 'done' },
      { id: '5', date: new Date(2026, 3, 27).toISOString(), exerciseName: 'Đạp xe', type: 'Cardio', duration: 60, calories: 400, note: 'Công viên', status: 'done' },
    ];
    setData(STORAGE_KEYS.WORKOUTS, demoWorkouts);
  }

  const health = getData(STORAGE_KEYS.HEALTH);
  if (health.length === 0) {
    const demoHealth = [
      { id: '1', date: new Date(2026, 3, 20).toISOString(), weight: 68, height: 170, heartRate: 72, sleep: 7.5, bmi: 23.5 },
      { id: '2', date: new Date(2026, 3, 23).toISOString(), weight: 67.5, height: 170, heartRate: 70, sleep: 8, bmi: 23.4 },
      { id: '3', date: new Date(2026, 3, 27).toISOString(), weight: 67, height: 170, heartRate: 68, sleep: 7, bmi: 23.2 },
    ];
    setData(STORAGE_KEYS.HEALTH, demoHealth);
  }

  const goals = getData(STORAGE_KEYS.GOALS);
  if (goals.length === 0) {
    const demoGoals = [
      { id: '1', name: 'Giảm 5kg', type: 'Giảm cân', target: 5, current: 2.2, deadline: new Date(2026, 6, 15).toISOString(), status: 'active' },
      { id: '2', name: 'Tập Gym đều đặn', type: 'Tăng cơ', target: 20, current: 12, deadline: new Date(2026, 5, 1).toISOString(), status: 'active' },
    ];
    setData(STORAGE_KEYS.GOALS, demoGoals);
  }

  const exercises = getData(STORAGE_KEYS.EXERCISES);
  if (exercises.length === 0) {
    const demoExercises = [
      { id: '1', name: 'Hít đất', muscle: 'Chest', level: 'easy', description: 'Chống đẩy cơ bản', calories: 400 },
      { id: '2', name: 'Gánh tạ', muscle: 'Legs', level: 'hard', description: 'Squat với tạ', calories: 600 },
      { id: '3', name: 'Plank', muscle: 'Core', level: 'medium', description: 'Giữ thẳng lưng', calories: 300 },
      { id: '4', name: 'Kéo xà', muscle: 'Back', level: 'hard', description: 'Tay rộng bằng vai', calories: 500 },
    ];
    setData(STORAGE_KEYS.EXERCISES, demoExercises);
  }
};