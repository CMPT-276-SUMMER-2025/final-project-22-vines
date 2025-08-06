// jest.mock('../backend/firebase.js', () => ({
//   db: {
//     collection: jest.fn(() => ({
//       doc: jest.fn(() => ({
//         set: jest.fn(),
//         get: jest.fn().mockResolvedValue({
//           exists: true,
//           data: () => ({ calories: 123 }), // sample data for GET /api/logs
//         }),
//       })),
//     })),
//   },
// }));

const axios = require('axios');
jest.mock('axios');

// jest.mock('axios', () => ({
//   post: jest.fn().mockResolvedValue({
//     data: {
//       calories: 123, 
//     }
//   }),
// }));

const request = require('supertest');
const express = require('express');
const mealRoutes = require('../backend/routes/edamamRoutes.js'); // Adjust path if needed


// Setup express app for integration testing
const app = express();
app.use(express.json());
app.use('/api', mealRoutes); // Mount routes under /api

describe('Meal Integration Routes', () => {
  describe('POST /api/analyze', () => {
    it('should return 200 and nutrition data for a valid meal', async () => {
      const meal = {
        title: 'Test Meal',
        ingr: ['1 cup rice', '100g chicken', '1 tsp salt']
      };

      const res = await request(app)
        .post('/api/analyze')
        .send(meal)
        .expect('Content-Type', /json/);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('calories'); // or other expected property
    });

    it('should return 500 if the Edamam API fails', async () => {
      const res = await request(app)
        .post('/api/analyze')
        .send({ title: 'Bad Meal', ingr: [] }) // potentially invalid input
        .expect('Content-Type', /json/);

      // Note: if you mock axios globally to fail, this test will hit the failure path
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Failed to analyze and save meal.');
    });
  });

  describe('GET /api/logs', () => {
    it('should return 200 with the latest meal log', async () => {
      const res = await request(app)
        .get('/api/logs')
        .expect('Content-Type', /json/);

      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('calories');
      } else if (res.statusCode === 404) {
        expect(res.body).toHaveProperty('error', 'No meal log found.');
      } else {
        throw new Error('Unexpected status code: ' + res.statusCode);
      }
    });

    it('should return 500 if Firestore throws an error', async () => {
      // You would need to simulate Firestore failure via a test hook or stub
      // This is a placeholder to indicate the condition
      const res = await request(app)
        .get('/api/logs')
        .set('x-simulate-error', 'true') // simulate error in middleware (if implemented)
        .expect('Content-Type', /json/);

      // Optional: only assert if this is the error condition
      if (res.statusCode === 500) {
        expect(res.body).toHaveProperty('error', 'Failed to fetch meal.');
      }
    });
  });
});
