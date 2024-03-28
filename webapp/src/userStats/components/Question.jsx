import React from 'react';

function Question(props) {
  const { newQuestion } = props;

  return (
    <div className='border'>
      <div className='inner'>
        <div className="header">
        <h4>{newQuestion.title}</h4>
        </div>
        <div className='grid'>
          {newQuestion.answers.map((answer, index) => {
            switch (index) {
              case newQuestion.ansIndex[1]:
                return <p key={index} className="right">{answer}</p>;
              case newQuestion.ansIndex[0]:
                return <p key={index} className="choice">{answer}</p>;
              default:
                return <p key={index}>{answer}</p>;
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default Question;
