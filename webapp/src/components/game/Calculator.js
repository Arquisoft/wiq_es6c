import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, LinearProgress } from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { shuffleArray, secureRandomNumber, generateGameId, esperar } from '../Util';
import axios from 'axios';

const Calculator = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [remTime, setRemTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [points, setPoints] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [numQuestionsCorrect, setNumQuestionsCorrect] = useState(0);
    const [numQuestionsIncorrect, setNumQuestionsIncorrect] = useState(0);
    const [showInfoOfQuestions, setShowInfoOfQuestions] = useState(false);
    const [load, setLoad] = useState(true);
    const navigator = useNavigate();
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    useEffect(() => {
        if (questions.length === 0) {
            generateQuestion();
        }
    }, [questions]);

    useEffect(() => {
        const time = setInterval(() => {
            setRemTime((progress) => {
                if (progress === 100) {
                    setTotalTime(totalTime + progress / 10);
                    gameStore();
                    return 0;
                }
                const diff = 0.5;
                return load ? Math.min(progress + diff, 100) : progress;
            });
        }, 400);

        return () => clearInterval(time);
    }, [load, totalTime]);

    const gameStore = async () => {
        try {
            const username = localStorage.getItem('username');
            const avgtime = totalTime / answeredQuestions.length;
            const id = await generateGameId();
            if (!savedGame) {
                savedGame = true;
                const response = await axios.post(`${apiEndpoint}/storeGame`, { id, username, points, questions: answeredQuestions, avgtime });
                console.log(response);
            }
        } catch (error) {
            console.error(error);
        } finally {
            init();
            navigator('/menu');
        }
    };

    function init() {
        setQuestions([]);
        setPoints(0);
        setAnsweredQuestions([]);
    }

    function generateQuestion() {
        let num1 = secureRandomNumber(10) + 1;
        let num2 = secureRandomNumber(10) + 1;

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
            default:
                break;
        }

        const option = [correctAnswer];
        while (option.length < 4) {
            const op = secureRandomNumber(100) + 1;
            if (!option.includes(op)) {
                option.push(op);
            }
        }

        const shuffled = shuffleArray(option);
        setQuestions((prevQuestions) => [
            ...prevQuestions,
            {
                q: `${num1} ${operator} ${num2}`,
                options: shuffled,
                correctAnswer: correctAnswer,
            },
        ]);
    }

    const handleOptionClick = async (selectedAnswer) => {
        setLoad(false);
        const numberAnswer = questions[questionIndex].options.indexOf(questions[questionIndex].correctAnswer);
        const choiceNumber = questions[questionIndex].options.indexOf(selectedAnswer);

        if (selectedAnswer !== questions[questionIndex].correctAnswer) {
            setNumQuestionsIncorrect((prev) => prev + 1);
        } else {
            setPoints((prev) => prev + 100);
            setNumQuestionsCorrect((prev) => prev + 1);
        }

        const updatedAnsweredQuestions = [
            ...answeredQuestions,
            {
                title: questions[questionIndex].q,
                answers: questions[questionIndex].options,
                ansIndex: [choiceNumber, numberAnswer],
            },
        ];

        setAnsweredQuestions(updatedAnsweredQuestions);
        generateQuestion();

        await esperar(2000);

        setQuestionIndex((prevIndex) => prevIndex + 1);
        setLoad(true);
    };

    return (
        <>
            <Nav />
            <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
                <div className="questionStructure">
                    <div class="questionCalculator">
                        <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                            {questions.length > 0 && questions[questionIndex].q}
                        </Typography>
                    </div>
                    <div class="allAnswers">
                        {questions.length > 0 &&
                            questions[questionIndex].options.map((option, index) => (
                                <div key={index}>
                                    <Button
                                        id={`option-${index}`}
                                        value={option}
                                        onClick={() => handleOptionClick(option)}
                                        text={option}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
                <div class="gameResult">
                    {showInfoOfQuestions ? (
                        <div>
                            <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                                Resultados
                            </Typography>
                            <p>Número de preguntas correctas: {numQuestionsCorrect} </p>
                            <p>Número de preguntas incorrectas: {numQuestionsIncorrect} </p>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <Box sx={{ width: '100%', padding: 3 }}>
                    <LinearProgress id="progress" color="secondary" variant={'determinate'} value={remTime} />
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default Calculator;
