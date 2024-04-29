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

let savedGame = false;

const Calculator = () => {

    //let questionIndex = -1
    const [questionIndex, setQuestionIndex] = useState(0);

    const navigator = useNavigate();

    const [remTime, setRemTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    if(questions.length === 0)
        generateQuestion();

    useEffect(() => {
        const time = setInterval(() => {
        setRemTime((progress) => {
            if(progress === 100){
                console.log("Antes", totalTime)
                setTotalTime(totalTime + progress/10)
                console.log("Despues", totalTime)

                gameStore();

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

    const gameStore = async () => {
        try {
            var username = localStorage.getItem("username")
            console.log(username)
            console.log(answeredQuestions)
            console.log(totalTime)
            var avgtime = totalTime/answeredQuestions.length
            console.log(avgtime)
            const id = await generateGameId();
            if(!savedGame){
                savedGame = true;
                const response = await axios.post(`${apiEndpoint}/storeGame`, { id, username,  points, questions: answeredQuestions, avgtime});
                console.log(response)
            }
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
    
        let shuffled = shuffleArray(option);
        questions.push(
            {
                q: `${num1} ${operator} ${num2}`,
                options: shuffled,
                correctAnswer: correctAnswer
            }
        );
    }


    //CAMBIAR ESTO EN FUNCIÓN DE CÓMO QUERAMOS QUE SEA EL JUEGO
    const handleOptionClick = async (selectedAnswer) => {
        load = false;
        const numberAnswer = questions[questionIndex].options.indexOf(questions[questionIndex].correctAnswer);
        const choiceNumber = questions[questionIndex].options.indexOf(selectedAnswer);

        console.log(numberAnswer)
        console.log(choiceNumber)

        //console.log(numberAnswer)
        const botonCorrecta = document.getElementById('option-' + numberAnswer);
        let botonIncorrecta = null;
        botonCorrecta.style.backgroundColor = 'green';
        /*title: allQuestions[currentQuestionIndex].question,
        answers: allQuestions[currentQuestionIndex].options,
        ansIndex: indexAnswers*/
        storeQuestion(questions[questionIndex].q, questions[questionIndex].options, [choiceNumber, numberAnswer]);
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