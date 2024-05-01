import React, { useState } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Container component="main" maxWidth="xs">
      <h1>Bienvenido a WIQEII</h1>
      {showLogin ? <Login /> : <AddUser />}
      <Typography component="div" align="center" sx={{ marginTop: 2 }}>
        {showLogin ? (
          <p className='link' name="gotoregister"  onClick={handleToggleView}>
            ¿Todavía no tienes cuenta? Regístrate aquí.
          </p>
        ) : (
          <p className='link' onClick={handleToggleView}>
            ¿Ya tienes una cuenta? Inicia sesión aquí.
          </p>
        )}
      </Typography>
    </Container>
  );
}

export default App;
