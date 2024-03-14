import React from 'react';
import { Container, Typography } from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';


const apiEndpoint = 'http://localhost:8007';
const Quiz = () => {

  const navigation = useNavigate(); // Añade esto


  var questions = useLocation().state.questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [isCorrect, setIsCorrect] = React.useState(null);

  const esperar = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

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


  const getQuestions = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/questions?n_preguntas=${1}`);
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

  const checkAnswer = async (option) => {
    getQuestions()
    setIsCorrect(option === questions[currentQuestionIndex].correctAnswer);

    const botonIncorrecta = document.getElementById('option-' + questions[currentQuestionIndex].options.indexOf(option))
    if (!isCorrect) {
      botonIncorrecta.style.backgroundColor = 'red'
    }
    
    const numberAnswer = questions[currentQuestionIndex].options.indexOf(questions[currentQuestionIndex].correctAnswer)
    const botonCorrecta = document.getElementById('option-' + numberAnswer)
    botonCorrecta.style.backgroundColor = 'green' 
    // Pasar a la siguiente pregunta después de responder

    await esperar(2000); // Espera 2000 milisegundos (2 segundos)
    botonIncorrecta.style.backgroundColor = 'lightgrey'
    botonCorrecta.style.backgroundColor = 'lightgrey' 
    if (questions.length-1 !== currentQuestionIndex) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
    setIsCorrect(false)
    
    
  };

  const goBack = async () => {
    navigation('/menu')
  }

  return (
    <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
      <div className="questionStructure">
        <div class="questionFirstGame">
        <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          {questions[currentQuestionIndex].question}
        </Typography>
        </div>
        <div class="allAnswers">
        {questions[currentQuestionIndex].options.map((option, index) => (
          <div key={index} className="answers">
            <button
              id={`option-${index}`}
              name="quiz"
              value={option}
              onClick={() => checkAnswer(option)}
              style={{backgroundColor: 'lightgrey'}}
            >
              {option}
            </button>
          </div>
        )
        )}
        </div>
        <button
              name="openStoredQuestions"
              onClick={() => goBack()}
              style={{backgroundColor: 'lightgrey'}}
            >
              Volver al menu
            </button>
      </div>
      
      {/* {isCorrect !== null && (
        <p>{isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta.'}</p>
      )} */}
    </Container>
  );
};

export default Quiz;
