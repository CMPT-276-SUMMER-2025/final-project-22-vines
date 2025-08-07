
const { createUser } = require('../backend/controllers/userController'); // adjust path as needed
jest.mock('../backend/firebase.js', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
      })),
    })),
  },
}));

describe('createUser', () => {
  let req, res, mockDocRef, mockGet, mockSet;

  const mockPhone = '1234567890';
  const mockCollection = jest.fn();

  beforeEach(() => {
    mockGet = jest.fn();
    mockSet = jest.fn();
    mockDocRef = { get: mockGet, set: mockSet };

    mockCollection.mockReturnValue({
      doc: jest.fn(() => mockDocRef),
    });
    
    req = {
      body: { phone: mockPhone },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it('should return 400 if phone is not provided', async () => {
    req.body = {}; // no phone
    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Phone number is required' });
  });

  it('should create user if not exists and return 200', async () => {
    mockGet.mockResolvedValueOnce({ exists: false });

    await createUser(req, res);

    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockDocRef.set).toHaveBeenCalledWith({ phone: mockPhone });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: mockPhone });
  });

  it('should return 200 if user already exists (no set call)', async () => {
    mockGet.mockResolvedValueOnce({ exists: true });

    await createUser(req, res);

    expect(mockDocRef.set).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: mockPhone });
  });

  it('should return 500 on error', async () => {
    mockGet.mockRejectedValueOnce(new Error('Firestore error'));

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server error while creating/loading user',
    });
  });
});
