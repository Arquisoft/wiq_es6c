const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('Gateway Service with errors', () => {
  // Mock responses from external services

  // Test /login endpoint
  it('should fail', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(500);
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(500);
  });

  it('should return the data of the user', async () => {
    const response = await request(app)
      .get('/history/games/asdf')
    
    console.log(response)
    expect(response.statusCode).toBe(500);
  })

  it('should return all the questions stored in the database', async () => {
    const response = await request(app)
      .get('/history/questions')

    expect(response.statusCode).toBe(500)
  })

  it('should generate the id of a game', async () => {
    const response = await request(app)
      .get('/generateGame')

    expect(response.statusCode).toBe(500)
  })

  it('should return the number of questions and answes solicitated 1 question and 4 answers is the default', async () => {
    const response = await request(app)
      .get('/questions')

    expect(response.statusCode).toBe(500)
  })

  it('should return the number of questions and answes solicitated 1 question and 4 answers is the default', async () => {
    const response = await request(app)
      .post('/storeGame')
      .send("Example data")

    expect(response.statusCode).toBe(500)
  })

  it('should return the posible topics for the aplication', async () => {
    const response = await request(app)
      .get('/topics')

    expect(response.statusCode).toBe(500)
  })
});


// describe('Gateway Service', () => {
//   // Mock responses from external services
//   axios.post.mockImplementation((url, data) => {
//     if (url.endsWith('/login')) {
//       return Promise.resolve({ data: { token: 'mockedToken' } });
//     } else if (url.endsWith('/adduser')) {
//       return Promise.resolve({ data: { userId: 'mockedUserId' } });
//     } else if (url.endsWith("/storeGame")) {
//       return Promise.resolve({data: {status: "Correct call"}})
//     }
//   });

//   axios.get.mockImplementation((url, data) => {
//     if (url.endsWith('/history/games/asdf')) {
//       return Promise.resolve({data: {status: "Correct call"}})
//     } else if (url.endsWith('/history/questions')) {
//       return Promise.resolve({data: {status: "Correct call"}})
//     } else if (url.endsWith("/questions")) {
//       return Promise.resolve({data: {status: "Correct call"}})
//     } else if (url.endsWith("/generateGame")) {
//       return Promise.resolve({data: {status: "Correct call"}})
//     } else if (url.endsWith('/topics')) {
//       return Promise.resolve({data: {
//         pregunta: '¿Cuál es la capital Italia?',
//         respuesta_correcta: 'Roma',
//         respuestas_incorrectas: ['Nápoles', 'Florencia', 'Milán'],
//       }})
//     }
//   });

//   // Test /login endpoint
//   it('should forward login request to auth service', async () => {
//     const response = await request(app)
//       .post('/login')
//       .send({ username: 'testuser', password: 'testpassword' });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.token).toBe('mockedToken');
//   });

//   // Test /adduser endpoint
//   it('should forward add user request to user service', async () => {
//     const response = await request(app)
//       .post('/adduser')
//       .send({ username: 'newuser', password: 'newpassword' });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.userId).toBe('mockedUserId');
//   });

//   it('should return the data of the user', async () => {
//     const response = await request(app)
//       .get('/history/games/asdf')
    
//     console.log(response)
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("Correct call")
//   })

//   it('should return all the questions stored in the database', async () => {
//     const response = await request(app)
//       .get('/history/questions')

//     expect(response.statusCode).toBe(200)
//     expect(response.body.status).toBe("Correct call")
//   })

//   it('should generate the id of a game', async () => {
//     const response = await request(app)
//       .get('/generateGame')

//     expect(response.statusCode).toBe(200)
//     expect(response.body.status).toBe("Correct call")
//   })

//   it('should return the number of questions and answes solicitated 1 question and 4 answers is the default', async () => {
//     const response = await request(app)
//       .get('/questions')

//     expect(response.statusCode).toBe(200)
//     expect(response.body.status).toBe("Correct call")
//   })

//   it('should return the number of questions and answes solicitated 1 question and 4 answers is the default', async () => {
//     const newGame = {
//       id: "1",
//       username: 'testuser',
//       points: 100,
//       questions: [{
//         title: 'Question 1',
//         answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
//         ansIndex: [1, 2]
//       }, {
//         title: 'Question 2',
//         answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
//         ansIndex: [1, 1]
//       }]
//     };
//     const response = await request(app)
//       .post('/storeGame')
//       .send(newGame)

//     expect(response.statusCode).toBe(200)
//     expect(response.body.status).toBe("Correct call")
//   })

//   it('should return the posible topics for the aplication', async () => {
//     const response = await request(app)
//       .get('/topics')

//     expect(response.statusCode).toBe(200)
//     expect(response.body.pregunta).toBe('¿Cuál es la capital Italia?')
//     expect(response.body.respuesta_correcta).toBe('Roma')
//     expect(response.body.respuestas_incorrectas[0]).toBe("Nápoles")
//     expect(response.body.respuestas_incorrectas[1]).toBe("Florencia")
//     expect(response.body.respuestas_incorrectas[2]).toBe("Milán")
//   })
// });



