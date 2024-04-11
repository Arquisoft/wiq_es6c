const request = require('supertest');
const axios = require('axios');
const app = require('./apis-gateway-service'); 

afterAll(async () => {
    app.close();
});

jest.mock('axios');

describe('Gateway Service', () => {
    describe('/history/games', () => {
        it('should return all games', async () => {
            const mockData = [{
                id: 1,
                username: 'test',
                points: 10,
                questions: [{
                    title: 'Question 1',
                    answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
                    ansIndex: [1,2]
                }],
                createdAt: new Date()
            }];
            axios.get.mockResolvedValue({ data: mockData });

            const res = await request(app).get('/history/games');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockData);
        });

        it('should handle errors', async () => {
            axios.get.mockRejectedValue(new Error('Error'));

            const res = await request(app).get('/history/games');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual({ error: 'Error' });
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
