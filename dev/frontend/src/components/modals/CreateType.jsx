import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { observer } from 'mobx-react-lite';
import { addType } from '../../http/typeAPI';
import { Context } from '../../main';

export const CreateType = observer(({ fetchData }) => {
    const { type } = useContext(Context);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', name);

            // Enviar os dados do tipo para a API
            const response = await addType(formDataToSend);

            // Exibir mensagem de sucesso ou fazer outra ação necessária
            console.log('Tipo criado com sucesso:', response);

            fetchData();

            // Fechar o modal após o envio dos dados
            handleClose();
        } catch (error) {
            console.error('Erro ao criar tipo:', error);
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Criar Tipo
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Criar Tipo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nome do Tipo:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome do tipo"
                                value={name}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
});
