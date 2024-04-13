import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, SvgIcon, Container } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { Link } from 'react-router-dom';

function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
}

export const Nav = () => {

    //const navigate = useNavigate();
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
        <AppBar position="static" sx={{ background: "linear-gradient(163deg, #00ff75 33%, #3700ff 100%)", color: "white"}}>
        <Toolbar sx={{alignItems: 'center', justifyContent:'space-between'}}>
            <Container sx={{alignItems:'left', textAlign:'left', display:'flex', justifyContent:'flex-start' }}>
                <Link to='/menu' >
                    <IconButton size="large" color="inherit" >
                        <HomeIcon sx={{ color: "#212121" }}/>
                    </IconButton>
                </Link>
                <Typography variant="h6" component="div" sx={{marginTop: '8px'}}>WIQ</Typography>
            </Container>

            <Container sx={{alignItems:'center', textAlign:'center'}}>
                <Link to='/history' style={{color:'white', textDecoration: 'none', marginRight: '2vw'}}>
                    Historial
                </Link>
                <Link to='/appQuestion' style={{color:'white', textDecoration: 'none'}}>
                    Almacén de preguntas
                </Link>
                <Link to='/users' style={{color:'white', textDecoration: 'none'}}>
                    Usuarios
                </Link>
            </Container>

            <Container sx={{alignItems:'right', textAlign:'right'}}>
                <Link to='/help' style={{color:'white', textDecoration: 'none'}}>
                    <IconButton size="large" color="inherit" >
                        <HelpIcon sx={{ color: "white" }}/>
                    </IconButton>
                </Link>
            </Container>

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