import React from 'react';

function User(props) {
  const { newUser } = props;

  return (
    <div className='border'>
      <div className='question inner'>
        <h3>{newUser.username}</h3>
          <div className='container footer'>
            <footer>{newUser.createdAt.substring(0,10)}</footer>
          </div>
      </div>
    </div>
  );
}

export default Question;
