import { WBK } from 'wikibase-sdk'

class WikidataExtractor{

    constructor(){
        this.wbk = WBK({
            instance: "https://www.wikidata.org",
            sparqlEndpoint: "https://query.wikidata.org/sparql"
        })
        
        this.requestInfo = {
            method: "GET",
            headers: 
            {
                "Accept" : "application/sparql-results+json",
                "User-Agent" :                     
                    "bot: Automated data fetching for question making/0.1 " + 
                    "(https://github.com/Arquisoft/wiq_es6c; UO283642@uniovi.es) " +
                    "wikibase-sdk/9.2.4",
                "Content-Type" : "application/x-www-form-urlencoded"
            }
        }
    }

    executeQueries(queries){
        data = new Array();

        queries.array.forEach(query => {
            data.push(this.executeQuery(q).then(result => { return result; }));
        });

        return data;
    }

    /**
     * Sends the query to be executed to the Wikidata SPARQL endpoint, and retrieves the result.
     * (configured to receive JSON) 
     * @param {*} query  
     * @returns promise that holds the result. 
     */
    executeQuery(query){

        const url = this.wbk.sparqlQuery(query);

        //When the query is too large for GET, the petition can be made using POST.
        //const [url, body] = this.wbk.sparqlQuery(query).split('?');
        
        return fetch(url, this.requestInfo)
            .then((response) => {
                if (response.ok) {
                    return response.json().catch((err) => {
                        console.log(err);
                    }) 
                } else {
                    console.log(response.status, response.statusText);
                    console.log("HTTP failure");
                }
            })
            .then(this.wbk.simplify.sparqlResults)
            .catch(function (error) {
                console.log("Fetch failure:" + error.message);
            });
    }
}