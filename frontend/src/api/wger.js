const BASE_URL = 'http://localhost:5000/api/wger';

export async function fetchExercises(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${BASE_URL}/exercises?${params}`);
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchEquipment() {
  const res = await fetch(`${BASE_URL}/equipment`);
  if (!res.ok) throw new Error('Failed to fetch equipment');
  return res.json();
}

export async function fetchMuscles() {
  const res = await fetch(`${BASE_URL}/muscles`);
  if (!res.ok) throw new Error('Failed to fetch muscles');
  return res.json();
}

export async function fetchExerciseImage(exerciseId) {
  const res = await fetch(`https://wger.de/api/v2/exerciseimage/?exercise=${exerciseId}`);
  if (!res.ok) throw new Error('Failed to fetch exercise image');
  const data = await res.json();
  return data.results.length > 0 ? data.results[0].image : null;
}
