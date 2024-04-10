import React, { useState } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
//import { Nav } from './components/nav/Nav';//ASK - is this necessary?
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
//import { Footer } from './components/footer/Footer';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Container component="main" maxWidth="xs">
      <h1>Welcome to wiq_06c</h1>
      {showLogin ? <Login /> : <AddUser />}
      <Typography component="div" align="center" sx={{ marginTop: 2 }}>
        {showLogin ? (
          <p className='link' name="gotoregister"  onClick={handleToggleView}>
            Don't have an account? Register here.
          </p>
        ) : (
          <p className='link' onClick={handleToggleView}>
            Already have an account? Login here.
          </p>
        )}
      </Typography>
    </Container>
  );
}

export default App;
