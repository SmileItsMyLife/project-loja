import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../main'; // importe o contexto necessário
import Container from 'react-bootstrap/esm/Container';
import TabForm from '../components/TabForm';

export const Auth = observer(() => {
    const userContext = useContext(Context);

    // Verifica se o contexto está disponível e se user é válido antes de usar
    const user = userContext && userContext.user;

    return (
        <>
            <Container>
                <TabForm />
            </Container>
        </>
    );
});