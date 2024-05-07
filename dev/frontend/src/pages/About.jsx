import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../main'; // importe o contexto necessário

export const About = observer(() => {
    const userContext = useContext(Context);

    // Verifica se o contexto está disponível e se user é válido antes de usar
    const user = userContext && userContext.user;

    return (
        <div>
            <h2>About</h2>
            {user && <p>User: {user.email}</p>}
        </div>
    );
});