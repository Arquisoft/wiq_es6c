import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, LinearProgress} from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import { Footer } from './footer/Footer';
import { Nav } from './nav/Nav';
import { gameStore } from './Util';

let haveFailedQuestion = false; 
let isCorrect = false

let load = true;
const previousBackgroundColor = '#3b3b3b'
// let points = 0;

const Quiz = () => {

  let username = localStorage.getItem("username")
  const navigator = useNavigate();
  let allQuestions = useLocation().state.questions;
  let haveEnter = false;
  let id = useLocation().state.gameId;

  const [questions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remTime, setRemTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const time = setInterval(() => {
      setRemTime((progress) => {
        if(progress === 100){
          checkAnswer(-1);
          setTotalTime(totalTime + (10-progress/10))
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
      await questions.push({
        title: allQuestions[currentQuestionIndex].question,
        answers: allQuestions[currentQuestionIndex].options,
        ansIndex: [-1, numberAnswer]
      })
      
      await esperar(2000)
      await setCurrentQuestionIndex(currentQuestionIndex + 1);
      botonCorrecta.style.backgroundColor = previousBackgroundColor
      changeButtons("false")
      
      haveFailedQuestion = false;
      load = true
      haveEnter = false

      if (currentQuestionIndex === allQuestions.length ) {
        let points = 0;
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].ansIndex[0] === questions[i].ansIndex[1] ) {
            points += 100
          }
        }
        await gameStore(id, username, points, questions, totalTime/questions.length)
        // points = 0;
        navigator('/menu')
      }
      return

    }
    const botonIncorrecta = document.getElementById('option-' + allQuestions[currentQuestionIndex].options.indexOf(option))

    if (!isCorrect) {
      botonIncorrecta.style.backgroundColor = 'red'
    } else {
      // points += 100
    }
        
    // Pasar a la siguiente pregunta después de responder
    let indexAnswers = [allQuestions[currentQuestionIndex].options.indexOf(option), numberAnswer]

    await questions.push({
        title: allQuestions[currentQuestionIndex].question,
        answers: allQuestions[currentQuestionIndex].options,
        ansIndex: indexAnswers
      }
    )
    await esperar(2000); // Espera 2000 milisegundos (2 segundos)
    
    botonIncorrecta.style.backgroundColor = botonCorrecta.style.backgroundColor = previousBackgroundColor
    
    if (allQuestions.length-1 !== currentQuestionIndex) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      haveFailedQuestion = true
    }

    isCorrect = (false)
    await setTotalTime(totalTime + remTime/10)
    setRemTime(0)
        
    load = true
    changeButtons("false")
    if(haveFailedQuestion) {
      let points = 0;
        for (let j = 0; j < questions.length; j++) {
          if (questions[j].ansIndex[0] === questions[j].ansIndex[1] ) {
            points += 100
          }
        }
      await gameStore(id, username, points, questions, totalTime/questions.length)
      haveFailedQuestion = false;
      // points = 0;
      navigator('/menu')
    }
  };

  return (
    <>
      <Nav />
      <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
  
        <div className="questionStructure">
          {allQuestions && allQuestions.length > currentQuestionIndex && (
            <>
              <div className="questionFirstGame">
                <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                  {allQuestions[currentQuestionIndex].question}
                </Typography>
              </div>
  
              <div className="allAnswers">
                {allQuestions[currentQuestionIndex].options && allQuestions[currentQuestionIndex].options.map((option, index) => (
                  <div key={index}>
                    <Button
                      id={`option-${index}`}
                      name="quiz"
                      value={option}
                      onClick={() => checkAnswer(option)}
                      text={option}
                    />
                  </div>
                ))}
              </div>
            </>
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

export default Quiz;