import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import './FirstGame.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CircularProgress from './CircularProgressBar';

const Quiz = () => {
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

  function ProgressComponent({ initialPercentage }) {
    const [percentage, setPercentage] = useState(initialPercentage);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        // Simulando un progreso que cambia dinámicamente
        const newPercentage = percentage < 100 ? percentage + 1 : 0;
        setPercentage(newPercentage);
      }, 100); // Cambia el progreso cada 100 milisegundos
  
      return () => clearInterval(intervalId);
    }, [percentage]); // El efecto se ejecuta cada vez que 'percentage' cambia
  }
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
          <CircularProgress defaultValue="100"/>
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
