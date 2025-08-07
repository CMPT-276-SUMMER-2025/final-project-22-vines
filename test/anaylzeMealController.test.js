const axios = require('axios');

jest.mock('axios'); 
jest.mock('../backend/firebase.js', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
      })),
    })),
  },
}));

let analyzeMealController;

beforeEach(() => {
  jest.clearAllMocks();
  analyzeMealController = require('../backend/controllers/mealController').analyzeMealController;
});

describe('analyzeMealController', () => {
  const mealReq = {
    body: {
      title: 'Pasta Dinner',
      ingr: ['1 cup pasta', '2 tbsp olive oil', '1 tsp salt'],
    },
  };

  const mealRes = {

    _status: null,
    _json: null,
    json: (injson) => {
      if(injson != null) {
        _json = injson;
      }
      return _json;
    },
    status: (st) =>{
      if(st) {
        _val = st;
        return mealRes;
      }
      return _val;

  } 


  };


  it('should return nutrition analysis and save it to Firestore', async () => {
    const mockData = { calories: 500, fat: 20 };
    axios.post = jest.fn().mockResolvedValue({data: mockData, status: 200})


    
    //axios.post.mockResolvedValue({ data: mockData });

    const mealControllerResponse = await analyzeMealController(mealReq, mealRes);

    db.collection('mealLogs').doc('latestMeal').get().then( lastestMealDoc => {
      expect(mockCollection).toHaveBeenCalledWith('latestMeal');
    });
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('https://api.edamam.com/api/nutrition-details'),
      mealReq.body
    );

    //expect(mealRes.json).toHaveBeenCalledWith(mockData);
  });

  it('should return 500 on error', async () => {
    axios.post = jest.fn().mockRejectedValue({status: 401});

    await analyzeMealController(mealReq, mealRes);

    expect(mealRes.status()).toBe(500);
    expect(mealRes.json().error).toMatch(/Failed to analyze and save meal./);
  });
});