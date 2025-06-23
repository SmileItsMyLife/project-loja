import { observer } from 'mobx-react-lite';
import Container from 'react-bootstrap/esm/Container';

import { TabForm } from '../components/forms/TabForm';

export const Auth = observer(() => {
    return (
        <>
            <Container>
                <TabForm />
            </Container>
        </>
    );
});