import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, LinearProgress} from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../Button';
import GoBackButton from '../GoBackButton';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';
import {shuffleArray} from '../Util'

var questions = [];
var points = 0;
var load = true;

const Game = () => {

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

    };

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
    };

    const newQuestion = async () => {
        
    };

    const checkAnswer = async (option) => {

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
            
          </Container>
          <Footer />
        </>
    );

};

export default Game;