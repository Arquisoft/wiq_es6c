const { Pais, Monumento, Elemento, Pelicula, Cancion } = require('./questiongenerator-model')

class QuestionGenerator {

    static temas = new Map([
        ["Paises", [0, 1, 2, 3, 4, 5]],
        ['Capitales', [0, 1]],
        ['Continentes', [2, 3]],
        ['Monumentos', [4, 5]],
        ['Quimica', [6, 7]],
        ['Peliculas', [8, 9]],
        ['Canciones', [10, 11]]
        // ["Lenguajes", []]
    ]);

    static plantillas = [
        {   // 0: Paises, Capitales
            modelo: Pais,
            generateMethod: (plantilla, respuestas) => this.generateQuestion1to1Relation(plantilla, respuestas),
            pregunta: (param) => `¿Cuál es la capital de ${param}?`,
            filtro: { pais: { $exists: true }, capital: { $exists: true } },
            campo_pregunta: 'pais',
            campo_respuesta: 'capital'
        },
        {   // 1: Paises, Capitales
            modelo: Pais,
            generateMethod: (plantilla, respuestas) => this.generateQuestion1to1Relation(plantilla, respuestas),
            pregunta: (param) => `¿De qué país es capital ${param}?`,
            filtro: { capital: { $exists: true }, pais: { $exists: true } },
            campo_pregunta: 'capital',
            campo_respuesta: 'pais'
        },
        {   // 2: Paises, Continentes     -   Meh, repite mucho los continentes
            modelo: Pais,
            generateMethod: (plantilla, respuestas) => this.generateQuestionNonDuplicatedAnswers(plantilla, respuestas),
            pregunta: (param) => `¿En qué continente se situa ${param}?`,
            filtro: { pais: { $exists: true }, continente: { $exists: true } },
            filtro_decoys: (answer) => { return { pais: { $exists: true }, continente: { $exists: true, $ne: answer.continente} }},
            campo_pregunta: 'pais',
            campo_respuesta: 'continente'
        },
        {   // 3: Paises, Continentes
            modelo: Pais,
            generateMethod: (plantilla, respuestas) => this.generateQuestionNonDuplicatedAnswers(plantilla, respuestas),
            pregunta: (param) => `¿Cual de los siguientes paises se situa en ${param}?`,
            filtro: { pais: { $exists: true }, continente: { $exists: true } },
            filtro_decoys: (answer) => { return { pais: { $exists: true }, continente: { $exists: true, $ne: answer.continente} }},
            campo_pregunta: 'continente',
            campo_respuesta: 'pais'
        },
        {   // 4: Paises, Monumentos
            modelo: Monumento,
            generateMethod: (plantilla, respuestas) => this.generateQuestionNonDuplicatedAnswers(plantilla, respuestas),
            pregunta: (param) => `¿En qué país se situa la atracción turística "${param}"?`,
            filtro: { pais: { $exists: true }, monumento: { $exists: true } },
            filtro_decoys: (answer) => { return { monumento: { $exists: true }, pais: { $exists: true, $ne: answer.pais} }},
            campo_pregunta: 'monumento',
            campo_respuesta: 'pais'
        },
        {   // 5: Paises, Monumentos
            modelo: Monumento,
            generateMethod: (plantilla, respuestas) => this.generateQuestionNonDuplicatedAnswers(plantilla, respuestas),
            pregunta: (param) => `¿Cuál de las siguientes atraccioones turísticas se encuentra en ${param}?`,
            filtro: { pais: { $exists: true }, monumento: { $exists: true } },
            filtro_decoys: (answer) => { return { monumento: { $exists: true }, pais: { $exists: true, $ne: answer.pais} }},
            campo_pregunta: 'pais',
            campo_respuesta: 'monumento'
        },
        {   // 6: Quimica
            modelo: Elemento,
            generateMethod: (plantilla, respuestas) => this.generateQuestion1to1Relation(plantilla, respuestas),
            pregunta: (param) => `¿Cuál es el símbolo químico del ${param}?`,
            filtro: { elemento: { $exists: true }, simbolo: { $exists: true } },
            campo_pregunta: 'elemento',
            campo_respuesta: 'simbolo'
        },
        {   // 7: Quimica
            modelo: Elemento,
            generateMethod: (plantilla, respuestas) => this.generateQuestion1to1Relation(plantilla, respuestas),
            pregunta: (param) => `¿Qué elemento químico representa el símbolo "${param}"?`,
            filtro: { elemento: { $exists: true }, simbolo: { $exists: true } },
            campo_pregunta: 'simbolo',
            campo_respuesta: 'elemento'
        },
        {   // 8: Peliculas
            modelo: Pelicula,
            generateMethod: (plantilla, respuestas) => this.generateQuestionNonDuplicatedAnswers(plantilla, respuestas),
            pregunta: (param) => `¿Quién fue el director de la película "${param}"?`,
            filtro: { pelicula: { $exists: true }, director: { $exists: true } },
            filtro_decoys: (answer) => { return { pelicula: { $exists: true }, director: { $exists: true, $ne: answer.director} }},
            campo_pregunta: 'pelicula',
            campo_respuesta: 'director'
        },
        {   // 9: Peliculas
            modelo: Pelicula,
            generateMethod: (plantilla, respuestas) => this.generateQuestionNonDuplicatedAnswers(plantilla, respuestas),
            pregunta: (param) => `¿Cuál de estas películas ha sido dirigida por "${param}"?`,
            filtro: { pelicula: { $exists: true }, director: { $exists: true } },
            filtro_decoys: (answer) => { return { pelicula: { $exists: true }, director: { $exists: true, $ne: answer.director} }},
            campo_pregunta: 'director',
            campo_respuesta: 'pelicula'
        },
        {   // 10: Canciones
            modelo: Cancion,
            generateMethod: (plantilla, respuestas) => this.generateQuestionNonDuplicatedAnswers(plantilla, respuestas),
            pregunta: (param) => `¿Quién canta la canción "${param}"?`,
            filtro: { cancion: { $exists: true }, artista: { $exists: true } },
            filtro_decoys: (answer) => { return { cancion: { $exists: true }, artista: { $exists: true, $ne: answer.artista} }},
            campo_pregunta: 'cancion',
            campo_respuesta: 'artista'
        },
        {   // 11: Canciones
            modelo: Cancion,
            generateMethod: (plantilla, respuestas) => this.generateQuestionNonDuplicatedAnswers(plantilla, respuestas),
            pregunta: (param) => `¿Cuál de las siguientes canciones es interpretada por "${param}"?`,
            filtro: { cancion: { $exists: true }, artista: { $exists: true } },
            filtro_decoys: (answer) => { return { cancion: { $exists: true }, artista: { $exists: true, $ne: answer.artista} }},
            campo_pregunta: 'artista',
            campo_respuesta: 'cancion'
        }
        // {
        //     modelo: Pais,
        //     generateMethod: (plantilla, respuestas) => this.generateQuestionNonDuplicatedAnswers(plantilla, respuestas),
        //     pregunta: (param) => `¿Qué lengua se habla en ${param}?`,
        //     filtro: { pais: { $exists: true }, lenguaje: { $exists: true } },
        //     filtro_decoys: (answer) => { return { pais: { $exists: true }, lenguaje: { $exists: true, $ne: answer} }},
        //     campo_pregunta: 'pais',
        //     campo_respuesta: 'lenguaje'
        // },
        // {
        //     pregunta: (param) => `¿Cuál es la bandera de ${param}?`,
        //     filtro: { bandera: { $exists: true } },
        //     campo_pregunta: 'pais',
        //     campo_respuesta: 'bandera'
        // }
    ];

