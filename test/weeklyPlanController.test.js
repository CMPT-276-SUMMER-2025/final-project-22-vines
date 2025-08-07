const axios = require('axios');
jest.mock('axios');

const { getAllExercises } = require('../backend/controllers/weeklyPlanController.js'); // adjust path if needed

describe('getAllExercises', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  //Passes
  it('should return enriched exercises with valid data', async () => {
    // Mock categories
    axios.get = jest.fn().mockResolvedValueOnce({
      data: {
        results: [{ id: 1, name: 'Arms' }],
      },
    }).mockResolvedValueOnce({
      data: {
        results: [{ id: 101 }],
      },
    }).mockResolvedValueOnce({
      data: {
        id: 101,
        name: 'Bicep Curl',
        translations: [{ language: 2, name: 'Bicep Curl', description: 'Curl it.' }],
        images: [{ image: 'image_url' }],
        category: { name: 'Arms' },
      },
    });

    await getAllExercises(req, res);

    expect(res.json).toHaveBeenCalledWith([
      {
        id: 101,
        name: 'Bicep Curl',
        description: 'Curl it.',
        image: 'image_url',
        category: 'Arms',
      },
    ]);
  });

//Passes
  it('should skip failed enrichments and return remaining', async () => {
    axios.get = jest.fn().mockResolvedValueOnce({
      data: {
        results: [{ id: 2, name: 'Legs' }],
      },
    }).mockResolvedValueOnce({
      data: {
        results: [{ id: 201 }, { id: 202 }],
      },
    }).mockResolvedValueOnce({
      data: {
        id: 201,
        name: 'Squat',
        translations: [{ language: 2, name: 'Squat', description: 'Do a squat.' }],
        images: [],
        category: { name: 'Legs' },
      },
    }).mockRejectedValueOnce(new Error('404'));

    await getAllExercises(req, res);

    expect(res.json).toHaveBeenCalledWith([
      {
        id: 201,
        name: 'Squat',
        description: 'Do a squat.',
        image: null,
        category: 'Legs',
      },
    ]);
  });

  it('should return 404 if no valid exercises', async () => {
    axios.get = jest.fn().mockResolvedValueOnce({
      data: {
        results: [{ id: 3, name: 'Back' }],
      },
    }).mockResolvedValueOnce({
      data: {
        results: [{ id: 301 }],
      },
    }).mockResolvedValueOnce({
      data: {
        id: 301,
        name: 'Deadlift',
        translations: [{ language: 2, name: 'Deadlift', description: '' }],
        images: [],
        category: { name: 'Back' },
      },
    });

    await getAllExercises(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No valid exercises found across all categories.',
    });
  });

  //Pass
  it('should return 500 if initial /exercisecategory call fails', async () => {
    axios.get = jest.fn().mockRejectedValueOnce(new Error('Network Error'));

    await getAllExercises(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch exercises across categories',
    });
  });

  it('should check exercise path when fetching exercises', async () => {
    axios.get = jest.fn().mockResolvedValueOnce({
      data: {
        results: [{ id: 4, name: 'Chest' }],
      },
    }).mockResolvedValueOnce({
      data: {
        results: [],
      },
    });

    await getAllExercises(req, res);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('exercise'),
      expect.objectContaining({
        params: expect.objectContaining({
          category: 4,
          language: 2,
          status: 2,
          limit: 100,
        }),
      })
    );
  });
});
