// test/searchExercisesController.test.js

const axios = require('axios');

jest.mock('axios');

const { searchExercises } = require('../backend/controllers/wgerController.js'); // adjust path if needed

describe('searchExercises Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {} // empty by default; customize per test
    };
    res = {
      _status: null,
      _json: null,
    json: jest.fn(),
    status: (st) =>{
      if(st) {
        _val = st;
        return res;
      }
      return _val;

  } 

    };
  });

  it('should return enriched exercises with valid data', async () => {
    const exerciseList = [
      { id: 1 }, { id: 2 }
    ];

    const info1 = {
      id: 1,
      name: 'Exercise 1',
      images: [{ image: 'http://image1.com' }],
      category: { name: 'Category 1' },
      equipment: [{ name: 'Barbell' }],
      muscles: [{ name_en: 'Biceps' }],
      translations: [
        { language: 2, name: 'Push Up', description: 'Chest exercise' }
      ]
    };

    const info2 = {
      id: 2,
      name: 'Exercise 2',
      images: [],
      category: { name: 'Category 2' },
      equipment: [],
      muscles: [],
      translations: [
        { language: 2, name: 'Pull Up', description: '' }
      ]
    };

    axios.get = jest.fn()
      .mockResolvedValueOnce({ data: { results: exerciseList } }) // /exercise/
      .mockResolvedValueOnce({ data: info1 }) // /exerciseinfo/1
      .mockResolvedValueOnce({ data: info2 }); // /exerciseinfo/2

    await searchExercises(req, res);

    expect(res.json).toHaveBeenCalledWith([
      {
        id: 1,
        name: 'Push Up',
        description: 'Chest exercise',
        image: 'http://image1.com',
        category: 'Category 1',
        equipment: ['Barbell'],
        muscles: ['Biceps']
      }
      // Note: info2 should be filtered out due to no image and empty description
    ]);
  });

  it('should skip failed enrichments and return remaining', async () => {
    const exerciseList = [{ id: 1 }, { id: 2 }];

    axios.get
      .mockResolvedValueOnce({ data: { results: exerciseList } }) // /exercise/
      .mockRejectedValueOnce(new Error('Fail 1')) // /exerciseinfo/1
      .mockResolvedValueOnce({ // /exerciseinfo/2
        data: {
          id: 2,
          name: 'Exercise 2',
          images: [{ image: 'http://image2.com' }],
          category: { name: 'Category 2' },
          equipment: [],
          muscles: [],
          translations: [{ language: 2, name: 'Sit Up', description: 'Core workout' }]
        }
      });

    await searchExercises(req, res);

    expect(res.json).toHaveBeenCalledWith([
      {
        id: 2,
        name: 'Sit Up',
        description: 'Core workout',
        image: 'http://image2.com',
        category: 'Category 2',
        equipment: [],
        muscles: []
      }
    ]);
  });

  it('should return 500 if initial /exercise call fails', async () => {
    axios.get = jest.fn().mockRejectedValueOnce(new Error('Initial API fail'));

    await searchExercises(req, res);

    expect(res.status()).toBe(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch exercises' });
  });

  it('should pass query params to axios request', async () => {
    req.query = { category: '8', muscles: '10', equipment: '3' };

    axios.get
      .mockResolvedValueOnce({ data: { results: [] } }); // No exercises returned

    await searchExercises(req, res);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/exercise/'),
      expect.objectContaining({
        params: expect.objectContaining({
          category: '8',
          muscles: '10',
          equipment: '3',
          language: 2,
          status: 2,
          limit: 50
        })
      })
    );

    expect(res.json).toHaveBeenCalledWith([]);
  });
});