    static getAvailableTopics(){
        return [ ...this.temas.keys() ];
    }


    static async generateQuestionNonDuplicatedAnswers(plantilla, respuestas) {
        const randomAnswer = await plantilla.modelo.aggregate([
            { $match: plantilla.filtro },
            { $sample: { size: 1 } }
        ]);
        if (randomAnswer.length < 1) {
            console.error(`Not enought data found to generate a question`);
            throw new Error(`Not enought data found to generate a question`);
        }
        let randomDecoys = [];
        if (respuestas > 1){
            randomDecoys = await plantilla.modelo.aggregate([
                { $match: plantilla.filtro_decoys(randomAnswer[0]) },
                { $sample: { size: respuestas-1 } }
            ]);
        }
        if (randomDecoys.length < respuestas-1) {
            console.error(`Not enought data found to generate a question`);
            throw new Error(`Not enought data found to generate a question`);
        }

        const retQuestion = {
            pregunta: plantilla.pregunta(randomAnswer[0][plantilla.campo_pregunta]),
            respuesta_correcta: randomAnswer[0][plantilla.campo_respuesta],
            respuestas_incorrectas: Array.from({ length: respuestas-1 }, (_, i) => randomDecoys[i][plantilla.campo_respuesta])
        };
        return retQuestion;
    }

    static async generateQuestion1to1Relation(plantilla, respuestas) {

        const randomDocs = await plantilla.modelo.aggregate([
            { $match: plantilla.filtro },
            { $sample: { size: respuestas } }
        ]);
        if (randomDocs.length < respuestas) {
            console.error(`Not enought data found to generate a question`);
            throw new Error(`Not enought data found to generate a question`);
        }

        const retQuestion = {
            pregunta: plantilla.pregunta(randomDocs[0][plantilla.campo_pregunta]),
            respuesta_correcta: randomDocs[0][plantilla.campo_respuesta],
            respuestas_incorrectas: Array.from({ length: respuestas-1 }, (_, i) => randomDocs[i+1][plantilla.campo_respuesta])
        };
        return retQuestion;
    }

    static async generateQuestions(preguntas, respuestas, temas) {
        const plantillasDisponibles = this.getAvailableTemplates(temas);
        let retQuestions = [];
        for (let i = 0; i < preguntas; i++) {
            let index = Math.floor(Math.random() * plantillasDisponibles.length);
            let plantilla = this.plantillas[plantillasDisponibles[index]];
            retQuestions.push(await plantilla.generateMethod(plantilla, respuestas));
        }
        console.log("\nPreguntas generadas:");
        console.log(retQuestions);
        return retQuestions;
    }

    static getAvailableTemplates(temas) {
        if (temas.length == 0) {
            return Array.from({ length: this.plantillas.length }, (_, i) => i);
        }
        let templates = [];
        console.log("Temas a utilizar:")
        temas.forEach(tema => {
            if (this.temas.has(tema)) {
                templates = templates.concat(this.temas.get(tema));
                console.log(`\t${tema}`);
            }
            else {
                console.error(`\tThe topic '${tema}' is not currently defined`);
            }
        });
        if (templates.length == 0) {
            console.error(`No correct topics were passed`);
            throw new Error(`No correct topics were passed`);
        }
        console.log("Plantillas a utilizar:");
        console.log(`\t${[...new Set(templates)]}`);
        return [...new Set(templates)];
    }

}

module.exports = {
    QuestionGenerator
};