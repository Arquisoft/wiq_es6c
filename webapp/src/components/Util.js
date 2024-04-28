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
    const randomBytes = new Uint32Array(1);
    window.crypto.getRandomValues(randomBytes);
    return randomBytes[0] % max;
}

export {shuffleArray, secureRandomNumber}