const axios = require('axios');
const BASE_URL = 'https://wger.de/api/v2';

/**
 * @route GET /api/weeklyplan/exercises
 * @desc Fetches all enriched exercises across all categories from Wger API.
 * For each category, fetches exercises and enriches them with full info and images.
 * Filters out exercises without any description or image.
 * 
 * @returns {Array} List of valid enriched exercise objects
 */
exports.getAllExercises = async (req, res) => {
  try {
    // Step 1: Fetch all exercise categories
    const categoryRes = await axios.get(`${BASE_URL}/exercisecategory/`);
    const categories = categoryRes.data.results;

    let allExercises = [];

    // Step 2: For each category, fetch its exercises
    for (const category of categories) {
      const { data } = await axios.get(`${BASE_URL}/exercise/`, {
        params: {
          category: category.id,
          language: 2, // English
          status: 2,   // Only approved/published
          limit: 100,
        },
      });

      const basicExercises = data.results;

      // Step 3: Enrich each basic exercise with full details
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
            // If enrichment fails for one item, log and continue
            console.warn(`Failed to enrich exercise ID ${ex.id}:`, err.message);
            return null;
          }
        })
      );

      // Step 4: Keep only enriched exercises with either description or image
      const valid = enriched.filter(
        ex => ex && (ex.description.trim() !== '' || ex.image)
      );

      // Merge into master list
      allExercises = [...allExercises, ...valid];
    }

    // Step 5: Handle case when no exercises were valid
    if (allExercises.length === 0) {
      return res.status(404).json({ error: 'No valid exercises found across all categories.' });
    }

    // Step 6: Return the final aggregated list
    res.json(allExercises);
  } catch (err) {
    console.error('Error in getAllExercises:', err.message);
    res.status(500).json({ error: 'Failed to fetch exercises across categories' });
  }
};
