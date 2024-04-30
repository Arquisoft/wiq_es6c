const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

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
  });

  test('The user is not registered in the site', ({given,when,then}) => {
    
    let username;
    let password;
    let name;
    let surname;

    given('An unregistered user', async () => {
      username = name = "pablo"
      surname = "gonzalez"
      password = "pabloasw"
      await expect(page).toClick("p", { text: "¿Todavía no tienes cuenta? Regístrate aquí." });
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      await expect(page).toFill('input[name="name"]', name);
      await expect(page).toFill('input[name="surname"]', surname);
      await expect(page).toClick('button', { text: 'Registrarse' })
    });

    then('A confirmation message should be shown in the screen', async () => {
      await expect(page).toMatchElement("div", { text: "Usuario añadido correctamente" });
  })

  afterAll(async ()=>{
    browser.close()
  })

});