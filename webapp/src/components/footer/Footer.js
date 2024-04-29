import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

export const Footer = () => {
    return (
        <AppBar component="footer" position="static" sx={{background: "linear-gradient(163deg, #00ff75 0%, #3700ff 67%)", color: "#0F0F0F", position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 1000 }}>
            <Toolbar>
                <Typography sx={{ margin: 'auto' }}>
                    © WIQ ES06C
                </Typography>
            </Toolbar>
        </AppBar>
    );
};