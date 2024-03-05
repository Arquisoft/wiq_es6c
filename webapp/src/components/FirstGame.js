import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import './FirstGame.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { json } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


var questionsCalled = false

const Quiz = () => {
  
  const questions = useLocation().state.questions;
  console.log(questions)

  //  useEffect (() => {
  //   if (!isApiCalledRef) {
  //     getQuestions();
  //     isApiCalledRef = true;
  //   }
  // }, []); // Dependencia vacía para ejecutar solo al montar el componente

  // const getQuestions = async () => {
  //   try {
  //     const response = await axios.get(`${apiEndpoint}/questions`);
  //     for (var i = 0; i < response.data.length; i++) {
  //       var possibleAnswers = [response.data[i].respuesta_correcta, response.data[i].respuestas_incorrectas[0], response.data[i].respuestas_incorrectas[1], response.data[i].respuestas_incorrectas[2]]
  //       possibleAnswers = shuffleArray(possibleAnswers)
  //       console.log(possibleAnswers)
  //       questions.push({
  //         question: response.data[0].pregunta,
  //         options: possibleAnswers,
  //         correctAnswer: response.data[i].respuesta_correcta
  //       })
  //     }
  //     console.log(questions)
      
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const getQuestions = async() => {
  //   try {
  //     jsonApi = await axios.get(`${apiEndpoint}/questions`);
        
  //   } catch (error) {
  //     console.log(error.jsonApi.data.error);
  //   }
  // };
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const esperar = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  function CircularProgress(valorInicial) {
    const [percentage, setPercentage] = useState(valorInicial);

    useEffect(() => {
      const intervalId = setInterval(() => {
        if (percentage <= 0) {
          clearInterval(intervalId); // Detener el intervalo
          return 0; // Mantener percentage en 0
        } else {
          setPercentage(prevPercentage => prevPercentage - 1); // Actualizar el estado con el nuevo porcentaje
        }
      }, 100); // Intervalo de 100 milisegundos (0.1 segundo)
  
      // Limpiar el intervalo cuando el componente se desmonte
      return () => clearInterval(intervalId);
    }, []); // La dependencia vacía asegura que useEffect solo se ejecute una vez al montar el componente
    
    var listaDevolver = [<CircularProgressbar value={percentage}/>, percentage]
    return (
        listaDevolver
    );
  }

  // const [MiCircularProgressbar, MiPercentage] = CircularProgress(100);

  // useEffect(() => {
  //   if (MiPercentage === 0) {
  //     // Realizar alguna acción cuando MiPercentage llegue a 0
  //   }
  // }, [MiPercentage]); // Este efecto se ejecuta cada vez que 'MiPercentage' cambia


  const checkAnswer = async (option) => {
    setIsCorrect(option === questions[currentQuestionIndex].correctAnswer);
    setSelectedOption(option);

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

    
  };

  return (
    <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
      <div className="questionStructure">
        <div class="question">
        <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          {questions[currentQuestionIndex].question}
        </Typography>
        </div>
        
        <div class="progressBar">
          {/* {MiCircularProgressbar} */}
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
      </div>
      {/* {isCorrect !== null && (
        <p>{isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta.'}</p>
      )} */}
    </Container>
  );
};

export default Quiz;
