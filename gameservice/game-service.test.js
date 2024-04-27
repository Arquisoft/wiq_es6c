const request = require('supertest');
const axios = require('axios');
const app = require('./game-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('Game Service', () => {
    axios.post.mockImplementation((url, data) => {
        if (url.endsWith('/storeGame')) {
            return Promise.resolve("status ok")
        }
    })
    axios.get.mockImplementation((url, data) => {
        if (url.endsWith('/questions?n_preguntas=1&n_respuestas=4&tema=capital')) {
            return Promise.resolve({data: {
                pregunta: '¿Cuál es la capital Italia?',
                respuesta_correcta: 'Roma',
                respuestas_incorrectas: ['Nápoles', 'Florencia', 'Milán'],
            }})
        } 
    })


    it('should return a game id', async () => {
        const response = await request(app)
            .get('/generateGame');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(24);
    })

    it('should fail', async () => {
        const response = await request(app)
            .get('/questions?n_preguntas=2&n_respuestas=5&tema=capital&tema=lenguaje')
        expect(response.statusCode).toBe(500)
    })

    it('should return a number o questions of a diferent types of topics', async () => {
        const response = await request(app)
            .get('/questions?n_preguntas=1&n_respuestas=4&tema=capital')
        expect(response.statusCode).toBe(200)
        expect(response.body.pregunta).toBe('¿Cuál es la capital Italia?')
        expect(response.body.respuesta_correcta).toBe('Roma')
        expect(response.body.respuestas_incorrectas[0]).toBe("Nápoles")
        expect(response.body.respuestas_incorrectas[1]).toBe("Florencia")
        expect(response.body.respuestas_incorrectas[2]).toBe("Milán")
        
    })
})

//Revisar este test por algun motivo no lo está mockeando bien la llamada
// describe('Test the store game', () => {
//     axios.post.mockImplementation((url, data) => {
//         if (url.endsWith('/storeGame')) {
//             return Promise.resolve(200)
//         }
//     })

//     it('should store the data of a game', async () => {
//         const newGame = {
//             id: "1",
//             username: 'testuser',
//             points: 100,
//             questions: [{
//               title: 'Question 1',
//               answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
//               ansIndex: [1, 2]
//             }, {
//               title: 'Question 2',
//               answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
//               ansIndex: [1, 1]
//             }]
//           };
//         const response = await request(app)
//             .post('/storeGame')
//             .send(newGame)
//         console.log(response)
//         expect(response.statusCode).toBe(200)
//     })
// })