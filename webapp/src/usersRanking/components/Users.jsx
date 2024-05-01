import React from 'react';

function User(props) {
  const { newUser } = props;

  return (
    <div className='border'>
      <div className='question inner'>
        <div>
          <label><h3>{newUser.username}</h3></label>
        </div>
        <div>
          <label><h3>{newUser.tpoints}</h3></label>
        </div>
        <div>
          <label><h3>{newUser.avgpoints}</h3></label>
        </div>
        <div>
          <label><h3>{newUser.ttime}</h3></label>
        </div>
        <div>
          <label><h3>{newUser.avgtime}</h3></label>
        </div>
      </div>
    </div>
  );
}

export default User;
