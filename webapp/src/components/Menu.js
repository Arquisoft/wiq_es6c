import React, { useState } from 'react';
import { Container } from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useHistory

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';


var isApiCalledRef = false;


var questions = []

function secureRandomNumber(max) {
  const randomBytes = new Uint32Array(1);
  window.crypto.getRandomValues(randomBytes);
  return randomBytes[0] % max;
}

function shuffleArray(array) {
  // Crea una copia del array original
  const shuffledArray = [...array];

  // Recorre el array desde el último elemento hasta el primero
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

// useEffect (() => {
//     if (!isApiCalledRef) {
//       getQuestions();
//       isApiCalledRef = true;
//     }
//   }, []);




const Menu = () => {
    const navigation = useNavigate(); // Añade esto

    const initiateGame = async () => {
        if (!isApiCalledRef) {
            await getQuestions()
        }
        isApiCalledRef = true
        navigation("/firstGame", {state: {questions}})
    }

    const getQuestions = async () => {
        try {
          const response = await axios.get(`${apiEndpoint}/questions`);
          console.log(response.data.length)
          for (var i = 0; i < response.data.length; i++) {
            var possibleAnswers = [response.data[i].respuesta_correcta, response.data[i].respuestas_incorrectas[0], response.data[i].respuestas_incorrectas[1], response.data[i].respuestas_incorrectas[2]]
            possibleAnswers = shuffleArray(possibleAnswers)
            questions.push({
              question: response.data[i].pregunta,
              options: possibleAnswers,
              correctAnswer: response.data[i].respuesta_correcta
            })
          }      
        } catch (error) {
          console.error(error);
        }
        console.log(questions)
    };

    const openStoredQuestions = async () => {
      navigation("/appQuestion")
    }

    

    return (
        <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
            <p>Bienvenido a wiq_06c por favor seleccione un modo de juego para comenzar partida:</p>
            <button
              name="quiz"
              onClick={() => initiateGame()}
              style={{backgroundColor: 'lightgrey'}}
            >
              Clasico
            </button>
            <button
              name="openStoredQuestions"
              onClick={() => openStoredQuestions()}
              style={{backgroundColor: 'lightgrey'}}
            >
              Preguntas guardadas
            </button>
            


        </Container>
    );

}


export default Menu;
