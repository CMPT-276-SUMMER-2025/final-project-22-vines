// Base URL for all Wger API proxy requests through backend
const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/wger`;

/**
 * @function fetchExercises
 * @desc Fetches exercises from the backend with optional filters (category, equipment, muscles)
 * @param {Object} filters - Optional query params as key-value pairs (e.g. { category: 8, equipment: 3 })
 * @returns {Promise<Array>} List of enriched exercise objects
 * @throws {Error} If fetch fails
 */
export async function fetchExercises(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${BASE_URL}/exercises?${params}`);
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

/**
 * @function fetchCategories
 * @desc Retrieves exercise categories from the backend
 * @returns {Promise<Array>} List of category objects
 * @throws {Error} If fetch fails
 */
export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

/**
 * @function fetchEquipment
 * @desc Retrieves exercise equipment from the backend
 * @returns {Promise<Array>} List of equipment objects
 * @throws {Error} If fetch fails
 */
export async function fetchEquipment() {
  const res = await fetch(`${BASE_URL}/equipment`);
  if (!res.ok) throw new Error('Failed to fetch equipment');
  return res.json();
}

/**
 * @function fetchMuscles
 * @desc Retrieves muscle groups from the backend
 * @returns {Promise<Array>} List of muscle group objects
 * @throws {Error} If fetch fails
 */
export async function fetchMuscles() {
  const res = await fetch(`${BASE_URL}/muscles`);
  if (!res.ok) throw new Error('Failed to fetch muscles');
  return res.json();
}

/**
 * @function fetchExerciseImage
 * @desc Fetches the primary image for a given exercise directly from Wger public API
 * @param {number|string} exerciseId - ID of the exercise to fetch image for
 * @returns {Promise<string|null>} URL to image or null if not found
 * @throws {Error} If fetch fails
 */
export async function fetchExerciseImage(exerciseId) {
  const res = await fetch(`https://wger.de/api/v2/exerciseimage/?exercise=${exerciseId}`);
  if (!res.ok) throw new Error('Failed to fetch exercise image');
  const data = await res.json();
  return data.results.length > 0 ? data.results[0].image : null;
}
