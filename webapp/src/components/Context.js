import React, { createContext, useContext, useState } from 'react';

const Context = createContext();

export function ContextFun({ children }) {
    const [usernameGlobal, setUsernameGlobal] = useState('');

    return (
        <Context.Provider value={{ usernameGlobal, setUsernameGlobal }}>
            {children}
        </Context.Provider>
    );
}

export function useUser() {
    return useContext(Context);
}