const request = require('supertest');
const axios = require('axios');
const app = require('./apis-gateway-service'); 

afterAll(async () => {
    app.close();
});

jest.mock('axios');

describe('User Service', () => {
    describe('/users', () => {
      it('should return user information', async () => {
        const mockUsers = [
          { username: 'user1'},
          { username: 'user2'}
        ];

        axios.get.mockResolvedValue({ data: mockUsers });

        const res = await request(app).get('/users');

        expect(res.statusCode).toEqual(200);
  
        expect(res.body).toEqual(mockUsers);
      });
  

    });
  });
  
describe('Gateway Service', () => {
  describe('/history/questions', () => {
      it('should return all questions', async () => {
          const mockData = [{
              pregunta: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
              respuesta_correcta: 'Ninguna',
              respuestas_incorrectas: ['Segovia','León','Valladolid']
          }];
          axios.get.mockResolvedValue({ data: mockData });

          const res = await request(app).get('/history/questions');
          expect(res.statusCode).toEqual(200);
          expect(res.body).toEqual(mockData);
      });

  });
});

describe('User data is send correctly', () => {
  describe('/users', () => {
    it('should return user information', async () => {
      const mockUsers = [
        { username: 'user1', tpoints: 100, ttime: 10, ngames: 1 },
        { username: 'user2', tpoints: 100, ttime: 10, ngames: 2 }
      ];

      const resutlsUsers = [
        { username: 'user1', avgpoints: 100, avgtime: 10, tpoints: 100, ttime: 10 },
        { username: 'user2', avgpoints: 50, avgtime: 5, tpoints: 100, ttime: 10 }
      ];

      axios.get.mockResolvedValue({ data: mockUsers });

      const res = await request(app).get('/usersStats');

      expect(res.statusCode).toEqual(200);

      expect(res.body).toEqual(resutlsUsers);
    });


  });
});

describe('Error Handling', () => {
  describe('Error getting users', () => {
      it('should handle error when getting users', async () => {
          axios.get.mockRejectedValue(new Error('Failed to fetch users'));

          const res = await request(app).get('/users');

          expect(res.statusCode).toEqual(500);
          expect(res.body).toEqual({ error: 'Internal server error' });
      });
  });

  describe('Error getting history of questions', () => {
      it('should handle error when getting history of questions', async () => {
          axios.get.mockRejectedValue(new Error('Failed to fetch questions history'));

          const res = await request(app).get('/history/questions');

          expect(res.statusCode).toEqual(500);
          expect(res.body).toEqual({ error: 'Internal server error' });
      });
  });

  describe('Error getting history of questions', () => {
    it('should handle error when getting history of questions', async () => {
        axios.get.mockRejectedValue(new Error('Failed to fetch questions history'));

        const res = await request(app).get('/usersStats');

        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({ error: 'Internal server error' });
    });
});
});