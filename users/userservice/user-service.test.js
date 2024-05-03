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

  it('should return an error given a wrong new user on POST /adduser', async () => {
    const wrongUser1 = {
      username: 'IHaveMoreThan20Characters',
      password: 'testpassword',
    };
    const wrongUser2 = {
      username: 'testuser',
      password: `IHaveMoreThan128Characters${'0'.repeat(128)}`,
    };
    const wrongUser3 = {
      username: 'testuser',
      password: 'lt8Char',
    };
    const response1 = await request(app).post('/adduser').send(wrongUser1);
    expect(response1.status).toBe(400);
    expect(response1.body).toHaveProperty('error');
    expect(response1.body.error).toEqual(`The field 'username' can't have more than 20 characters`);

    const response2 = await request(app).post('/adduser').send(wrongUser2);
    expect(response2.status).toBe(400);
    expect(response2.body).toHaveProperty('error');
    expect(response2.body.error).toEqual(`The field 'password' can't have more than 128 characters`);

    const response3 = await request(app).post('/adduser').send(wrongUser3);
    expect(response3.status).toBe(400);
    expect(response3.body).toHaveProperty('error');
    expect(response3.body.error).toEqual(`The field 'password' must have at least 8 characters`);
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
