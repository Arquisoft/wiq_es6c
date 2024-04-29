import React from 'react';
import { shuffleArray, secureRandomNumber } from '../Util';
import { Container, Typography } from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';
import Button from '../Button';
import {esperar} from '../Util';
import { useState } from 'react';

let questions = [];
const previousBackgroundColor = '#1a1a1a';

const Calculator = () => {

    //let questionIndex = -1
    const [questionIndex, setQuestionIndex] = useState(0);

    function generateQuestion() {
        let num1 = secureRandomNumber(10) + 1;
        let num2 = secureRandomNumber(10) + 1;

        console.log(questionIndex)
        
        num2 = secureRandomNumber(10) + 1;

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
    
        shuffleArray(option);
        questions.push(
            {
                q: `${num1} ${operator} ${num2}`,
                options: option,
                correctAnswer: correctAnswer
            }
        );
    }


    //CAMBIAR ESTO EN FUNCIÓN DE CÓMO QUERAMOS QUE SEA EL JUEGO
    const handleOptionClick = async (selectedAnswer) => {
        const numberAnswer = questions[questionIndex].options.indexOf(questions[questionIndex].correctAnswer);
        //console.log(numberAnswer)
        const botonCorrecta = document.getElementById('option-' + numberAnswer);
        let botonIncorrecta = null;
        botonCorrecta.style.backgroundColor = 'green';
        if (selectedAnswer !== questions[questionIndex].correctAnswer) {
            botonIncorrecta = document.getElementById('option-' + questions[questionIndex].options.indexOf(selectedAnswer));
            botonIncorrecta.style.backgroundColor = 'red';
        }

        generateQuestion();

        await esperar(2000);

        setQuestionIndex(questionIndex+1);

        botonCorrecta.style.backgroundColor = previousBackgroundColor;
        if(botonIncorrecta != null){
            botonIncorrecta.style.backgroundColor = previousBackgroundColor;
        }
    };
    
  
    return (
      <>
        <Nav />
        <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
  
            <div className="questionStructure">
  
                <div class="questionCalculator">
    
                <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                    {generateQuestion()}
                    {questions[questionIndex].q}
                </Typography>
    
                </div>
    
                <div class="allAnswers">
                    {questions[questionIndex].options.map((option, index) => (
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