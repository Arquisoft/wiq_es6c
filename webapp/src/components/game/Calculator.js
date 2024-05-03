import React, { useEffect, useState } from 'react';
import { shuffleArray, secureRandomNumber, esperar, gameStore} from '../Util';
import { Container, Typography, Box, LinearProgress } from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';
import Button from '../Button';
import { useLocation, useNavigate } from 'react-router-dom';


let load = true;
const previousBackgroundColor = '#1a1a1a';
// let questions = []
// let answeredQuestions = []

const Calculator = () => {

    let username = localStorage.getItem("username")
    const [questionIndex, setQuestionIndex] = useState(0);
    let id;
    let idTest = 'asdsdfsadgf';
    let state = useLocation().state;   


    if( state !== null) {
        id = state.gameId;
    }    
    else {
        id = idTest
    }
    const navigator = useNavigate();

    const [questions] = useState([])
    const [answeredQuestions] = useState([])
    const [points, setPoints] = useState(0)
    const [remTime, setRemTime] = useState(0);

    if(questions.length === 0)
        generateQuestion();

    useEffect(() => {
        const time = setInterval(() => {
        setRemTime((progress) => {
            if(progress === 100){

                let avgtime = 80/questions.length
                if (answeredQuestions.length !== 0) {
                    gameStore(id, username, points, answeredQuestions, avgtime);
                }
                init();
                
                navigator('/menu')
                return 0; 
            }
            const diff = 0.5;
            return load? Math.min(progress + diff, 100) : progress;
        });
        }, 400);

        return () => {
        clearInterval(time);
        };
    });

    function init(){
    }

    function generateQuestion() {
        let num1 = secureRandomNumber(10) + 1;
        let num2 = secureRandomNumber(10) + 1;

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
            default: break;
        }
    
        const option = [correctAnswer];
        while (option.length < 4) {
            const op = secureRandomNumber(100) + 1;
            if (!option.includes(op)) {
                option.push(op);
            }
        }
    
        let shuffled = shuffleArray(option);
        questions.push(
            {
                q: `${num1} ${operator} ${num2}`,
                options: shuffled,
                correctAnswer: correctAnswer
            }
        );
    }


    const handleOptionClick = async (selectedAnswer) => {
        load = false;
        const numberAnswer = questions[questionIndex].options.indexOf(questions[questionIndex].correctAnswer);
        const choiceNumber = questions[questionIndex].options.indexOf(selectedAnswer);

        const botonCorrecta = document.getElementById('option-' + numberAnswer);
        let botonIncorrecta = null;
        botonCorrecta.style.backgroundColor = 'green';

        storeQuestion(questions[questionIndex].q, questions[questionIndex].options, [choiceNumber, numberAnswer]);
        if (selectedAnswer !== questions[questionIndex].correctAnswer) {
            botonIncorrecta = document.getElementById('option-' + questions[questionIndex].options.indexOf(selectedAnswer));
            botonIncorrecta.style.backgroundColor = 'red';
        } else {
            await setPoints(points + 100);
        }

        generateQuestion();

        await esperar(2000);

        setQuestionIndex(questionIndex+1);

        botonCorrecta.style.backgroundColor = previousBackgroundColor;
        if(botonIncorrecta != null){
            botonIncorrecta.style.backgroundColor = previousBackgroundColor;
        }

        load = true;
    };

    function storeQuestion(title, answers, ansIndex){
        answeredQuestions.push({
            title: title,
            answers: answers,
            ansIndex: ansIndex
        });
    }
    
  
    return (
        <>
          <Nav />
          <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
      
            <div className="questionStructure">
      
              {questions && questions.length > questionIndex && questions[questionIndex].q && (
                <div className="questionCalculator">
      
                  <Typography id="questionText" className="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                    {questions[questionIndex].q}
                  </Typography>
      
                </div>
              )}
      
              {questions && questions.length > questionIndex && questions[questionIndex].options && (
                <div className="allAnswers">
                  {questions[questionIndex].options.map((option, index) => (
                    <div key={index} >
                      <Button
                        id={`option-${index}`}
                        value={option}
                        onClick={() => handleOptionClick(option)}
                        text={option}
                      />
                    </div>
                  ))}
                </div>
              )}
      
            </div>
      
            <Box sx={{ 
                width: '100%',
                padding: 3}}>
      
                <LinearProgress id='progress' color="secondary" variant={"determinate"} value={remTime} />
      
            </Box>
      
          </Container>
          <Footer />
        </>
      );
  };
  
  export default Calculator;