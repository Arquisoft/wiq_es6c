import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import './FirstGame.css';

const Quiz = () => {
  const question = '¿Cuál es la capital de España?';
  const options = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'];
  const correctAnswer = 'Madrid';

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);


  const checkAnswer = () => {
    setIsCorrect(selectedOption === correctAnswer);
  };

  return (
    
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      <div class="questionStructure">
      <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
        {question}
      </Typography>
      {options.map((option, index) => (
        <div key={index} class="answers">
          <button
            id={`option-${index}`}
            name="quiz"
            value={option}
            onClick={checkAnswer}
          >
            {option}
          </button>
        </div> 
      ))}
      </div>
      {isCorrect !== null && (
        <p>{isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta.'}</p>
      )}
    </Container>
  );
};

export default Quiz;
