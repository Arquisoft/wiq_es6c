import React from 'react';
import { useContext } from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { context } from '../Context';


export const Nav = () => {

    const navigate = useNavigate();
    const { username, isLogged, destroySession } = useContext(context);


    const handleOpenUser = () => {
        navigate(" ... ");
    };

    const handleLogout = () => {
        destroySession();
        navigate("/login");
    };


    return (
        <AppBar position="static">
        <Toolbar>
            <Link to='/home' >
                <IconButton size="large" color="inherit" >
                    <HomeIcon />
                </IconButton>
            </Link>
            

            <Typography variant="h6" component="div">WIQ</Typography>


            {isLogged ? (
            <Box>
                <Button color="inherit" onClick={handleOpenUser}>
                    {username}
                </Button>

                <IconButton  size="large" color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                </IconButton>
            </Box>
            ) : (
            <Box>
                <Button color="inherit" component={Link} to="/login">
                    Login
                </Button>
            </Box>
            )}
        </Toolbar>
        </AppBar>
    );

}