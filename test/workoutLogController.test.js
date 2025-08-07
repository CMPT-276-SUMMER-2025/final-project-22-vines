const { logWorkout, getWorkoutLogs } = require('../backend/controllers/workoutLogController.js');



//describe('Workout Log Controller', () => {
  let req, res;

  beforeEach(() => {
    db = {};
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  // describe('logWorkout', () => {
  //   it('should return 400 if required fields are missing', async () => {
  //     req.body = { phone: '123' }; // incomplete

  //     await logWorkout(req, res);

  //     expect(res.status).toHaveBeenCalledWith(400);
  //     expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required.' });
  //   });

  //   it('should save workout log and return 201', async () => {
  //     const mockAdd = jest.fn().mockResolvedValueOnce({});
  //     db.collection.mockReturnValue({ add: mockAdd });

  //     req.body = {
  //       phone: '1234567890',
  //       exerciseName: 'Push Ups',
  //       sets: 3,
  //       reps: 10,
  //       weight: 0,
  //     };

  //     await logWorkout(req, res);

  //     expect(db.collection).toHaveBeenCalledWith('workoutLogs');
  //     expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({
  //       phone: '1234567890',
  //       exerciseName: 'Push Ups',
  //       sets: 3,
  //       reps: 10,
  //       weight: 0,
  //     }));
  //     expect(res.status).toHaveBeenCalledWith(201);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'Workout logged successfully' });
  //   });

  //   it('should return 500 on Firestore error', async () => {
  //     db.collection.mockReturnValue({
  //       add: jest.fn().mockRejectedValueOnce(new Error('Firestore failed')),
  //     });

  //     req.body = {
  //       phone: '1234567890',
  //       exerciseName: 'Squats',
  //       sets: 4,
  //       reps: 8,
  //       weight: 50,
  //     };

  //     await logWorkout(req, res);

  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  //   });
  // });

  describe('getWorkoutLogs', () => {
    const { mockFirebase } = require('firestore-jest-mock');

mockFirebase({
  database: {
    workoutLogs: [
      {
      phone: '1234567890',
      exerciseName: 'Bench-Press',
      sets: 6,
      reps: 10,
      weight: 135,
      timestamp: '2025-08-07T03:12:28.500Z'
    },
    {
      phone: '1234567890',
      exerciseName: 'Deadlift',
      sets: 6,
      reps: 10,
      weight: 225,
      timestamp: '2025-06-07T03:12:28.500Z'
    },
    ],
  },
});

    it('should return logs for a given phone number', async () => {
      const db = firebase.firestore();

      req.params.phone = '1234567890';

      await getWorkoutLogs(req, res);

      expect(mockCollection).toHaveBeenCalledWith('workoutLogs');
      // expect(mockWhere).toHaveBeenCalledWith('phone', '==', '123');
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith([
      //   { phone: '123', exerciseName: 'Bench Press' },
      //   { phone: '123', exerciseName: 'Deadlift' },
      // ]);
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
//});
