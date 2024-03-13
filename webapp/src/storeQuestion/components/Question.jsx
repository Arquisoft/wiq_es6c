import React from 'react';

function Question(props) {
  const { newQuestion } = props;

  return (
    <div className='question'>
      <h3>{newQuestion.pregunta}</h3>
        <div className='grid'>
          <div className='container'>
            <p className='right'>{newQuestion.respuesta_correcta}</p>
          </div>
          {newQuestion.respuestas_incorrectas.map((answer, index) => (
            <div className='container'>
              <p>{answer}</p>
            </div>
          ))}
        </div>
        <div className='container footer'>
          <footer>{newQuestion.createdAt.substring(0,10)}</footer>
        </div>
    </div>
  );
}

export default Question;
