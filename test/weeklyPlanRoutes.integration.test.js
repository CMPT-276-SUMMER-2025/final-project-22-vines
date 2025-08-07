const express = require('express');
const request = require('supertest');
const axios = require('axios');
jest.mock('axios');

const weeklyPlanRouter = require('../backend/routes/weeklyPlanRoutes'); // adjust path if needed

describe('Integration: GET /api/weeklyplan/exercises', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/weeklyplan', weeklyPlanRouter);
  });

  it('should return 200 and a list of enriched exercises', async () => {
    // Mock Wger API: /exercisecategory/
    axios.get = jest.fn().mockResolvedValueOnce({
        data: {
          results: [{ id: 1, name: 'Arms' }],
        },
      })

      // Mock Wger API: /exercise/?category=1
      .mockResolvedValueOnce({
        data: {
          results: [{ id: 101 }],
        },
      })

      // Mock Wger API: /exerciseinfo/101/
      .mockResolvedValueOnce({
        data: {
          id: 101,
          name: 'Bicep Curl',
          translations: [
            {
              language: 2,
              name: 'Bicep Curl',
              description: 'Curl it.',
            },
          ],
          images: [{ image: 'image_url' }],
          category: { name: 'Arms' },
        },
      });

    const res = await request(app).get('/api/weeklyplan/exercises');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([
      {
        id: 101,
        name: 'Bicep Curl',
        description: 'Curl it.',
        image: 'image_url',
        category: 'Arms',
      },
    ]);
  });

  it('should return 404 if no valid enriched exercises are found', async () => {
    // Mock category list
    axios.get
      .mockResolvedValueOnce({
        data: {
          results: [{ id: 1, name: 'Arms' }],
        },
      })

      // Mock exercises for category
      .mockResolvedValueOnce({
        data: {
          results: [{ id: 102 }],
        },
      })

      // Mock exerciseinfo with empty description and no image
      .mockResolvedValueOnce({
        data: {
          id: 102,
          name: 'Empty Exercise',
          translations: [{ language: 2, name: 'Empty', description: '' }],
          images: [],
          category: { name: 'Arms' },
        },
      });

    const res = await request(app).get('/api/weeklyplan/exercises');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: 'No valid exercises found across all categories.',
    });
  });
});
