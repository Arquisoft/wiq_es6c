const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const axios = require('axios');
jest.mock('axios');

const { QuestionGenerator } = require('./questiongenerator')
const modelUri = process.env.DATAMODELS_URI || '../questiondata-model';
const { Pais, Monumento, Elemento, Pelicula, Cancion } = require(modelUri);

let mongoServer;
let app;

async function loadCountriesData() {
  const newPais1 = new Pais({
    pais: 'Spain',
    capital: 'Madrid',
    continente: 'Europe'
  });
  const newPais2 = new Pais({
    pais: 'Brazil',
    capital: 'Brasília',
    continente: 'South America'
  });
  const newPais3 = new Pais({
    pais: 'United States',
    capital: 'Washington D.C.',
    continente: 'North America'
  });
  const newPais4 = new Pais({
    pais: 'Japan',
    capital: 'Tokyo',
    continente: 'Asia'
  });
  await newPais1.save();
  await newPais2.save();
  await newPais3.save();
  await newPais4.save();
}

async function loadMonumentsData() {
  const newMonumento1 = new Monumento({
    monumento: `Oviedo's Cathedral`,
    pais: 'España'
  });
  const newMonumento2 = new Monumento({
    monumento: 'Eiffel Tower',
    pais: 'France'
  });
  const newMonumento3 = new Monumento({
    monumento: 'Statue of Liberty',
    pais: 'United States'
  });
  const newMonumento4 = new Monumento({
    monumento: 'Great Wall of China',
    pais: 'China'
  });
  await newMonumento1.save();
  await newMonumento2.save();
  await newMonumento3.save();
  await newMonumento4.save();
}

async function loadElementsData() {
  const newElemento1 = new Elemento({
    elemento: 'Oxígeno',
    simbolo: 'O'
  });
  const newElemento2 = new Elemento({
    elemento: 'Hydrogen',
    simbolo: 'H'
  });
  const newElemento3 = new Elemento({
    elemento: 'Carbon',
    simbolo: 'C'
  });
  const newElemento4 = new Elemento({
    elemento: 'Sodium',
    simbolo: 'Na'
  });
  await newElemento1.save();
  await newElemento2.save();
  await newElemento3.save();
  await newElemento4.save();
}

async function loadPeliculasData() {
  const newPelicula1 = new Pelicula({
    pelicula: 'Star Wars: The Phantom Menace',
    director: 'George Lucas'
  });
  const newPelicula2 = new Pelicula({
    pelicula: 'The Shawshank Redemption',
    director: 'Frank Darabont'
  });
  const newPelicula3 = new Pelicula({
    pelicula: 'The Godfather',
    director: 'Francis Ford Coppola'
  });
  const newPelicula4 = new Pelicula({
    pelicula: 'Inception',
    director: 'Christopher Nolan'
  });
  await newPelicula1.save();
  await newPelicula2.save();
  await newPelicula3.save();
  await newPelicula4.save();
}

async function loadCancionesData() {
  const newCancion1 = new Cancion({
    cancion: 'Viva la vida',
    artista: 'Coldplay'
  });
  const newCancion2 = new Cancion({
    cancion: 'Bohemian Rhapsody',
    artista: 'Queen'
  });
  const newCancion3 = new Cancion({
    cancion: 'Shape of You',
    artista: 'Ed Sheeran'
  });
  const newCancion4 = new Cancion({
    cancion: 'Make you mine',
    artista: 'Madison Beer'
  });
  await newCancion1.save();
  await newCancion2.save();
  await newCancion3.save();
  await newCancion4.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = await require('./questiongenerator-service');
  //Load database with initial conditions
  await loadCountriesData();
  await loadMonumentsData();
  await loadElementsData();
  await loadPeliculasData();
  await loadCancionesData();
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Test the GET /topics endpoint', () => {
  it('Should return a list of topics', async () => {
    const expectedTopics = [...QuestionGenerator.temas.keys()];
    const response = await request(app).get('/topics');
    expect(response.status).toBe(200);
    expect(response.type).toEqual(expect.stringContaining('json'));
    expect(response.body).toEqual(expectedTopics);
  });
});

