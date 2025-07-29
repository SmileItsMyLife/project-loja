import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLogin } from '../../hooks/useLogin';
import { emailCheckFormat } from '../../utils/checkFormat';
import { EyeIcon, EyeSlashIcon } from '../../utils/icons.jsx';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';

const LoginForm = observer(() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dataFormatValidation, setDataFormatValidation] = useState({
        emailValide: { isValide: true, messageValidation: "" },
        passwordValide: { isValide: true, messageValidation: "" }
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loginAndAuth } = useLogin();

    useEffect(() => {
        const checkEmail = (email) => {
            if (emailCheckFormat(email)) {
                setDataFormatValidation((prev) => ({
                    ...prev,
                    emailValide: { isValide: true, messageValidation: "" }
                }));
                return true
            } else {
                setDataFormatValidation((prev) => ({
                    ...prev,
                    emailValide: { isValide: false, messageValidation: "Wrong email format!" }
                }));
                return false
            }
        }
        checkEmail(email);
    }, [email]);

    const handlerSubmit = async (e) => {
        e.preventDefault();
        const result = await loginAndAuth(email, password);
        if (result.success) {
            alert("Login successful!");
        } else {
            alert(`Login failed: ${result.error.message}`);
        }
    }

    return (
        <Container fluid className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Form className='shadow p-3' onSubmit={handlerSubmit}>

                        <Form.Group className="mb-3" controlId="formPlaintextEmail">
                            <Form.Label>Adress</Form.Label>
                            <Form.Control type='email' placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        {!dataFormatValidation.emailValide && email !== "" ? 
                        <Alert variant={"danger"}>
                        {dataFormatValidation.emailValide.messageValidation}
                        </Alert> : null}

                        <Form.Group className="mb-3" controlId="formPlaintextPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>

                                <Form.Control type={showPassword ? "text" : "password"} placeholder="Palavra-passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                                
                                <Button variant="primary" onClick={() => setShowPassword(!showPassword)}>
                                     {showPassword ? EyeIcon : EyeSlashIcon}
                                </Button>

                            </InputGroup>

                            <Form.Text id="passwordHelpBlock" muted>
                                A sua palavra-passe deve ter 9-20 caracteres, conter letras e números e não deve conter espaços, caracteres especiais ou emoji.
                            </Form.Text>

                        </Form.Group>
                        
                        {!dataFormatValidation.passwordValide && password !== "" ? 
                        <Alert variant={"danger"}>
                            {dataFormatValidation.passwordValide.messageValidation}
                        </Alert> : null}

                    <Button disabled={!dataFormatValidation.emailValide || !dataFormatValidation.passwordValide} variant="primary" type='submit'>Registar</Button>
                    
                    </Form>
                </Col>
            </Row>
        </Container>
    );
});

export default LoginForm;
