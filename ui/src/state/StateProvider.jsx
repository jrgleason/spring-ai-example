// StateProvider.jsx
import React, {createContext, useContext, useEffect} from 'react';
import {useMachine} from '@xstate/react';
import {simpleMachine} from "./StateMachine.js";

const StateContext = createContext();

export const StateProvider = ({children}) => {
    const [state, send] = useMachine(simpleMachine);

    useEffect(() => {
        send(
            {type: 'FETCH'}
        )
    }, []);

    return (
        <StateContext.Provider value={{state, send}}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => {
    return useContext(StateContext);
};