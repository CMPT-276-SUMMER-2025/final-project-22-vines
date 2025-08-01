const axios = require('axios');

const WGER_BASE_URL = 'https://wger.de/api/v2';

/**
 * @route GET /api/wger/exercises
 * @desc Searches for exercises filtered by category, equipment, or muscles.
 * Fetches basic exercises from `/exercise`, then enriches each with data from `/exerciseinfo/:id`.
 * Filters out results without image or description.
 *
 * @query {string} category - (optional) category ID
 * @query {string} equipment - (optional) equipment ID
 * @query {string} muscles - (optional) muscle ID
 *
 * @returns {Array} List of enriched exercise objects
 */
exports.searchExercises = async (req, res) => {
  const { category, equipment, muscles } = req.query;

  // Initial query params for /exercise endpoint
  const params = {
    language: 2, // English
    status: 2,   // Only published exercises
    limit: 50
  };

  // Add filters if provided
  if (category) params.category = category;
  if (equipment) params.equipment = equipment;
  if (muscles) params.muscles = muscles;

  try {
    // Step 1: Fetch filtered basic exercises
    const response = await axios.get(`${WGER_BASE_URL}/exercise/`, { params });
    const basicExercises = response.data.results;

    // Step 2: Enrich each exercise using /exerciseinfo/<id> for full details
    const enrichedExercises = await Promise.all(
      basicExercises.map(async (ex) => {
        try {
          const infoRes = await axios.get(`${WGER_BASE_URL}/exerciseinfo/${ex.id}/`);
          const info = infoRes.data;

          // Try to get English translation if available
          const translation = info.translations.find(t => t.language === 2);

          return {
            id: info.id,
            name: translation?.name || info.name || 'Unnamed Exercise',
            description: translation?.description || '',
            image: info.images?.length > 0 ? info.images[0].image : null,
            category: info.category?.name || '',
            equipment: info.equipment?.map(e => e.name) || [],
            muscles: info.muscles?.map(m => m.name_en || m.name) || []
          };
        } catch (err) {
          // Log warning if individual enrichment fails
          console.warn(`Failed to enrich exercise ID ${ex.id}: ${err.message}`);
          return null; // Skip this item in final result
        }
      })
    );

    // Filter out any null values or exercises with no description/image
    const results = enrichedExercises.filter(
      (ex) => ex && (ex.description.trim() !== '' || ex.image !== null)
    );

    res.json(results);
  } catch (err) {
    console.error('Error fetching enriched exercise data:', err.message);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
};

/**
 * @route GET /api/wger/categories
 * @desc Fetches all available exercise categories
 * @returns {Array} List of category objects
 */
exports.getExerciseCategories = async (req, res) => {
  try {
    const response = await axios.get(`${WGER_BASE_URL}/exercisecategory/`);
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

/**
 * @route GET /api/wger/muscles
 * @desc Fetches all available muscles
 * @returns {Array} List of muscle objects
 */
exports.getMuscles = async (req, res) => {
  try {
    const response = await axios.get(`${WGER_BASE_URL}/muscle/`);
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch muscles' });
  }
};

/**
 * @route GET /api/wger/equipment
 * @desc Fetches all available equipment types
 * @returns {Array} List of equipment objects
 */
exports.getEquipment = async (req, res) => {
  try {
    const response = await axios.get(`${WGER_BASE_URL}/equipment/`);
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
};
