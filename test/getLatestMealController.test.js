// Keep the top-level mock consistent with what your real firebase.js exports
jest.resetModules();
jest.mock('../backend/firebase.js', () => ({
  db: {
    collection: jest.fn(),
  },
}));

const { getLatestMealController } = require('../backend/controllers/mealController.js');
const firebase = require('../backend/firebase.js');

describe('getLatestMealController', () => {
  let req, res, mockDocRef, mockGet;

  const mockDocData = { calories: 500, label: 'Pasta' };

  const { db } = require('../backend/firebase.js');

beforeEach(() => {
  mockGet = jest.fn();
  mockDocRef = { get: mockGet };

  db.collection.mockReturnValue({
    doc: jest.fn(() => mockDocRef),
  });

  req = {};
  res = {
    json: jest.fn(),
    status: jest.fn(() => res),
  };
});

  it('should return meal data if document exists', () => {
    mockGet.mockResolvedValueOnce({
      exists: true,
      data: () => mockDocData,
    });

    return getLatestMealController(req, res).then(() => {
      expect(res.json).toHaveBeenCalledWith(mockDocData);
    });
  });

  it('should return 404 if document does not exist', () => {
    mockGet.mockResolvedValueOnce({ exists: false });

    return getLatestMealController(req, res).then(() => {
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No meal log found.' });
    });
  });

  it('should return 500 on error', () => {
    mockGet.mockRejectedValueOnce(new Error('Firestore failure'));

    return getLatestMealController(req, res).then(() => {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch meal.' });
    });
  });
});