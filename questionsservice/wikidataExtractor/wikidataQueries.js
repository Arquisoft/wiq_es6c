const wikidata = require("./wikidataConnexion");

class WikiQueries {

    static regExp = /^Q\d+$/; // Expresión regular para filtrar las etiquetas del tipo "Q1234"

    /* CIENCIA */

    static async obtenerSimboloQuimico() {
        const query = 
        `SELECT ?elementLabel ?symbol WHERE { 
            ?element wdt:P31 wd:Q11344. 
            ?element wdt:P246 ?symbol. 
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results.filter(function(element) {
            const elementOk = !WikiQueries.regExp.test(element.elementLabel);
            const symbolOk = !WikiQueries.regExp.test(element.symbol);
            return elementOk && symbolOk;
        });

    }


    /* GEOGRAFÍA */

    static async obtenerPaisYCapital() {
        const query = `
            SELECT ?countryLabel ?capitalLabel WHERE {
                ?country wdt:P31 wd:Q6256.
                ?country wdt:P36 ?capital.
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
            }
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results.filter(function(element) {
            const countryOk = !WikiQueries.regExp.test(element.countryLabel);
            const capitalOk = !WikiQueries.regExp.test(element.capitalLabel);
            return countryOk && capitalOk;
        });
    }

    static async obtenerPaisYBandera() {
        const query = `
        SELECT ?flag ?flagLabel ?countryLabel WHERE {
            ?country wdt:P31 wd:Q6256; 
                wdt:P41 ?flag. 
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
            }
            LIMIT 200
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;

    }

    static async obtenerPaisYLenguaje() {
        const query = `
        SELECT ?countryLabel ?languageLabel  WHERE {
            ?country wdt:P31 wd:Q6256.
            ?country wdt:P37 ?language.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
            }
            LIMIT 500
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;

    }

    static async obtenerMonumentoYPais(){
        const query = `
        SELECT ?preguntaLabel ?respuestaLabel WHERE {
            ?pregunta wdt:P31 wd:Q570116; wdt:P17 ?respuesta.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        } 
        LIMIT 200
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;

    }
    

    /* ENTRETENIMIENTO */ 

    static async obtenerPeliculasAñosYDirector() {
        const query = `
        SELECT ?peliculaLabel ?directorLabel ?fecha
            WHERE {
            ?pelicula wdt:P31 wd:Q11424.  # Filtramos por instancias de películas
            ?pelicula wdt:P577 ?fecha.    # Obtenemos la fecha de publicación
            ?pelicula wdt:P57 ?director.  # Obtenemos el director de la película
            FILTER (YEAR(?fecha) > 2000). # Filtramos por películas posteriores al 2000
            SERVICE wikibase:label { bd:serviceParam wikibase:language "es". }
            }
            LIMIT 2000
            `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;
    }

    static async obtenerMangaYFecha() {
        const query = `
            SELECT ?titulo ?fechaEstreno
            WHERE {
            ?obra wdt:P31/wdt:P279* wd:Q1107.  # Filtramos por instancias de "anime" o "manga"
            ?obra rdfs:label ?titulo.  # Obtenemos el título de la obra
            ?obra wdt:P580 ?fechaEstreno.  # Obtenemos la fecha de estreno
            FILTER (LANG(?titulo) = "es" || LANG(?titulo) = "en")  # Filtramos por títulos en español o inglés
            }
            LIMIT 2000
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;
    }

    static async obtenerCantanteYCancion() {
        const query = `
        SELECT ?song ?songLabel ?singer ?singerLabel
            WHERE {
                ?song wdt:P31 wd:Q7366; # Canción
                        wdt:P175 ?singer. # Cantante
                ?singer wdt:P27 wd:Q29. # Español
                MINUS {
                    ?song wdt:P175 ?anotherSinger.  # Quitamos canciones con más de un cantante
                    FILTER (?anotherSinger != ?singer)
                }
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            LIMIT 200
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;

    }

    static async obtenerAñoYGanadorF1(){
        const query = `
        SELECT ?year ?winnerLabel
        WHERE {
            wd:Q1968 wdt:P793 ?event.
            ?event wdt:P585 ?date.
            ?event wdt:P1346 ?winner.
            ?winner wdt:P31 wd:Q5.
            BIND(YEAR(?date) AS ?year)
            SERVICE wikibase:label { bd:serviceParam wikibase:language "es". }
        }
        ORDER BY ?year
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;

    }

    static async obtenerAñoYEquipoGanadorF1(){
        const query = `
        SELECT ?year ?winnerLabel
        WHERE {
            wd:Q1968 wdt:P793 ?event.
            ?event wdt:P585 ?date.
            ?event wdt:P1346 ?winner.
            ?winner wdt:P31 wd:Q10497835.
            BIND(YEAR(?date) AS ?year)
            SERVICE wikibase:label { bd:serviceParam wikibase:language "es". }
        }
        ORDER BY ?year
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;

    }


    /* ARTE */

    static async obtenerMonumentoYAñoDescubOAñoConst() {
        const query = `
            SELECT ?monumento ?titulo ?anioConstruccion ?anioDescubrimiento
            WHERE {
            ?monumento wdt:P31 wd:Q4989906.  # Filtramos por instancias de "monumento"
            ?monumento rdfs:label ?titulo.  # Obtenemos el título del monumento
            OPTIONAL { ?monumento wdt:P571 ?anioConstruccion. }  # Obtenemos el año de construcción (si está disponible)
            OPTIONAL { ?monumento wdt:P575 ?anioDescubrimiento. }  # Obtenemos el año de descubrimiento (si está disponible)
            FILTER ((LANG(?titulo) = "es" || LANG(?titulo) = "en") && (BOUND(?anioConstruccion) || BOUND(?anioDescubrimiento)))  # Al menos uno de los valores de año debe ser distinto de nulo
            }
            LIMIT 1000
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;

    }


    /* DEPORTE */

    static async obtenerJugadorYPais() { //País en el que juega
        const query = `
            SELECT ?playerLabel ?countryLabel
            WHERE {
            ?player wdt:P106 wd:Q3665646;
                    wdt:P54 ?team.
            ?team wdt:P31 wd:Q13393265;
                    wdt:P17 ?country.
            SERVICE wikibase:label {bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;

    }

    static async obtenerJugadorYDeporte() {
        const query = `
            SELECT ?personLabel ?sportLabel
            WHERE {
            ?person wdt:P101 ?trabajo.
            ?trabajo wdt:P31/wdt:P279* wd:Q31629.
            ?person wdt:P106 ?sport.
            
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;

    }

    static async obtenerEstadioYAñoFund() {
        const query = `
            SELECT DISTINCT ?estadioLabel ?fundacion
            WHERE {
            ?estadio wdt:P31 wd:Q483110 ;    # Instancia de estadio deportivo
                    wdt:P17 wd:Q29 ;         # Ubicado en España
                    wdt:P571 ?fechaInicio . # Fecha de inicio de la construcción
            BIND(YEAR(?fechaInicio) AS ?fundacion)
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            ORDER BY ?fundacion
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results;

    }

}


module.exports = WikiQueries