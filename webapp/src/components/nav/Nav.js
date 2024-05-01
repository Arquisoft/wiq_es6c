import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, SvgIcon, Container } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
}

export const Nav = () => {

    return (
        <AppBar position="fixed" sx={{ background: "linear-gradient(163deg, #00ff75 33%, #3700ff 100%)", color: "white"}}>
        <Toolbar sx={{alignItems: 'center', justifyContent:'space-between'}}>
            <Container sx={{alignItems:'left', textAlign:'left', display:'flex', justifyContent:'flex-start' }}>
                <Link to='/menu' >
                    <IconButton size="large" color="inherit" >
                        <HomeIcon sx={{ color: "#212121" }}/>
                    </IconButton>
                </Link>
                <Typography variant="h6" component="div" sx={{marginTop: '8px', color: '#0F0F0F'}}>WIQ</Typography>
            </Container>

            <Container sx={{alignItems:'center', textAlign:'center'}}>
                <Link to='/history' style={{color:'#0F0F0F', textDecoration: 'none', marginRight: '2vw', fontSize: '1.25rem'}}>
                    Historial
                </Link>
                <Link to='/appQuestion' style={{color:'#0F0F0F', textDecoration: 'none', marginRight: '2vw', fontSize: '1.25rem'}}>
                    Almacén de preguntas
                </Link>
                <Link to='/ranking' style={{color:'#0F0F0F', textDecoration: 'none', fontSize: '1.25rem'}}>
                    Ranking de Usuarios
                </Link>
            </Container>

            <Container sx={{alignItems:'right', textAlign:'right'}}>
                <Link to='/help' style={{color:'white', textDecoration: 'none'}}>
                    <IconButton size="large" color="inherit" >
                        <HelpIcon sx={{ color: "#0F0F0F" }}/>
                    </IconButton>
                </Link>
                <Link to='/' style={{color:'white', textDecoration: 'none'}}>
                    <IconButton size="large" color="inherit" >
                        <LogoutIcon sx={{ color: "#0F0F0F" }}/>
                    </IconButton>
                </Link>
            </Container>

        </Toolbar>
        </AppBar>
    );

}