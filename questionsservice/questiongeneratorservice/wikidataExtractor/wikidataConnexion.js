async function consulta(query) {
    const apiUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;
    console.log(query)
    const respuesta = await fetch(apiUrl, {
        headers: {
            'User-Agent': 'QuestionCrawler/1.0',
            'Accept': 'application/json'
        }
    });
    // console.log(apiUrl)
    // console.log(respuesta)
    if (!respuesta.ok) {
        console.error('Error al realizar la consulta a Wikidata:', respuesta.statusText);
        return;
    }

    const datos = await respuesta.json();

    const resultados = [];

    for (const resultado of datos.results.bindings) {
        const resultadoFormateado = {};
        for (const clave in resultado) {
            resultadoFormateado[clave] = resultado[clave].value;
        }
        resultados.push(resultadoFormateado);
    }

    return resultados;
}

module.exports = {consulta}
