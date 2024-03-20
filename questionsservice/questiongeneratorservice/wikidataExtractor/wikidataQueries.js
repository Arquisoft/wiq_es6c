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
}









module.exports = WikiQueries