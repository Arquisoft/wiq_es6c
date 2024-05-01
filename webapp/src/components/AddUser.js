import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar } from '@mui/material';
import Button from './Button';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addUser = async () => {
    if (name.trim() === '' || surname.trim() === '' || username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      setError('Todos los campos deben de estar rellenos.');
    } else if (password.length < 8){
      setError('Las contraseñas deben contener más de 8 caracteres.');
    } else if(password !== confirmPassword){
      setError('Las contraseñas no coinciden.');
    } else {
      try {
        try {
          await axios.post(`${apiEndpoint}/login`, { username, password });
          setError('Usuario ya registrado.');
          setOpenSnackbar(false);
        } catch (error) {
          await axios.post(`${apiEndpoint}/adduser`, { username, password });
          setOpenSnackbar(true);
        }
      } catch (error) {
        setError(error.response.data.error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container className='addUser' component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      
      <Typography component="h1" variant="h5">
        Registro
      </Typography>

      <TextField
        name="name"
        margin="normal"
        fullWidth
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        name="surname"
        margin="normal"
        fullWidth
        label="Apellidos"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      />

      <TextField
        name="username"
        margin="normal"
        fullWidth
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        name="password"
        margin="normal"
        fullWidth
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        name="confirmPassword"
        margin="normal"
        fullWidth
        label="Repetir contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button text="Registrarse" onClick={addUser} name = "Add user"/>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Usuario añadido correctamente" />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}

    </Container>
  );
};

export default AddUser;
