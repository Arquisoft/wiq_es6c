import React, { useState, useEffect } from 'react';
import { shuffleArray, secureRandomNumber } from '../Util';
import { Container, Typography, Box, LinearProgress} from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';

const Calculator = () => {

    const [question, setQuestion] = useState(null);

    useEffect(() => {
        const newQuestion = generateQuestion();
        setQuestion(newQuestion);
    }, []);


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
    
        const options = [correctAnswer];
        while (options.length < 4) {
            const option = secureRandomNumber(100) + 1;
            if (!options.includes(option)) {
                options.push(option);
            }
        }
    
        shuffleArray(options);
        return {
            q: `${num1} ${operator} ${num2}`,
            options: options,
            correctAnswer: correctAnswer
        };
    }


    //CAMBIAR ESTO EN FUNCIÓN DE CÓMO QUERAMOS QUE SEA EL JUEGO
    const handleOptionClick = (selectedAnswer) => {
        if (selectedAnswer === question.correctAnswer) {
            alert('¡Respuesta correcta!');
        } else {
            alert('Respuesta incorrecta. ¡Inténtalo de nuevo!');
        }
        const newQuestion = generateQuestion();
        setQuestion(newQuestion);
    };
    
  
    return (
      <>
        <Nav />
        <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
  
            <div className="questionStructure">
  
                <div class="questionCalculator">
    
                <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                    {generateQuestion()}
                    {question.q}
                </Typography>
    
                </div>
    
                <div class="allAnswers">
                    {question.options.map((option, index) => (
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
  
            {/*
            <Box sx={{ 
                width: '100%',
                padding: 3}}>
    
                <LinearProgress id='progress'color="secondary" variant={"determinate"} value={remTime} />
            </Box>
            */}
  
        </Container>
        <Footer />
      </>
    );
  };
  
  export default Calculator;