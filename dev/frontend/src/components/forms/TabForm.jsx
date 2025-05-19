import { Tabs, Tab } from 'react-bootstrap';
import LoginForm from './LoginForm';
import AuthForm from './AuthForm';

export function TabForm() {

    return (
        <Tabs
            defaultActiveKey="login"
            transition={false}
            id="noanim-tab-example"
            className="mt-5 text-primary justify-content-center"
        >
            <Tab eventKey="login" title="Login">
                <LoginForm/>
            </Tab>
            <Tab eventKey="registration" title="Registration">
                <AuthForm/>
            </Tab>
        </Tabs>
    );
}