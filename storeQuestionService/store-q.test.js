const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/storedquestion';
  process.env.MONGODB_URI = mongoUri;
  app = require('./store-q-service'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('Store a question service', () => {
  it('should add a new question on POST /history/question', async () => {
    const newQuestion = {
      pregunta: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
      respuesta_correcta: 'Ninguna',
      respuestas_incorrectas: ['Segovia','León','Valladolid'],
      createdAt: '<2002-02-02>'
    };

    const response = await request(app).post('/history/question').send(newQuestion);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('pregunta', 'respuesta_correcta', 'respuestas_incorrectas');
  });
});

describe('Store a question service', () => {
  it('should add a new question with all required fields', async () => {
    // Crear una pregunta de prueba con valores válidos
    const newQuestion = {
      pregunta: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
      respuesta_correcta: 'Ninguna',
      respuestas_incorrectas: ['Segovia', 'León', 'Valladolid'],
      createdAt: '<2002-02-02>'
    };

    // Enviar la pregunta al servidor
    const response = await request(app).post('/history/question').send(newQuestion);

    // Verificar que la respuesta sea válida
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('pregunta', newQuestion.pregunta);
    expect(response.body).toHaveProperty('respuesta_correcta', newQuestion.respuesta_correcta);
    expect(response.body).toHaveProperty('respuestas_incorrectas', newQuestion.respuestas_incorrectas);
  });

  it('should handle missing required fields', async () => {
    // Crear una pregunta de prueba sin el campo 'pregunta'
    const incompleteQuestion = {
      respuesta_correcta: 'Ninguna',
      respuestas_incorrectas: ['Segovia', 'León', 'Valladolid'],
      createdAt: '<2002-02-02>'
    };

    // Enviar la pregunta incompleta al servidor
    const response = await request(app).post('/history/question').send(incompleteQuestion);

    // Verificar que la respuesta tenga un estado 400 y un mensaje de error
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should ignore additional fields', async () => {
    // Crear una pregunta de prueba con un campo adicional
    const extraFieldQuestion = {
      pregunta: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
      respuesta_correcta: 'Ninguna',
      respuestas_incorrectas: ['Segovia', 'León', 'Valladolid'],
      createdAt: '<2002-02-02>',
      extra: 'Este campo no debería ser almacenado'
    };

    // Enviar la pregunta con campo adicional al servidor
    const response = await request(app).post('/history/question').send(extraFieldQuestion);

    // Verificar que la respuesta sea válida y que no contenga el campo 'extra'
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('extra');
  });
});

describe('Store individual questions service', () => {
  it('should get all questions on GET /history/questions using first post /history/question', async () => {
    const newQuestion1 = {
      pregunta: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
      respuesta_correcta: 'Ninguna',
      respuestas_incorrectas: ['Segovia','León','Valladolid'],
      createdAt: '<2002-02-02>'
    };
    const newQuestion2 = {
      pregunta: '¿Cuál es la capital Italia?',
      respuesta_correcta: 'Roma',
      respuestas_incorrectas: ['Nápoles','Florencia','Milán'],
      createdAt: '<2002-02-02>'
    };
    const newQuestion3 = {
      pregunta: '¿Cuál es el país mas poblado de la tierra?',
      respuesta_correcta: 'India',
      respuestas_incorrectas: ['China','Estados Unidos','Brazil'],
      createdAt: '<2002-02-02>'
    };
  
    request(app).post('/history/question').send(newQuestion1);
    request(app).post('/history/question').send(newQuestion2);
    request(app).post('/history/question').send(newQuestion3);

    const response = await request(app).get('/history/questions');

    const solution = [{"__v": 0, "_id": "65fabd5ad3b92643c297925b", "createdAt": "2002-02-01T23:00:00.000Z", "pregunta": "¿Cuál es la capital de la comunidad autónoma de Castilla y León?", "respuesta_correcta": "Ninguna", "respuestas_incorrectas": ["Segovia", "León", "Valladolid"]}, {"__v": 0, "_id": "65fabd5ad3b92643c297925e", "createdAt": "2002-02-01T23:00:00.000Z", "pregunta": "¿Cuál es la capital de la comunidad autónoma de Castilla y León?", "respuesta_correcta": "Ninguna", "respuestas_incorrectas": ["Segovia", "León", "Valladolid"]}, {"__v": 0, "_id": "65fabd5ad3b92643c2979260", "createdAt": "2002-02-01T23:00:00.000Z", "pregunta": "¿Cuál es la capital de la comunidad autónoma de Castilla y León?", "respuesta_correcta": "Ninguna", "respuestas_incorrectas": ["Segovia", "León", "Valladolid"]}]

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining(solution)
    );
  });
});

describe('Store an array of questions', () => {
  it('should get all questions on GET /history/questions using first post /history/questions', async () => {
    const questions = [
      {
        pregunta: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
        respuesta_correcta: 'Ninguna',
        respuestas_incorrectas: ['Segovia', 'León', 'Valladolid'],
        createdAt: '<2002-02-02>'
      },
      {
        pregunta: '¿Cuál es la capital Italia?',
        respuesta_correcta: 'Roma',
        respuestas_incorrectas: ['Nápoles', 'Florencia', 'Milán'],
        createdAt: '<2002-02-02>'
      },
      {
        pregunta: '¿Cuál es el país mas poblado de la tierra?',
        respuesta_correcta: 'India',
        respuestas_incorrectas: ['China', 'Estados Unidos', 'Brazil'],
        createdAt: '<2002-02-02>'
      }
    ];

    // Simulamos el envío de las preguntas al servidor
    request(app).post('/history/questions').send(questions);

    // Obtenemos las preguntas almacenadas
    const response = await request(app).get('/history/questions');

    const solution = [{"__v": 0, "_id": "65fabd5ad3b92643c297925b", "createdAt": "2002-02-01T23:00:00.000Z", "pregunta": "¿Cuál es la capital de la comunidad autónoma de Castilla y León?", "respuesta_correcta": "Ninguna", "respuestas_incorrectas": ["Segovia", "León", "Valladolid"]}, {"__v": 0, "_id": "65fabd5ad3b92643c297925e", "createdAt": "2002-02-01T23:00:00.000Z", "pregunta": "¿Cuál es la capital de la comunidad autónoma de Castilla y León?", "respuesta_correcta": "Ninguna", "respuestas_incorrectas": ["Segovia", "León", "Valladolid"]}, {"__v": 0, "_id": "65fabd5ad3b92643c2979260", "createdAt": "2002-02-01T23:00:00.000Z", "pregunta": "¿Cuál es la capital de la comunidad autónoma de Castilla y León?", "respuesta_correcta": "Ninguna", "respuestas_incorrectas": ["Segovia", "León", "Valladolid"]}]

    // Verificamos que la respuesta sea un array que contenga las preguntas originales
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(solution));
  });
});


