const request = require('supertest');
const express = require('express');
const userRouter = require('../backend/routes/userRoutes'); // adjust path if needed

// jest.mock('firebase-admin', () => ({
//   firestore: jest.fn(() => ({
//     collection: jest.fn(),
//   })),
// }));

// const admin = require('firebase-admin');

describe('Integration: POST /api/user', () => {
  let app;
  let mockDocRef, mockGet, mockSet, mockCollection;

  const testPhone = '1234567890';

  beforeEach(() => {
    // Setup express app
    app = express();
    app.use(express.json());
    app.use('/api/user', userRouter);

    // Setup Firebase mock chain
    mockGet = jest.fn();
    mockSet = jest.fn();
    mockDocRef = { get: mockGet, set: mockSet };
    mockCollection = jest.fn().mockReturnValue({
      doc: jest.fn(() => mockDocRef),
    });

    admin.firestore.mockReturnValue({
      collection: mockCollection,
    });
  });

  it('should create user if not exists and return 200 with ID', async () => {
    mockGet.mockResolvedValueOnce({ exists: false });

    const response = await request(app)
      .post('/api/user')
      .send({ phone: testPhone });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: testPhone });
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockSet).toHaveBeenCalledWith({ phone: testPhone });
  });

  it('should return 500 if Firestore throws error', async () => {
    mockGet.mockRejectedValueOnce(new Error('Firestore failure'));

    const response = await request(app)
      .post('/api/user')
      .send({ phone: testPhone });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Server error while creating/loading user',
    });
  });
});
