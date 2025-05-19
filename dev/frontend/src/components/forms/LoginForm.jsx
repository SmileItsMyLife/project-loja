import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../main';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/esm/Container';
import { login } from '../../http/userAPI';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import zxcvbn from "zxcvbn";
import InputGroup from 'react-bootstrap/InputGroup';


const LoginForm = observer(() => {
    const [emailLogin, setEmail] = useState('');
    const [emailError, setEmailError] = useState({
        isError: false,
        massageError: "Error"
    });

    const [passwordError, setPasswordError] = useState({
        isError: false,
        massageError: "Error"
    });
    const [passwordLogin, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const { user } = useStore();

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailLogin) || emailLogin.length > 50) {
            setEmailError({
                isError: true,
                massageError: "The email format is invalid!"
            });
        } else {
            setEmailError({
                isError: false,
                massageError: ""
            });
        }
    }, [emailLogin]);

    useEffect(() => {
        const passwordStrength = zxcvbn(String(passwordLogin));


        if (passwordStrength.score < 3 || passwordLogin.length > 20) {
            setPasswordError({
                isError: true,
                massageError: "Palavra-passe é fraca!"
            });
        } else {
            setPasswordError({
                isError: false,
                massageError: ""
            });
        }
    }, [passwordLogin]);

    const sendDataLogin = async () => {
        try {
            await login(emailLogin, passwordLogin).then((data) => {
                if (data == 404){
                    setEmailError({ 
                                            isError: true,
                        massageError: "O endreço não foi encontrado!"
                    }); 
                    return
                } 
                if (data == 400){
                    setPasswordError({
                        isError: true,
                        massageError: "O enreço ou palavra-passe inválido!"
                    }); 
                    return
                }
                if (typeof data === 'object') {
                    // Data is a JSON object
                    user.setEmail(data.email);
                    user.setId(data.id);
                    user.setIsAuth(true);
                    user.setRole(data.role);
                    user.setIsVerified(data.verified);
                    window.location.href = '/';
                }
            });
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    return (
        <Container fluid className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Form className='shadow p-3'>
                        <Form.Group className="mb-3" controlId="formPlaintextEmail2">
                            <Form.Label>Endreço</Form.Label>
                            <Form.Control type='email' placeholder="email@example.com" value={emailLogin} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        {emailError.isError && emailLogin !== "" ? <Alert variant={"danger"}>
                            {emailError.massageError}
                        </Alert> : null}

                        <Form.Group className="mb-3" controlId="formPlaintextPassword2">
                            <Form.Label>Palavra-passe</Form.Label>
                            <InputGroup>
                                <Form.Control type={showPassword ? "text" : "password"} placeholder="Palavra-passe" value={passwordLogin} onChange={(e) => setPassword(e.target.value)} />
                                <Button variant="primary" onClick={() => setShowPassword(!showPassword)}>
                                    {
                                        showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                            <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                                            <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                                        </svg>
                                    }
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        {passwordError.isError && passwordLogin !== "" ? <Alert variant={"danger"}>
                            {passwordError.massageError}
                        </Alert> : null}

                        <Button disabled={emailError.isError || passwordError.isError} variant="primary" onClick={sendDataLogin}>Entrar</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
});

export default LoginForm;