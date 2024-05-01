const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/checkHistory.feature');

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
  
        await page.setRequestInterception(true)
  
        page.on('request', (req) => {
          if (req.url().includes('/history/games')) {
            req.respond({
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                contentType: 'application/json',
                body: JSON.stringify(
                    [
                        {
                            "id": "7ic6fik8g18eqn346spn1p5j",
                            "username": "AlbertoQL",
                            "points": 0,
                            "avgtime": 9,
                            "questions": [
                                {
                                    "title": "¿De qué país es capital Podgorica?",
                                    "answers": [
                                        "Montenegro",
                                        "Togo"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "6631766003ef4cf357bb7133"
                                },
                                {
                                    "title": "¿Cuál es la capital de Mongolia?",
                                    "answers": [
                                        "Ulán Bator",
                                        "Yakarta"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "6631766003ef4cf357bb7134"
                                },
                                {
                                    "title": "¿De qué país es capital Argel?",
                                    "answers": [
                                        "Irán",
                                        "Argelia"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "6631766003ef4cf357bb7135"
                                },
                                {
                                    "title": "¿De qué país es capital Brazzaville?",
                                    "answers": [
                                        "África Ecuatorial Francesa",
                                        "Fiyi"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "6631766003ef4cf357bb7136"
                                },
                                {
                                    "title": "¿Cuál es la capital de Sudáfrica?",
                                    "answers": [
                                        "Abuya",
                                        "Bloemfontein"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "6631766003ef4cf357bb7137"
                                },
                                {
                                    "title": "¿De qué país es capital Londres?",
                                    "answers": [
                                        "Inglaterra",
                                        "Kirguistán"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "6631766003ef4cf357bb7138"
                                },
                                {
                                    "title": "¿De qué país es capital Apia?",
                                    "answers": [
                                        "Bielorrusia",
                                        "Samoa"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "6631766003ef4cf357bb7139"
                                },
                                {
                                    "title": "¿De qué país es capital Londres?",
                                    "answers": [
                                        "Reino Unido",
                                        "Islas Marianas del Norte"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "6631766003ef4cf357bb713a"
                                },
                                {
                                    "title": "¿De qué país es capital Bratislava?",
                                    "answers": [
                                        "Eslovaquia",
                                        "Senegal"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "6631766003ef4cf357bb713b"
                                },
                                {
                                    "title": "¿De qué país es capital Yaren?",
                                    "answers": [
                                        "Niue",
                                        "Nauru"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "6631766003ef4cf357bb713c"
                                }
                            ],
                            "createdAt": "2024-04-30T22:53:20.926Z"
                        },
                        {
                            "id": "mxkirs5mqocliwbpconkxg0s",
                            "username": "AlbertoQL",
                            "points": 0,
                            "avgtime": 5,
                            "questions": [
                                {
                                    "title": "¿Qué lengua se habla en Suecia?",
                                    "answers": [
                                        "español",
                                        "sueco"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66314d45f5dbc3185cf71134"
                                },
                                {
                                    "title": "¿De qué país es capital Zagreb?",
                                    "answers": [
                                        "Filipinas",
                                        "Croacia"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66314d45f5dbc3185cf71135"
                                }
                            ],
                            "createdAt": "2024-04-30T19:57:57.800Z"
                        },
                        {
                            "id": "rxglyg2pp1qwq4gq6hl8sd2v",
                            "username": "AlbertoQL",
                            "points": 0,
                            "avgtime": 9,
                            "questions": [
                                {
                                    "title": "¿Qué lengua se habla en Senegal?",
                                    "answers": [
                                        "árabe",
                                        "Badyara"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313b41f5dbc3185cf710d4"
                                },
                                {
                                    "title": "¿De qué país es capital Luanda?",
                                    "answers": [
                                        "Armenia",
                                        "Angola"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313b41f5dbc3185cf710d5"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Hungría?",
                                    "answers": [
                                        "bangla",
                                        "húngaro"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313b41f5dbc3185cf710d6"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Irlanda?",
                                    "answers": [
                                        "inglés",
                                        "irlandés"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313b41f5dbc3185cf710d7"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Burundi?",
                                    "answers": [
                                        "kirundi",
                                        "árabe"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "66313b41f5dbc3185cf710d8"
                                },
                                {
                                    "title": "¿De qué país es capital Sri Jayawardenapura Kotte?",
                                    "answers": [
                                        "Sri Lanka",
                                        "Arabia Saudí"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "66313b41f5dbc3185cf710d9"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Protectorado francés de Marruecos?",
                                    "answers": [
                                        "griego",
                                        "lenguas bereberes"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313b41f5dbc3185cf710da"
                                },
                                {
                                    "title": "¿Cuál es la capital de San Cristóbal y Nieves?",
                                    "answers": [
                                        "Basseterre",
                                        "Bamako"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "66313b41f5dbc3185cf710db"
                                },
                                {
                                    "title": "¿Cuál es la capital de Ruanda?",
                                    "answers": [
                                        "Yaundé",
                                        "Kigali"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313b41f5dbc3185cf710dc"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Liberia?",
                                    "answers": [
                                        "francés",
                                        "inglés"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313b41f5dbc3185cf710dd"
                                }
                            ],
                            "createdAt": "2024-04-30T18:41:05.870Z"
                        },
                        {
                            "id": "coa8wwflt6ue1yifn56vuqri",
                            "username": "AlbertoQL",
                            "points": 100,
                            "avgtime": 8.68,
                            "questions": [
                                {
                                    "title": "¿De qué país es capital Madrid?",
                                    "answers": [
                                        "España",
                                        "Omán"
                                    ],
                                    "ansIndex": [
                                        0,
                                        0
                                    ],
                                    "_id": "66313a47f5dbc3185cf710c6"
                                },
                                {
                                    "title": "¿De qué país es capital Yibuti?",
                                    "answers": [
                                        "Lesoto",
                                        "Yibuti"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313a47f5dbc3185cf710c7"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Australia?",
                                    "answers": [
                                        "palauano",
                                        "inglés australiano"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313a47f5dbc3185cf710c8"
                                },
                                {
                                    "title": "¿Cuál es la capital de Finlandia?",
                                    "answers": [
                                        "Kingstown",
                                        "Helsinki"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313a47f5dbc3185cf710c9"
                                },
                                {
                                    "title": "¿Cuál es la capital de Italia?",
                                    "answers": [
                                        "Roma",
                                        "Lilongüe"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "66313a47f5dbc3185cf710ca"
                                },
                                {
                                    "title": "¿De qué país es capital Daca?",
                                    "answers": [
                                        "Irán",
                                        "Bangladés"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313a47f5dbc3185cf710cb"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Eslovenia?",
                                    "answers": [
                                        "eslovaco",
                                        "esloveno"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313a47f5dbc3185cf710cc"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Yemen?",
                                    "answers": [
                                        "árabe",
                                        "árabe"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "66313a47f5dbc3185cf710cd"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Birmania?",
                                    "answers": [
                                        "birmano",
                                        "inglés"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "66313a47f5dbc3185cf710ce"
                                },
                                {
                                    "title": "¿Cuál es la capital de Australia?",
                                    "answers": [
                                        "Praga",
                                        "Canberra"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "66313a47f5dbc3185cf710cf"
                                }
                            ],
                            "createdAt": "2024-04-30T18:36:55.747Z"
                        },
                        {
                            "id": "0c8zy67n16js10cdzmp107hw",
                            "username": "AlbertoQL",
                            "points": 500,
                            "avgtime": 0.48,
                            "questions": [
                                {
                                    "title": "¿De qué país es capital Santo Tomé?",
                                    "answers": [
                                        "Santo Tomé y Príncipe",
                                        "Tailandia"
                                    ],
                                    "ansIndex": [
                                        0,
                                        0
                                    ],
                                    "_id": "66313905f5dbc3185cf710b8"
                                },
                                {
                                    "title": "¿Cuál es la capital de Singapur?",
                                    "answers": [
                                        "Singapur",
                                        "Bogotá"
                                    ],
                                    "ansIndex": [
                                        0,
                                        0
                                    ],
                                    "_id": "66313905f5dbc3185cf710b9"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Filipinas?",
                                    "answers": [
                                        "idioma filipino",
                                        "guaraní"
                                    ],
                                    "ansIndex": [
                                        0,
                                        0
                                    ],
                                    "_id": "66313905f5dbc3185cf710ba"
                                },
                                {
                                    "title": "¿Cuál es la capital de Israel?",
                                    "answers": [
                                        "Kinsasa",
                                        "Jerusalén"
                                    ],
                                    "ansIndex": [
                                        0,
                                        1
                                    ],
                                    "_id": "66313905f5dbc3185cf710bb"
                                },
                                {
                                    "title": "¿Cuál es la capital de Nigeria?",
                                    "answers": [
                                        "Londres",
                                        "Abuya"
                                    ],
                                    "ansIndex": [
                                        0,
                                        1
                                    ],
                                    "_id": "66313905f5dbc3185cf710bc"
                                },
                                {
                                    "title": "¿Cuál es la capital de Birmania?",
                                    "answers": [
                                        "Riad",
                                        "Naipyidó"
                                    ],
                                    "ansIndex": [
                                        0,
                                        1
                                    ],
                                    "_id": "66313905f5dbc3185cf710bd"
                                },
                                {
                                    "title": "¿Cuál es la capital de Islas Cook?",
                                    "answers": [
                                        "Avarua",
                                        "Puerto España"
                                    ],
                                    "ansIndex": [
                                        0,
                                        0
                                    ],
                                    "_id": "66313905f5dbc3185cf710be"
                                },
                                {
                                    "title": "¿Cuál es la capital de Etiopía?",
                                    "answers": [
                                        "Adís Abeba",
                                        "Kota Kinabalu"
                                    ],
                                    "ansIndex": [
                                        0,
                                        0
                                    ],
                                    "_id": "66313905f5dbc3185cf710bf"
                                },
                                {
                                    "title": "¿De qué país es capital Santo Domingo?",
                                    "answers": [
                                        "Países Bajos",
                                        "República Dominicana"
                                    ],
                                    "ansIndex": [
                                        0,
                                        1
                                    ],
                                    "_id": "66313905f5dbc3185cf710c0"
                                },
                                {
                                    "title": "¿Qué lengua se habla en Brunéi?",
                                    "answers": [
                                        "Idioma tetun",
                                        "malayo"
                                    ],
                                    "ansIndex": [
                                        0,
                                        1
                                    ],
                                    "_id": "66313905f5dbc3185cf710c1"
                                }
                            ],
                            "createdAt": "2024-04-30T18:31:33.864Z"
                        },
                        {
                            "id": "iei15ljgnfg2tnlxnzs5c2g8",
                            "username": "AlbertoQL",
                            "points": 0,
                            "avgtime": 5,
                            "questions": [
                                {
                                    "title": "¿De qué país es capital Brazzaville?",
                                    "answers": [
                                        "Birmania",
                                        "África Ecuatorial Francesa"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        1
                                    ],
                                    "_id": "662fa5c96c7f62dddb99b3f0"
                                },
                                {
                                    "title": "¿De qué país es capital Dili?",
                                    "answers": [
                                        "Egipto",
                                        "Timor Oriental"
                                    ],
                                    "ansIndex": [
                                        0,
                                        1
                                    ],
                                    "_id": "662fa5c96c7f62dddb99b3f1"
                                }
                            ],
                            "createdAt": "2024-04-29T13:51:05.008Z"
                        },
                        {
                            "id": "yyo1zn8jzawnankifhvhdnsg",
                            "username": "AlbertoQL",
                            "points": 100,
                            "questions": [
                                {
                                    "title": "¿De qué país es capital Asjabad?",
                                    "answers": [
                                        "Turkmenistán",
                                        "Bangladés",
                                        "Fiyi",
                                        "Nicaragua"
                                    ],
                                    "ansIndex": [
                                        0,
                                        0
                                    ],
                                    "_id": "66222dd6f5ac322869930bd5"
                                },
                                {
                                    "title": "¿Cuál es la capital de República del Congo?",
                                    "answers": [
                                        "Vientián",
                                        "Ciudad de Guatemala",
                                        "Brazzaville",
                                        "Cardiff"
                                    ],
                                    "ansIndex": [
                                        0,
                                        2
                                    ],
                                    "_id": "66222dd6f5ac322869930bd6"
                                }
                            ],
                            "createdAt": "2024-04-19T08:39:50.039Z"
                        },
                        {
                            "id": "wf8k5zwoo4m9yc5kj92qjz67",
                            "username": "AlbertoQL",
                            "points": 0,
                            "questions": [
                                {
                                    "title": "¿De qué país es capital Asjabad?",
                                    "answers": [
                                        "Turkmenistán",
                                        "Bangladés",
                                        "Fiyi",
                                        "Nicaragua"
                                    ],
                                    "ansIndex": [
                                        -1,
                                        0
                                    ],
                                    "_id": "66222dacf5ac322869930bd2"
                                }
                            ],
                            "createdAt": "2024-04-19T08:39:08.901Z"
                        },
                        {
                            "id": "g8ylmr53gs2bfezqu3922h1c",
                            "username": "AlbertoQL",
                            "points": 0,
                            "questions": [
                                {
                                    "title": "¿Cual es la capital de Antigua y Barbuda?",
                                    "answers": [
                                        "Managua",
                                        "Saint John",
                                        "Riad",
                                        "Libreville"
                                    ],
                                    "ansIndex": [
                                        1,
                                        0
                                    ],
                                    "_id": "6616c6338b19a964e8265f12"
                                }
                            ],
                            "createdAt": "2024-04-10T17:02:43.050Z"
                        },
                        {
                            "id": "vvv0cih7qcr4co6mnev61ccx",
                            "username": "AlbertoQL",
                            "points": 0,
                            "questions": [
                                {
                                    "title": "¿Cual es la capital de Camerún?",
                                    "answers": [
                                        "Singapur",
                                        "Liubliana",
                                        "Jartum",
                                        "Yaundé"
                                    ],
                                    "ansIndex": [
                                        3,
                                        0
                                    ],
                                    "_id": "6616c3028b19a964e8265ee7"
                                }
                            ],
                            "createdAt": "2024-04-10T16:49:06.341Z"
                        }
                    ]
                )
            });
          } else {
            req.continue();
          }
        })
    });
  
    test('The user checks its history', ({given,when,then}) => {
  
      given('A logged user', async () => {
        await login(page);
      });
  
      when('I go to History section', async () => {
        await expect(page).toClick('a', { text: 'Historial' })
      });
  
      then('games with questions and answers are shown', async () => {
        const dropdowns = await page.$$('.dropdown'); // Selecciona todos los elementos con la clase .dropdown
        expect(dropdowns.length).toBe(10);//Comprobamos que hay 10 juegos(es el límite por página)

        for (let i = 0; i < dropdowns.length; i++) {
            const button = await dropdowns[i].$('.dropdown-button');
            await button.click(); // Hace clic en el botón para desplegar el contenido del dropdown
            
            // Esperar que las preguntas sean visibles después de hacer clic
            await page.waitForSelector('.dropdown-content .game .border', { visible: true });
    
            // Contar las preguntas dentro de este dropdown específico
            const questions = await dropdowns[i].$$('.dropdown-content .game .border');
            expect(questions.length).toBeGreaterThan(0); // Verifica que haya al menos una pregunta en este dropdown
        }

        //Comprobar que existe paginación:
        await page.waitForSelector('.pagination', { visible: true });

        const pagination = await page.$('.pagination');

        const borders = await pagination.$$('.border');

        expect(borders.length).toBe(5);

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