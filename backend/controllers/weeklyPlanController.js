

const axios = require('axios');
const BASE_URL = 'https://wger.de/api/v2';

exports.getAllExercises = async (req, res) => {
  try {
    // Step 1: Get all categories
    const categoryRes = await axios.get(`${BASE_URL}/exercisecategory/`);
    const categories = categoryRes.data.results;

    let allExercises = [];

    for (const category of categories) {
      // Step 1A: Fetch exercises in each category (language=2 for English)
      const { data } = await axios.get(`${BASE_URL}/exercise/`, {
        params: {
          category: category.id,
          language: 2,
          status: 2,
          limit: 100,
        },
      });

      const basicExercises = data.results;

      // Step 2: Enrich each exercise
      const enriched = await Promise.all(
        basicExercises.map(async (ex) => {
          try {
            const infoRes = await axios.get(`${BASE_URL}/exerciseinfo/${ex.id}/`);
            const info = infoRes.data;

            const translation = info.translations.find(t => t.language === 2);

            return {
              id: info.id,
              name: translation?.name || info.name || 'Unnamed Exercise',
              description: translation?.description || '',
              image: info.images?.[0]?.image || null,
              category: info.category?.name || '',
            };
          } catch (err) {
            console.warn(`Failed to enrich exercise ID ${ex.id}:`, err.message);
            return null;
          }
        })
      );

      const valid = enriched.filter(ex => ex && (ex.description.trim() || ex.image));
      allExercises = [...allExercises, ...valid];
    }

    if (allExercises.length === 0) {
      return res.status(404).json({ error: 'No valid exercises found across all categories.' });
    }

    console.log(`Retrieved ${allExercises.length} enriched exercises across all categories.`);
    res.json(allExercises);
  } catch (err) {
    console.error('Error in getAllExercises:', err.message);
    res.status(500).json({ error: 'Failed to fetch exercises across categories' });
  }
};
