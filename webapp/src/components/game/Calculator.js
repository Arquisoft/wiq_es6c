import React from 'react';
import { shuffleArray, secureRandomNumber } from '../Util';
import { Container, Typography } from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';
import Button from '../Button';

let questions = [];

const Calculator = () => {

    function generateQuestion() {
        const num1 = secureRandomNumber(10) + 1;
        const num2 = secureRandomNumber(10) + 1;
        const operator = ['+', '-', 'x', '÷'][secureRandomNumber(3)];
        let correctAnswer;
    
        switch (operator) {
            case '+':
                correctAnswer = num1 + num2;
                break;
            case '-':
                correctAnswer = num1 - num2;
                break;
            case 'x':
                correctAnswer = num1 * num2;
                break;
            case '÷':
                correctAnswer = Math.round(num1 / num2);
                break;
        }
    
        const option = [correctAnswer];
        while (option.length < 4) {
            const op = secureRandomNumber(100) + 1;
            if (!option.includes(op)) {
                option.push(op);
            }
        }
    
        shuffleArray(options);
        questions = [
            {
                q: `${num1} ${operator} ${num2}`,
                options: option,
                correctAnswer: correctAnswer
            }
        ];
    }


    //CAMBIAR ESTO EN FUNCIÓN DE CÓMO QUERAMOS QUE SEA EL JUEGO
    const handleOptionClick = (selectedAnswer) => {
        if (selectedAnswer === questions.correctAnswer) {
            alert('¡Respuesta correcta!');
        } else {
            alert('Respuesta incorrecta. ¡Inténtalo de nuevo!');
        }
        generateQuestion();

    };
    
  
    return (
      <>
        <Nav />
        <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
  
            <div className="questionStructure">
  
                <div class="questionCalculator">
    
                <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                    {generateQuestion()}
                    {questions[0].q}
                </Typography>
    
                </div>
    
                <div class="allAnswers">
                    {questions[0].options.map((option, index) => (
                        <div key={index} >
                        <Button
                            id={`option-${index}`}
                            value={option}
                            onClick={() => handleOptionClick(option)}
                            text={option}
                        />
                        </div>
                    )
                    )}
                </div>
            </div>
  
        </Container>
        <Footer />
      </>
    );
  };
  
  export default Calculator;