const axios = require('axios');

const WGER_BASE_URL = 'https://wger.de/api/v2';

// Exercise Search (with image, description, translation)
exports.searchExercises = async (req, res) => {
  const { category, equipment, muscles } = req.query;

  const params = {
    language: 2,
    status: 2,
    limit: 50
  };

  if (category) params.category = category;
  if (equipment) params.equipment = equipment;
  if (muscles) params.muscles = muscles;

  try {
    // Step 1: Get filtered list from /exercise/
    const response = await axios.get(`${WGER_BASE_URL}/exercise/`, { params });
    const basicExercises = response.data.results;

    // Step 2: Fetch /exerciseinfo/<id>/ for each exercise to get full data
    const enrichedExercises = await Promise.all(
      basicExercises.map(async (ex) => {
        try {
          const infoRes = await axios.get(`${WGER_BASE_URL}/exerciseinfo/${ex.id}/`);
          const info = infoRes.data;

          // Get English translation
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
          console.warn(`Failed to fetch exerciseinfo for ID ${ex.id}:`, err.message);
          return null;
        }
      })
    );

    const results = enrichedExercises.filter(
  (ex) => ex && (ex.description.trim() !== '' || ex.image !== null)
);

    res.json(results);
  } catch (err) {
    console.error('Error fetching enriched exercise data:', err.message);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
};

// Get all exercise categories
exports.getExerciseCategories = async (req, res) => {
  try {
    const response = await axios.get(`${WGER_BASE_URL}/exercisecategory/`);
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get all muscles
exports.getMuscles = async (req, res) => {
  try {
    const response = await axios.get(`${WGER_BASE_URL}/muscle/`);
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch muscles' });
  }
};

// Get all equipment
exports.getEquipment = async (req, res) => {
  try {
    const response = await axios.get(`${WGER_BASE_URL}/equipment/`);
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
};