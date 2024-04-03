import React from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Typography, SvgIcon } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
}

export const Nav = () => {

    const navigate = useNavigate();
    //const { username, isLogged, destroySession } = useContext(context);

    /*
    const handleOpenUser = () => {
        navigate(" ... ");
    };

    const handleLogout = () => {
        destroySession();
        navigate("/login");
    };
    */

    return (
        <AppBar position="static" sx={{ backgroundColor: "secondary", color: "white"}}>
        <Toolbar>
            <Link to='/home' >
                <IconButton size="large" color="inherit" >
                    <HomeIcon />
                </IconButton>
            </Link>
            

            <Typography variant="h6" component="div">WIQ</Typography>

            {/*
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
            */}
        </Toolbar>
        </AppBar>
    );

}