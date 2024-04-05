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

var currentQuestionIndex = 0;

var haveFailedQuestion = false; 
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';
var isCorrect = false
var questions = [];
var points = 0;

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
        if(progress == 100){
          checkAnswer("");
          return 0; 
        }
        // const diff = Math.random() * 10;
        // return Math.min(progress + diff, 100);

        const diff = crypto.getRandomValues(new Uint32Array(1))[0] % 11; // Generate a random number between 0 and 10
        return Math.min(progress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(time);
    };
  });

  const esperar = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  function secureRandomNumber(max) {
    const randomBytes = new Uint32Array(1);
    window.crypto.getRandomValues(randomBytes);
    return randomBytes[0] % max;
  }

  function shuffleArray(array) {
    // Crea una copia del array original
    const shuffledArray = [...array];
  
    // Recorre el array desde el último elemento hasta el primero
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      // Genera un índice aleatorio entre 0 y el índice actual
      //const randomIndex = Math.floor(Math.random() * (i + 1));
      const randomIndex = secureRandomNumber(i + 1);

      // Intercambia el elemento actual con el elemento del índice aleatorio
      const temp = shuffledArray[i];
      shuffledArray[i] = shuffledArray[randomIndex];
      shuffledArray[randomIndex] = temp;
    }
  
    // Devuelve el array barajado
    return shuffledArray;
  }


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
    for(var i = 0; i < allQuestions[0].options.length; i++) {
      borders[i].setAttribute("data-disabled", param)
    }
  }

  const gameStore = async () => {
    try {
      var username = localStorage.getItem("username")
      console.log(username)
      console.log(questions)
      const response = await axios.post(`${apiEndpoint}/storeGame`, { id, username,  points, questions});
      console.log(response)
    } catch (error) {
      console.error(error)
    }
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
    if (allQuestions.length-1 != currentQuestionIndex) {
      currentQuestionIndex = (currentQuestionIndex + 1);
    }
    isCorrect = (false)
        
    
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

        {/* Usar LinearProgress por defecto o ProgressBar creado ?? */}
        <Box sx={{ 
            width: '100%',
            padding: 3}}>

            {/*<LinearProgress color="secondary" variant={loading? "indeterminate" : "determinate"} value={remTime} />*/}
            <LinearProgress color="secondary" variant={"determinate"} value={remTime} />

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