describe('Test the GET /questions endpoint with correct params', () => {
  it('Should ', async () => {
    axios.post.mockRejectedValue(new Error());
    const response = await request(app).get('/questions');
    expect(response.status).toBe(200);
  });

  it('Should return a list with 1 question and 4 answers', async () => {
    axios.post.mockImplementation((url) => {
      if (url.endsWith('/history/questions')) {
        return Promise.resolve(200);
      }
    });
    const response = await request(app).get('/questions');
    expect(response.status).toBe(200);
    expect(response.type).toEqual(expect.stringContaining('json'));
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    response.body.forEach(question => {
      expect(question).toHaveProperty('pregunta', 'respuesta_correcta', 'respuestas_incorrectas');
      expect(typeof question.pregunta).toEqual("string");
      expect(typeof question.respuesta_correcta).toEqual("string");
      expect(Array.isArray(question.respuestas_incorrectas)).toBe(true);
      expect(question.respuestas_incorrectas.length).toBe(3);
      question.respuestas_incorrectas.forEach(answer => {
        expect(typeof answer).toEqual('string');
      });
    });
  });

  it('Should return a list with 8 questions about capitals and 2 answers', async () => {
    const response = await request(app).get('/questions?n_preguntas=8&n_respuestas=2&tema=Capitales');
    expect(response.status).toBe(200);
    expect(response.type).toEqual(expect.stringContaining('json'));
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(8);
    response.body.forEach(question => {
      expect(question).toHaveProperty('pregunta', 'respuesta_correcta', 'respuestas_incorrectas');
      expect(typeof question.pregunta).toEqual("string");
      expect(typeof question.respuesta_correcta).toEqual("string");
      expect(Array.isArray(question.respuestas_incorrectas)).toBe(true);
      expect(question.respuestas_incorrectas.length).toBe(1);
      question.respuestas_incorrectas.forEach(answer => {
        expect(typeof answer).toEqual('string');
      });
    });
  });

  it('Should return a list with 8 questions about continents and 2 answers', async () => {
    const response = await request(app).get('/questions?n_preguntas=8&n_respuestas=2&tema=Continentes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(8);
    response.body.forEach(question => {
      expect(question).toHaveProperty('pregunta', 'respuesta_correcta', 'respuestas_incorrectas');
    });
  });

  it('Should return a list with 8 questions about monuments and 2 answers', async () => {
    const response = await request(app).get('/questions?n_preguntas=8&n_respuestas=2&tema=Monumentos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(8);
    response.body.forEach(question => {
      expect(question).toHaveProperty('pregunta', 'respuesta_correcta', 'respuestas_incorrectas');
    });
  });

  it('Should return a list with 8 questions about chemical elements and 2 answers', async () => {
    const response = await request(app).get('/questions?n_preguntas=8&n_respuestas=2&tema=Quimica');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(8);
    response.body.forEach(question => {
      expect(question).toHaveProperty('pregunta', 'respuesta_correcta', 'respuestas_incorrectas');
    });
  });

  it('Should return a list with 8 questions about films and 2 answers', async () => {
    const response = await request(app).get('/questions?n_preguntas=8&n_respuestas=2&tema=Peliculas');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(8);
    response.body.forEach(question => {
      expect(question).toHaveProperty('pregunta', 'respuesta_correcta', 'respuestas_incorrectas');
    });
  });

  it('Should return a list with 8 questions about songs and 2 answers', async () => {
    const response = await request(app).get('/questions?n_preguntas=8&n_respuestas=2&tema=Canciones');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(8);
    response.body.forEach(question => {
      expect(question).toHaveProperty('pregunta', 'respuesta_correcta', 'respuestas_incorrectas');
    });
  });
});

describe('Test the GET /questions endpoint with incorrect params', () => {
  it(`Should return a 'number was expected' error on param 'n_preguntas'`, async () => {
    const response = await request(app).get('/questions?n_preguntas=Error');
    expect(response.status).toBe(400);
    expect(response.type).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(`A number was expected in param 'n_preguntas'`);
  });

  it(`Should return a 'number must be at least' error on param 'n_respuestas'`, async () => {
    const response = await request(app).get('/questions?n_respuestas=0');
    expect(response.status).toBe(400);
    expect(response.type).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(`'n_respuestas' must be at least '1'`);
  });

  it(`Should return a 'No correct topics were passed' error`, async () => {
    const response = await request(app).get('/questions?tema=Error');
    expect(response.status).toBe(500);
    expect(response.type).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(`Internal Server Error`);
  });

  it(`Should return a 'Not enought data found to generate a question' error`, async () => {
    const response = await request(app).get('/questions?n_respuestas=5&tema=Capitales');
    expect(response.status).toBe(500);
    expect(response.type).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(`Internal Server Error`);
  });

  it(`Should return a 'Not enought data found to generate a question' error`, async () => {
    const response = await request(app).get('/questions?n_respuestas=5&tema=Continentes');
    expect(response.status).toBe(500);
    expect(response.type).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(`Internal Server Error`);
  });

  it(`Should return a 'Not enought data found to generate a question' error`, async () => {
    await Pelicula.deleteMany({});
    const response = await request(app).get('/questions?n_respuestas=2&tema=Peliculas');
    expect(response.status).toBe(500);
    expect(response.type).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(`Internal Server Error`);
  });
});