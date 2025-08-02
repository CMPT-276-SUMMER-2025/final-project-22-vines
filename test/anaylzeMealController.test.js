
global.fetch = jest.fn();;
jest.mock('../backend/firebase.js', () => ({
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(),
    })),
  })),
}));

const { analyzeMealController } = require('../backend/controllers/mealController'); // adjust path

describe('analyzeMealController', () => {
  const mockReq = {
    body: {
      title: 'Pasta Dinner',
      ingr: ['1 cup pasta', '2 tbsp olive oil', '1 tsp salt'],
    },
  };

  const mockRes = {
    json: jest.fn(),
    status: jest.fn(() => ({
      json: jest.fn(),
    })),
  };

  it('should return nutrition analysis and save it to Firestore', () => {
    const mockData = { calories: 500, fat: 20 };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    return analyzeMealController(mockReq, mockRes).then(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.edamam.com/api/nutrition-details'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockReq.body),
        })
      );

      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });
  });

  it('should return 500 on error', () => {
    fetch.mockRejectedValue(new Error('API failure'));

    return analyzeMealController(mockReq, mockRes).then(() => {
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.status().json).toHaveBeenCalledWith({
        error: 'Failed to analyze and save meal.',
      });
    });
  });
});