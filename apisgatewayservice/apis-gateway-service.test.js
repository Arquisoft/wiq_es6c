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
          { username: 'user1', createdAt: new Date() },
          { username: 'user2', createdAt: new Date() }
        ];
        User.find = jest.fn().mockResolvedValue(mockUsers);
  
        const res = await request(app).get('/users');

        expect(res.statusCode).toEqual(200);
  
        expect(res.body).toEqual(mockUsers);
      });
  
      it('should handle errors', async () => {

        User.find = jest.fn().mockRejectedValue(new Error('Database error'));
  
        const res = await request(app).get('/users');
  
        expect(res.statusCode).toEqual(500);
  
        expect(res.body).toEqual({ error: 'Database error' });
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

      it('should handle errors', async () => {
          axios.get.mockRejectedValue(new Error('Error'));

          const res = await request(app).get('/history/questions');
          expect(res.statusCode).toEqual(500);
          expect(res.body).toEqual({ error: 'Error' });
      });
  });
});
