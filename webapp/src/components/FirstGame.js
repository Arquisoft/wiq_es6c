import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, LinearProgress} from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
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
const previousBackgroundColor = '#1a1a1a'


const Quiz = () => {

  const navigator = useNavigate();
  var allQuestions = useLocation().state.questions;
  var haveEnter = false
  var id = useLocation().state.gameId;
  console.log(id)

  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(storedInt);
  // const [isCorrect, setIsCorrect] = useState(false);
  const [remTime, setRemTime] = useState(0);

  useEffect(() => {
    const time = setInterval(() => {
      setRemTime((progress) => {
        if(progress === 100){
          checkAnswer(-1);
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

  const checkAnswer = async (option) => {
    if (haveEnter) {
      return
    }
    load = false
    

    console.log("Todas las preguntas", allQuestions)
    // console.log(option === questions[currentQuestionIndex].correctAnswer)
    isCorrect = (option === allQuestions[currentQuestionIndex].correctAnswer);

    changeButtons("true")
    // changeButtons(true);
    
    const numberAnswer = allQuestions[currentQuestionIndex].options.indexOf(allQuestions[currentQuestionIndex].correctAnswer)
    const botonCorrecta = document.getElementById('option-' + numberAnswer)
    botonCorrecta.style.backgroundColor = 'green' 
    console.log("Antes de entrar al if", option)
    if (option < 0 && !haveEnter) {
      haveEnter = true
      console.log("Me va a dar un telele")
      questions.push({
        title: allQuestions[currentQuestionIndex].question,
        answers: allQuestions[currentQuestionIndex].options,
        ansIndex: [-1, numberAnswer]
      })
      
      await esperar(2000)
      console.log(option)
      currentQuestionIndex = (currentQuestionIndex + 1);
      botonCorrecta.style.backgroundColor = previousBackgroundColor
      changeButtons("false")
      await gameStore()
      haveFailedQuestion = false;
      load = true
      navigator('/menu')
      return
    }

   
    const botonIncorrecta = document.getElementById('option-' + allQuestions[currentQuestionIndex].options.indexOf(option))

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
      getQuestions()
      points = points += 100;
    }
    
    
    // Pasar a la siguiente pregunta después de responder
    var indexAnswers = [allQuestions[currentQuestionIndex].options.indexOf(option), numberAnswer]

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
        
    load = true
    changeButtons("false")
    console.log(haveFailedQuestion)
    if(haveFailedQuestion) {
      console.log("Entramos a guardar el juego")
      await gameStore()
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

            {/*<LinearProgress color="secondary" variant={loading? "indeterminate" : "determinate"} value={remTime} />*/}
            <LinearProgress id='progress'color="secondary" variant={"determinate"} value={remTime} />

        </Box>

        
        {/* {isCorrect !== null && (
          <p>{isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta.'}</p>
        )} */}
      </Container>
      <Footer />
    </>
  );
};

export default Quiz;