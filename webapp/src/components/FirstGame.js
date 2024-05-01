import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, LinearProgress} from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import { Footer } from './footer/Footer';
import { Nav } from './nav/Nav';
import { gameStore } from './Util';

let currentQuestionIndex = 0;

let haveFailedQuestion = false; 
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';
let isCorrect = false
let questions = [];
let points = 0;
let load = true;
const previousBackgroundColor = '#1a1a1a'

const Quiz = () => {
  let username = localStorage.getItem("username")
  const navigator = useNavigate();
  let allQuestions = useLocation().state.questions;
  let haveEnter = false;
  let id = useLocation().state.gameId;
  console.log(id)

  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(storedInt);
  // const [isCorrect, setIsCorrect] = useState(false);
  const [remTime, setRemTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const time = setInterval(() => {
      setRemTime((progress) => {
        if(progress === 100){
          checkAnswer(-1);
          setTotalTime(totalTime + progress/10)
          return 0; 
        }
        const diff = 4;
        return load? Math.min(progress + diff, 100) : progress;
      });
    }, 400);

    return () => {
      clearInterval(time);
    };
  });

  const esperar = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  function changeButtons(param) {
    let borders = document.getElementsByClassName("border");;
    for(let i = 0; i < Math.min(borders.length, allQuestions[0].options.length); i++) {
      borders[i].setAttribute("data-disabled", param)
    }
  }

  const checkAnswer = async (option) => {
    if (haveEnter) {
      return
    }
    load = false
    
    isCorrect = (option === allQuestions[currentQuestionIndex].correctAnswer);

    changeButtons("true")
    
    const numberAnswer = allQuestions[currentQuestionIndex].options.indexOf(allQuestions[currentQuestionIndex].correctAnswer)
    const botonCorrecta = document.getElementById('option-' + numberAnswer)
    botonCorrecta.style.backgroundColor = 'green' 
    if (option < 0 && !haveEnter) {
      haveEnter = true
      questions.push({
        title: allQuestions[currentQuestionIndex].question,
        answers: allQuestions[currentQuestionIndex].options,
        ansIndex: [-1, numberAnswer]
      })
      
      await esperar(2000)
      currentQuestionIndex = (currentQuestionIndex + 1);
      botonCorrecta.style.backgroundColor = previousBackgroundColor
      changeButtons("false")
      
      haveFailedQuestion = false;
      load = true
      haveEnter = false

      if (currentQuestionIndex === allQuestions.length ) {
        gameStore(id, username, points, questions, totalTime/questions.length)
        points = 0
        navigator('/menu')
      }
      return

    }
    const botonIncorrecta = document.getElementById('option-' + allQuestions[currentQuestionIndex].options.indexOf(option))

    if (!isCorrect) {
      botonIncorrecta.style.backgroundColor = 'red'
    } else {
      points = points += 100;
    }
    
    
    // Pasar a la siguiente pregunta después de responder
    let indexAnswers = [allQuestions[currentQuestionIndex].options.indexOf(option), numberAnswer]

    questions.push({
        title: allQuestions[currentQuestionIndex].question,
        answers: allQuestions[currentQuestionIndex].options,
        ansIndex: indexAnswers
      }
    )
    await esperar(2000); // Espera 2000 milisegundos (2 segundos)
    
    botonIncorrecta.style.backgroundColor = botonCorrecta.style.backgroundColor = previousBackgroundColor
    
    if (allQuestions.length-1 !== currentQuestionIndex) {
      currentQuestionIndex = (currentQuestionIndex + 1);
    } else {
      haveFailedQuestion = true
    }

    isCorrect = (false)
    await setTotalTime(totalTime + remTime/10)
    setRemTime(0)
        
    load = true
    changeButtons("false")
    if(haveFailedQuestion) {
      await gameStore(id, username, points, questions, totalTime/questions.length)
      questions = []
      points = 0
      haveFailedQuestion = false;
      currentQuestionIndex += 1
      navigator('/menu')
    }
  };

  return (
    <>
      <Nav />
      <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>

        <div className="questionStructure">

          <div class="questionFirstGame">

            <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
              {allQuestions[currentQuestionIndex].question}
            </Typography>

          </div>

          <div class="allAnswers">
            {allQuestions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} >
                <Button
                  id={`option-${index}`}
                  name="quiz"
                  value={option}
                  onClick={() => checkAnswer(option)}
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

export default Quiz;