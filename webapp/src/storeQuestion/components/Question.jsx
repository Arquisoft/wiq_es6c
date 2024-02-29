import React from 'react';

function Question(props) {
  const { newQuestion } = props;

  return (
    <div className='question'>
      <h3>{newQuestion.question}</h3>
        <div className='grid'>
        {newQuestion.answers.map((answer, index) => (
            <p>{answer}</p>
        ))}
        </div>
    </div>
  );
}

export default Question;
