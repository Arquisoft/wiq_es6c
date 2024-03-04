import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import './FirstGame.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

const apiEndpoint = 'http://localhost:8006';

var jsonApi = ''


const Quiz = () => {
  
  const getQuestions = async() => {
    try {
      jsonApi = await axios.get(`${apiEndpoint}/questions`);
        
    } catch (error) {
      console.log(error.jsonApi.data.error);
    }
  };
  

  const questions = [    
    {
      question: '¿Cuál es la capital de España?',
      options: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
      correctAnswer: 'Madrid',
    },
    {
      question: '¿Cual es la capital de Francia?',
      options: ['Touluse', 'Paris', 'Lyon', 'Marseille'],
      correctAnswer: 'Paris'
    }
    // Agrega más preguntas aquí
  ];

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

  const [MiCircularProgressbar, MiPercentage] = CircularProgress(100);

  // useEffect(() => {
  //   if (MiPercentage === 0) {
  //     // Realizar alguna acción cuando MiPercentage llegue a 0
  //   }
  // }, [MiPercentage]); // Este efecto se ejecuta cada vez que 'MiPercentage' cambia


  const checkAnswer = async (option) => {
    setIsCorrect(option === questions[currentQuestionIndex].correctAnswer);
    setSelectedOption(option);

    getQuestions()
    console.log(jsonApi.data)

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
    console.log(questions.length-1)
    console.log(currentQuestionIndex)
    if (questions.length-1 !== currentQuestionIndex) {
      
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }

    
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ marginTop: 4 }}>
      
      
      <div className="questionStructure">
        <div class="question">
        <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          {questions[currentQuestionIndex].question}
        </Typography>
        </div>
        
        <div class="progressBar">
          {MiCircularProgressbar}
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
