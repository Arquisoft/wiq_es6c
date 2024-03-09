import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { json } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Importa useHistory

const apiEndpoint = 'http://localhost:8007';

var jsonApi = ''

var isApiCalledRef = false;


const DatosContext = React.createContext();

var questions = []

function shuffleArray(array) {
  // Crea una copia del array original
  const shuffledArray = [...array];

  // Recorre el array desde el último elemento hasta el primero
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Genera un índice aleatorio entre 0 y el índice actual
    const randomIndex = Math.floor(Math.random() * (i + 1));

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

    const [n_preguntas, setn_preguntas] = useState(5);

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
            setn_preguntas(5)
          const response = await axios.get(`${apiEndpoint}/questions?n_preguntas=${n_preguntas}`);
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
        </Container>
    );

}


export default Menu;
