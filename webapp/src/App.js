import React, { useState } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
import { Footer } from './components/footer/Footer';
import { Nav } from './components/nav/Nav';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Footer } from './components/footer/Footer';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      <Nav />

      <Container component="main" maxWidth="xs">
        <h1>Welcome to wiq_06c</h1>
        {showLogin ? <Login /> : <AddUser />}
        <Typography component="div" align="center" sx={{ marginTop: 2 }}>
          {showLogin ? (
            <a name="gotoregister"  onClick={handleToggleView}>
              Don't have an account? Register here.
            </a>
          ) : (
            <a onClick={handleToggleView}>
              Already have an account? Login here.
            </a>
          )}
        </Typography>
      </Container>

      <Footer />
    </>
  );
}

export default App;
