const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/playCalculator.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 10 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});

  });

  test('The user plays a game with default settings', ({given,when,then}) => {

    given('A logged user', async () => {
      await login(page);
    });

    when('I press play button', async () => {
      await expect(page).toClick('button', { text: 'Calculadora Humana' })
    });

    then('questions with 4 answers are displayed till time finishes', async () => {
        for(let i = 0; i < 2; i++){//Dos preguntas
            await expect(page).toMatchElement("div", { class: "questionStructure" });//Comprobamos que existe el div de la pregunta

            await page.waitForSelector(`#option-3`);
            const button = await page.$(`#option-3`);//Comprobamos que existe la cuarta opción
            await expect(button).not.toBeNull();

            const noButton = await page.$(`#option-4`);//Comprobamos que no existe una quinta opción
            expect(noButton).toBeNull();

            await new Promise((resolve) => setTimeout(resolve, 200)); //Simulación del tiempo de reflexión del usuario
            await expect(page).toClick('#option-0');//Respondemos la primera opción
    
            await new Promise((resolve) => setTimeout(resolve, 2100)); //Esperar a que se muestre la pregunta
        }
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