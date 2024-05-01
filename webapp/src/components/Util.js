import axios from "axios";

function shuffleArray(array) {
    // Copia del array original
    const shuffledArray = [...array];

    // Recorrer el array desde el último elemento hasta el primero
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      // Genera un índice aleatorio entre 0 y el índice actual
      //const randomIndex = Math.floor(Math.random() * (i + 1));
      const randomIndex = secureRandomNumber(i + 1);

      // Intercambia el elemento actual con el elemento del índice aleatorio
      const temp = shuffledArray[i];
      shuffledArray[i] = shuffledArray[randomIndex];
      shuffledArray[randomIndex] = temp;
    }

  // Devuelve el array barajado
  return shuffledArray;
}

function secureRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

const esperar = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const generateGameId = async () => {
  try {
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';
    const response = await axios.get(`${apiEndpoint}/generateGame`)
    return response.data
  } catch(error) {
    console.error(error);
  }
}

async function gameStore(id, username, points, questions, avgtime) {
  try {
    
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';
    const response = await axios.post(`${apiEndpoint}/storeGame`, { id, username,  points, questions, avgtime});
    questions = []
  } catch (error) {
    console.error(error)
  }
}

export {esperar, shuffleArray, secureRandomNumber, generateGameId, gameStore}