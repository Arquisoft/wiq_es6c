import React, { useState, useEffect } from 'react';

const Calculator = () => {

    const [question, setQuestion] = useState(null);

    useEffect(() => {
        const newQuestion = generateQuestion();
        setQuestion(newQuestion);
    }, []);


    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateQuestion() {
        const num1 = getRandomNumber(1, 10);
        const num2 = getRandomNumber(1, 10);
        const operator = ['+', '-', 'x', '÷'][getRandomNumber(0, 3)];
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
    
        const options = [correctAnswer];
        while (options.length < 4) {
            const option = getRandomNumber(1, 100);
            if (!options.includes(option)) {
                options.push(option);
            }
        }
    
        shuffleArray(options);
    }


    //CAMBIAR ESTO EN FUNCIÓN DE CÓMO QUERAMOS QUE SEA EL JUEGO
    const handleOptionClick = (selectedAnswer) => {
        if (selectedAnswer === question.correctAnswer) {
            alert('¡Respuesta correcta!');
        } else {
            alert('Respuesta incorrecta. ¡Inténtalo de nuevo!');
        }
        const newQuestion = generateQuestion();
        setQuestion(newQuestion);
    };
    
  
    return (
      <>
        <Nav />
        <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
  
            <div className="questionStructure">
  
                <div class="questionCalculator">
    
                <Typography class="questionText" component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                    {question.question}
                </Typography>
    
                </div>
    
                <div class="allAnswers">
                    {question.options.map((option, index) => (
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
  
            {/*
            <Box sx={{ 
                width: '100%',
                padding: 3}}>
    
                <LinearProgress id='progress'color="secondary" variant={"determinate"} value={remTime} />
            </Box>
            */}
  
        </Container>
        <Footer />
      </>
    );
  };
  
  export default Calculator;