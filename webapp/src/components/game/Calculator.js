import React from 'react';
import { shuffleArray, secureRandomNumber, generateGameId,esperar } from '../Util';
import { Container, Typography, Box, LinearProgress } from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';
import Button from '../Button';
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

let questions = [];
let load = true;
const previousBackgroundColor = '#1a1a1a';
let points = 0;
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';
let answeredQuestions = [];

const Calculator = () => {

    //let questionIndex = -1
    const [questionIndex, setQuestionIndex] = useState(0);

    const navigator = useNavigate();

    const [remTime, setRemTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    let id = generateGameId;

    if(questions.length === 0)
        generateQuestion();

    useEffect(() => {
        const time = setInterval(() => {
        setRemTime((progress) => {
            if(progress === 100){
                console.log("Antes", totalTime)
                setTotalTime(totalTime + progress/10)
                console.log("Despues", totalTime)

                //TODO: ALMACENAR JUEGO
                gameStore();

                return 0; 
            }
            const diff = 5;
            return load? Math.min(progress + diff, 100) : progress;
        });
        }, 400);

        return () => {
        clearInterval(time);
        };
    });

    const gameStore = async () => {
        try {
            var username = localStorage.getItem("username")
            console.log(username)
            console.log(answeredQuestions)
            console.log(totalTime)
            var avgtime = totalTime/answeredQuestions.length
            console.log(avgtime)
            const response = await axios.post(`${apiEndpoint}/storeGame`, { id, username,  points, questions: answeredQuestions, avgtime});
            console.log(response)
        } catch (error) {
            console.error(error)
        } finally {
            init();
            navigator('/menu')
        }
    }

    function init(){
        questions = [];
        points = 0;
        answeredQuestions = [];
    }

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
        answeredQuestions.push({
            pregunta: 'a',
            respuesta_correcta: 'a',
            respuestas_incorrectas: [
                'a',
                'a',
                'a'
            ]
        });
        if (selectedAnswer !== questions[questionIndex].correctAnswer) {
            
            botonIncorrecta = document.getElementById('option-' + questions[questionIndex].options.indexOf(selectedAnswer));
            botonIncorrecta.style.backgroundColor = 'red';
        } else {
            points += 100;
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

            <Box sx={{ 
                width: '100%',
                padding: 3}}>

                <LinearProgress id='progress'color="secondary" variant={"determinate"} value={remTime} />

            </Box>
  
        </Container>
        <Footer />
      </>
    );
  };
  
  export default Calculator;