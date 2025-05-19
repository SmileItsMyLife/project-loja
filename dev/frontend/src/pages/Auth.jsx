import React from 'react';
import { observer } from 'mobx-react-lite';
import Container from 'react-bootstrap/esm/Container';

import { useStore } from '../main'; // importe o contexto necessário

import { TabForm } from '../components/forms/TabForm';

export const Auth = observer(() => {
    const userContext = useStore();

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