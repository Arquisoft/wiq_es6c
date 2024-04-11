import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, LinearProgress} from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import GoBackButton from './GoBackButton';
import { Footer } from './footer/Footer';
import { Nav } from './nav/Nav';
import {shuffleArray} from './Util'

var currentQuestionIndex = 0;

var haveFailedQuestion = false; 
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';
var isCorrect = false
var questions = [];
var points = 0;
var load = true;

const Quiz = () => {

  const navigator = useNavigate();
  var allQuestions = useLocation().state.questions;

  var id = useLocation().state.gameId;
  console.log(id)

  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(storedInt);
  // const [isCorrect, setIsCorrect] = useState(false);
  const [remTime, setRemTime] = useState(0);

  useEffect(() => {
    const time = setInterval(() => {
      setRemTime((progress) => {
        if(progress === 100){
          newQuestion();
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

  const getQuestions = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/gameUnlimitedQuestions`, { id });
      for (var i = 0; i < response.data.length; i++) {
        var possibleAnswers = [response.data[i].respuesta_correcta, response.data[i].respuestas_incorrectas[0], response.data[i].respuestas_incorrectas[1], response.data[i].respuestas_incorrectas[2]]
        possibleAnswers = shuffleArray(possibleAnswers)
        allQuestions.push({
          question: response.data[i].pregunta,
          options: possibleAnswers,
          correctAnswer: response.data[i].respuesta_correcta
        })
      }      
    } catch (error) {
      console.error(error);
    }
};
  function changeButtons(param) {
    console.log("Entramos aqui")
    var borders = document.getElementsByClassName("border");;
    for(var i = 0; i < Math.min(borders.length, allQuestions[0].options.length); i++) {
      borders[i].setAttribute("data-disabled", param)
    }
  }

  const gameStore = async () => {
    try {
      var username = localStorage.getItem("username")
      console.log(username)
      console.log(questions)
      const response = await axios.post(`${apiEndpoint}/storeGame`, { id, username,  points, questions});
      questions = []
      points = 0
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  const newQuestion = async () => {
    //Generamos las preguntas
    getQuestions()

    //Desactivamos botones
    changeButtons("true")

    //Marcamos la respuesta correcta
    const numberAnswer = allQuestions[currentQuestionIndex].options.indexOf(allQuestions[currentQuestionIndex].correctAnswer)
    const botonCorrecta = document.getElementById('option-' + numberAnswer)
    const previousBackgroundColor = '#1a1a1a'
    botonCorrecta.style.backgroundColor = 'green' 
    
    // Pasar a la siguiente pregunta después de responder
    var indexAnswers = [numberAnswer, null]

    questions.push({
        title: allQuestions[currentQuestionIndex].question,
        answers: allQuestions[currentQuestionIndex].options,
        ansIndex: indexAnswers
      }
    )
    load=false;
    await esperar(2000); // Espera 2000 milisegundos (2 segundos)
    botonCorrecta.style.backgroundColor = previousBackgroundColor
    if (allQuestions.length-1 !== currentQuestionIndex) {
      currentQuestionIndex = (currentQuestionIndex + 1);
    }
    isCorrect = (false)
    //setRemTime(0)
    load=true
        
    //Habilitamos botones
    changeButtons("false")
  }

  const checkAnswer = async (option) => {
    getQuestions()
    // console.log(option === questions[currentQuestionIndex].correctAnswer)
    isCorrect = (option === allQuestions[currentQuestionIndex].correctAnswer);

    changeButtons("true")
    // changeButtons(true);
    
    const botonIncorrecta = document.getElementById('option-' + allQuestions[currentQuestionIndex].options.indexOf(option))
    const previousBackgroundColor = botonIncorrecta.style.backgroundColor

    // console.log(haveFailedQuestion)
    // console.log(isCorrect)
    if (!isCorrect) {
      console.log("Entramos en el correct")
      // console.log(isCorrect)
      botonIncorrecta.style.backgroundColor = 'red'
      // console.log("Entramos a cambiar")
      haveFailedQuestion = true;
      // console.log("Despues de modificar los valores")
    } else {
      points = points += 100;
    }
    const numberAnswer = allQuestions[currentQuestionIndex].options.indexOf(allQuestions[currentQuestionIndex].correctAnswer)
    const botonCorrecta = document.getElementById('option-' + numberAnswer)
    botonCorrecta.style.backgroundColor = 'green' 
    
    // Pasar a la siguiente pregunta después de responder
    var indexAnswers = [numberAnswer, allQuestions[currentQuestionIndex].options.indexOf(option)]

    questions.push({
        title: allQuestions[currentQuestionIndex].question,
        answers: allQuestions[currentQuestionIndex].options,
        ansIndex: indexAnswers
      }
    )

    await esperar(2000); // Espera 2000 milisegundos (2 segundos)
    botonIncorrecta.style.backgroundColor = previousBackgroundColor
    botonCorrecta.style.backgroundColor = previousBackgroundColor
    if (allQuestions.length-1 !== currentQuestionIndex) {
      currentQuestionIndex = (currentQuestionIndex + 1);
    }
    isCorrect = (false)
    setRemTime(0)
        
    
    changeButtons("false")
    console.log(haveFailedQuestion)
    if(haveFailedQuestion) {
      console.log("Entramos a guardar el juego")
      await gameStore()
      haveFailedQuestion = false;
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

            {/*<LinearProgress color="secondary" variant={loading? "indeterminate" : "determinate"} value={remTime} />*/}
            <LinearProgress id='progress'color="secondary" variant={"determinate"} value={remTime} />

        </Box>

        <GoBackButton/>
        
        {/* {isCorrect !== null && (
          <p>{isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta.'}</p>
        )} */}
      </Container>
      <Footer />
    </>
  );
};

export default Quiz;