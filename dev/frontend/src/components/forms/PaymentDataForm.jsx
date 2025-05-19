import React from 'react';
import { Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link } from 'react-router-dom';

function PaymentDataForm() {
    const totalPrice = 100;

    // Listas de países e cidades de exemplo
    const countries = ["Portugal"];
    const cities = ["Portimão", "Lagos", "Lagoa", "Carvoeiro", "Alvor"];

    return (
        <Container className='my-5'>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">País</InputGroup.Text>
                <Form.Select aria-label="Selecione o País" aria-describedby="basic-addon1">
                    {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                    ))}
                </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Cidade</InputGroup.Text>
                <Form.Select aria-label="Selecione a Cidade" aria-describedby="basic-addon1">
                    {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                    ))}
                </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Endereço</InputGroup.Text>
                <Form.Control
                    placeholder="Digite o endereço"
                    aria-label="Endereço"
                    aria-describedby="basic-addon1"
                    maxLength={100} // Limitação de comprimento máximo
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon2">Código Postal</InputGroup.Text>
                <Form.Control
                    placeholder=""
                    aria-label="Código Postal Parte 1"
                    aria-describedby="basic-addon2"
                    maxLength={4} // Limitação de comprimento máximo
                    className='text-end'
                    style={{ maxWidth: '80px' }} // Ajustando a largura do campo
                />
                <InputGroup.Text id="basic-addon2">-</InputGroup.Text>
                <Form.Control
                    placeholder=""
                    aria-label="Código Postal Parte 2"
                    aria-describedby="basic-addon2"
                    maxLength={4} // Limitação de comprimento máximo
                    className='text-end'
                    style={{ maxWidth: '80px' }} // Ajustando a largura do campo
                />
            </InputGroup>

            <InputGroup className="mb-3 w-50">
                <form action="http://localhost:4242/create-checkout-session" method="POST">
                    <Button id="submit" role="link">Buy</Button>
                </form>
                <Form.Control
                    placeholder={totalPrice}
                    className='text-end'
                    aria-label="Amount (to the nearest dollar)"
                    disabled
                />
                <InputGroup.Text>€</InputGroup.Text>
            </InputGroup>
        </Container>
    );
}

export default PaymentDataForm;