const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/playGame.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});

      await page.setRequestInterception(true)

      page.on('request', (req) => {
        if (req.url().includes('/questions')) {
          req.respond({
              status: 200,
              headers: {
                  'Access-Control-Allow-Origin': '*'
              },
              contentType: 'application/json',
              body: JSON.stringify([
                {
                  pregunta: "¿Cuál es la capital de España?",
                  respuesta_correcta: "Madrid",
                  respuestas_incorrectas: ["Valencia"]
                },{
                  pregunta: "¿Cuál es la capital de España?",
                  respuesta_correcta: "Madrid",
                  respuestas_incorrectas: ["Barcelona"]
                }
              ])
          });
        } else if (req.url().includes('/topics')){
          req.respond({
              status: 200,
              headers: {
                  'Access-Control-Allow-Origin': '*'
              },
              contentType: 'application/json',
              body: JSON.stringify([
                ['capitales']
              ])
          });
        } else {
          req.continue();
        }
      })
  });

  test('The user plays a game with default settings', ({given,when,then}) => {

    given('A logged user', async () => {
      await login(page);
    });

    when('I play with configured settings(2 questions 2 answers)', async () => {
      await expect(page).toClick('button', { text: 'Clásico' })
      //await expect(page).toClick('button', {text: "-"})
      for(let i = 0; i < 7; i++){
        const button = await page.$(`#questionsSpinner-`);
        button.click();
        //await expect(page).toClick('button', { id: 'questionsSpinner-' })
      }

      const button = await page.$(`#questionsSpinner-`);
      await button.click();

      await expect(page).toClick('button', { text: 'Comenzar Juego' })
    });

    then('2 questions with 2 answers are asked', async () => {
        for(let i = 0; i < 2; i++){//Dos preguntas
            await expect(page).toMatchElement("div", { class: "questionStructure" });//Comprobamos que existe el div de la pregunta

            const button = await page.$(`#option-1`);//Comprobamos que existe la segunda opción
            expect(button).not.toBeNull();

            const noButton = await page.$(`#option-2`);//Comprobamos que no existe una tercera opción
            expect(noButton).toBeNull();
            button.click();//Respondemos la segunda opción
    
            await new Promise((resolve) => setTimeout(resolve, 2100)); //Esperar a que se muestre la pregunta
        }

        await expect(page).toMatchElement("h2", { text: "Modos de juego:" });//Volvemos al menú*/
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});

async function login(page) {
    username = "AlbertoQL"
    password = "CuevaRector2024"
    await expect(page).toFill('input[name="username"]', username);
    await expect(page).toFill('input[name="password"]', password);
    await expect(page).toClick('button', { text: 'Iniciar sesión' })
  }