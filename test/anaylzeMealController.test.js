const axios = require('axios');

jest.mock('axios'); 


let analyzeMealController;

beforeEach(() => {
  jest.clearAllMocks();
  analyzeMealController = require('../backend/controllers/mealController').analyzeMealController;
});

describe('analyzeMealController', () => {
  let mealReq = {
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

  it('should return 500 on error', async () => {

    axios.post = jest.fn().mockRejectedValue({status: 401});
    await analyzeMealController(mealReq, mealRes);

    expect(mealRes.status()).toBe(500);
    expect(mealRes.json().error).toMatch('Something went wrong while analyzing your meal. Please try again.');
  });
});
