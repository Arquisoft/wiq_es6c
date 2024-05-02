import React from 'react';

function User(props) {
  const { newUser } = props;

  return (
  
      <tr>
        <th>
          <label><h3>{newUser.username}</h3></label>
        </th>
        <th>
          <label><h3>{newUser.tpoints}</h3></label>
        </th>
        <th>
          <label><h3>{newUser.avgpoints.toFixed(2)}</h3></label>
        </th>
        <th>
          <label><h3>{newUser.ttime.toFixed(2)}</h3></label>
        </th>
        <th>
          <label><h3>{newUser.avgtime.toFixed(2)}</h3></label>
        </th>
      </tr>
  
  );
}

export default User;
