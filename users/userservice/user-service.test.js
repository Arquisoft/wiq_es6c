const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('User Service', () => {
  it('should add a new user on POST /adduser', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });
  it('should return a list of users on GET /users', async () => {
    // Realizar la solicitud GET a /users
    const response = await request(app).get('/users');

    // Verificar el código de estado de la respuesta
    expect(response.status).toBe(200);

    // Verificar el formato de la respuesta
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('_id');
    expect(response.body[0]).toHaveProperty('username');
    expect(response.body[0]).toHaveProperty('createdAt');
  });
});
