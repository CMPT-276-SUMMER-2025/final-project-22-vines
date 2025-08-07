const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const workoutLogRoutes = require('../backend/routes/workoutLogRoutes');
const { mockFirebase } = require('firestore-jest-mock');

// Mock Firebase with some default data
mockFirebase({
  database: {
    workoutLogs: [],
  },
});

const app = express();
app.use(bodyParser.json());
app.use('/api/workoutLogs', workoutLogRoutes);

describe('Workout Logs Integration Routes', () => {
  describe('POST /api/workoutLogs', () => {
    it('should log a workout and return 201', async () => {
      const newLog = {
        phone: '1234567890',
        exerciseName: 'Pull Ups',
        sets: 4,
        reps: 12,
        weight: 0,
      };

      const res = await request(app).post('/api/workoutLogs').send(newLog);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Workout logged successfully' });
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/workoutLogs')
        .send({ phone: '1234567890' }); // Missing other fields

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'All fields are required.' });
    });
  });

  describe('GET /api/workoutLogs/:phone', () => {
    beforeEach(() => {
      mockFirebase({
        database: {
          workoutLogs: [
            {
              phone: '1234567890',
              exerciseName: 'Bench Press',
              sets: 5,
              reps: 8,
              weight: 135,
              timestamp: '2025-08-06T00:00:00Z',
            },
            {
              phone: '1234567890',
              exerciseName: 'Deadlift',
              sets: 5,
              reps: 5,
              weight: 225,
              timestamp: '2025-08-05T00:00:00Z',
            },
          ],
        },
      });
    });

    it('should return workout logs for a phone number', async () => {
      const res = await request(app).get('/api/workoutLogs/1234567890');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('exerciseName');
    });

    it('should return 500 if Firestore throws an error', async () => {
      const { db } = require('../backend/firebase');
      db.collection = jest.fn(() => ({
        where: () => ({
          get: jest.fn().mockRejectedValueOnce(new Error('Firestore error')),
        }),
      }));

      const res = await request(app).get('/api/workoutLogs/1234567890');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Server error while fetching logs',
      });
    });
  });
});
