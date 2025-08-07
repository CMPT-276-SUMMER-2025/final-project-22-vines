
jest.mock('../backend/firebase.js', () => ({
  db: {
    collection: jest.fn(),
  },
}));

const { logWorkout, getWorkoutLogs } = require('../backend/controllers/workoutLogController.js');
const { db } = require('../backend/firebase.js');

describe('Workout Log Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    jest.resetModules(); // 🔁 Ensure clean state
    jest.clearAllMocks();

    // ✅ Mock Firestore before requiring controller
    jest.mock('../backend/firebase.js', () => ({
      db: {
        collection: jest.fn(),
      },
    }));
  });

  describe('logWorkout', () => {
    it('should return 400 if required fields are missing', async () => {
      req.body = { phone: '123' }; // incomplete

      await logWorkout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required.' });
    });

    it('should return 500 on Firestore error', async () => {
      db.collection.mockReturnValue({
        add: jest.fn().mockRejectedValueOnce(new Error('Firestore failed')),
      });

      req.body = {
        phone: '1234567890',
        exerciseName: 'Squats',
        sets: 4,
        reps: 8,
        weight: 50,
      };

      await logWorkout(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getWorkoutLogs', () => {
    it('should return logs for a given phone number', async () => {
      const mockDocs = [
        { data: () => ({ phone: '123', exerciseName: 'Bench Press' }) },
        { data: () => ({ phone: '123', exerciseName: 'Deadlift' }) },
      ];
      const mockGet = jest.fn().mockResolvedValueOnce({ docs: mockDocs });
      const mockWhere = jest.fn(() => ({ get: mockGet }));

      db.collection.mockReturnValue({
        where: mockWhere,
      });

      req.params.phone = '123';

      await getWorkoutLogs(req, res);

      expect(db.collection).toHaveBeenCalledWith('workoutLogs');
      expect(mockWhere).toHaveBeenCalledWith('phone', '==', '123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { phone: '123', exerciseName: 'Bench Press' },
        { phone: '123', exerciseName: 'Deadlift' },
      ]);
    });

    it('should return 500 on error during fetch', async () => {
      db.collection.mockReturnValue({
        where: () => ({
          get: jest.fn().mockRejectedValueOnce(new Error('Firestore fetch error')),
        }),
      });

      req.params.phone = '123';

      await getWorkoutLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error while fetching logs' });
    });
  });
});
