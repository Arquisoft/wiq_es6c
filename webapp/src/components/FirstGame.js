import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import './FirstGame.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { json } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Quiz = () => {
  const questions = useLocation().state.questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [isCorrect, setIsCorrect] = React.useState(null);

  const esperar = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

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
