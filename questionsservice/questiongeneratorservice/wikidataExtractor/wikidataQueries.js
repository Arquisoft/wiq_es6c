const wikidata = require("./wikidataConnexion");

class WikiQueries {

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
        return results;
    }

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
}


module.exports = WikiQueries