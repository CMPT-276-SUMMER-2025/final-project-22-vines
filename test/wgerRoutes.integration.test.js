const express = require('express');
const request = require('supertest');
const axios = require('axios');
jest.mock('axios');

const wgerRouter = require('../backend/routes/wgerRoutes'); // adjust path as needed

describe('Integration: /api/wger routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/wger', wgerRouter);
  });

  it('GET /exercises should return enriched exercise list with correct structure', async () => {
    const exercises = [{ id: 1 }];
    const info = {
      id: 1,
      name: 'Exercise 1',
      translations: [
        { language: 2, name: 'Push Up', description: 'Chest exercise' },
      ],
      images: [{ image: 'http://image1.com' }],
      category: { name: 'Chest' },
      equipment: [{ name: 'Bodyweight' }],
      muscles: [{ name_en: 'Pecs' }]
    };

    axios.get = jest.fn().mockResolvedValueOnce({ data: { results: exercises } }) // /exercise/
      .mockResolvedValueOnce({ data: info }); // /exerciseinfo/1

    const res = await request(app).get('/api/wger/exercises');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([
      {
        id: 1,
        name: 'Push Up',
        description: 'Chest exercise',
        image: 'http://image1.com',
        category: 'Chest',
        equipment: ['Bodyweight'],
        muscles: ['Pecs']
      }
    ]);
  });

  it('GET /exercises should forward query parameters correctly', async () => {
    axios.get = jest.fn().mockResolvedValueOnce({ data: { results: [] } }); // /exercise/ (no exercises)

    const res = await request(app)
      .get('/api/wger/exercises')
      .query({ category: '9', equipment: '5', muscles: '4' });

    expect(res.status).toBe(200);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/exercise/'),
      expect.objectContaining({
        params: expect.objectContaining({
          category: '9',
          equipment: '5',
          muscles: '4',
          language: 2,
          status: 2,
          limit: 50
        })
      })
    );
  });

  it('GET /exercises should return 500 on Axios error', async () => {
    axios.get.mockRejectedValueOnce(new Error('API fail'));

    const res = await request(app).get('/api/wger/exercises');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to fetch exercises' });
  });
});
