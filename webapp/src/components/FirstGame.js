import React, { useEffect } from 'react';
import { Container, Typography, Box, LinearProgress} from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import GoBackButton from './GoBackButton';
import { Footer } from './footer/Footer';
import { Nav } from './nav/Nav';

var storedInt = 0;
var haveFailedQuestion = false; 
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';

const Quiz = () => {

  const navigator = useNavigate();
  var questions = useLocation().state.questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(storedInt);
  const [isCorrect, setIsCorrect] = React.useState(null);
  const [remTime, setRemTime] = React.useState(0);

  useEffect(() => {
    const time = setInterval(() => {
      setRemTime((progress) => {
        if(progress == 100){
          return 0; 
        }
        const diff = Math.random() * 10;
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
      const response = await axios.get(`${apiEndpoint}/gameUnlimitedQuestions`);
      console.log(response.data.length)
      for (var i = 0; i < response.data.length; i++) {
        var possibleAnswers = [response.data[i].respuesta_correcta, response.data[i].respuestas_incorrectas[0], response.data[i].respuestas_incorrectas[1], response.data[i].respuestas_incorrectas[2]]
        possibleAnswers = shuffleArray(possibleAnswers)
        questions.push({
          question: response.data[i].pregunta,
          options: possibleAnswers,
          correctAnswer: response.data[i].respuesta_correcta
        })
      }      
    } catch (error) {
      console.error(error);
    }
    console.log(questions)
};
  function changeButtons(param) {
    for(var i = 0; i < questions[0].length; i++) {
      var boton = document.getElementById('option-' + i)
      boton.disabled = param
    }
  }


  const checkAnswer = async (option) => {
    getQuestions()
    setIsCorrect(option === questions[currentQuestionIndex].correctAnswer);
    
    changeButtons(true);
    
    const botonIncorrecta = document.getElementById('option-' + questions[currentQuestionIndex].options.indexOf(option))
    const previousBackgroundColor = botonIncorrecta.style.backgroundColor
    if (!isCorrect) {
      botonIncorrecta.style.backgroundColor = 'red'
      haveFailedQuestion = true;
    }
    
    const numberAnswer = questions[currentQuestionIndex].options.indexOf(questions[currentQuestionIndex].correctAnswer)
    const botonCorrecta = document.getElementById('option-' + numberAnswer)
    botonCorrecta.style.backgroundColor = 'green' 
    // Pasar a la siguiente pregunta después de responder

    await esperar(2000); // Espera 2000 milisegundos (2 segundos)
    botonIncorrecta.style.backgroundColor = previousBackgroundColor
    botonCorrecta.style.backgroundColor = previousBackgroundColor
    if (questions.length-1 !== currentQuestionIndex) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
    setIsCorrect(false)
        
    
    changeButtons(false);
    
    if(haveFailedQuestion) {
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
              {questions[currentQuestionIndex].question}
            </Typography>

          </div>

          <div class="allAnswers">
            {questions[currentQuestionIndex].options.map((option, index) => (
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