import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { observer } from 'mobx-react-lite';
import { createProduct } from '../../http/productAPI';
import { Context } from '../../main';

export const CreateProduct = observer(({ fetchData }) => {
    const { product } = useContext(Context)
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        typeId: '',
        image: null
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'typeId') { // Handle typeId separately
            setFormData({
                ...formData,
                typeId: value // Update typeId directly
            });
        } else if (files) {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.productName);
            formDataToSend.append('info', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('typeId', formData.typeId);
            formDataToSend.append('img', formData.image);

            // Enviar os dados do produto para a API
            const response = await createProduct(formDataToSend);

            // Exibir mensagem de sucesso ou fazer outra ação necessária
            console.log('Produto criado com sucesso:', response);

            fetchData()

            // Fechar o modal após o envio dos dados
            handleClose();
        } catch (error) {
            console.error('Erro ao criar produto:', error);
        }
    };

    console.log(product.types)

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Criar Produto
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Criar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nome do Produto:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome do produto"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicDescription">
                            <Form.Label>Descrição:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Digite a descrição do produto"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPrice">
                            <Form.Label>Preço (cents):</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Digite o preço do produto"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicTypeId">
                            <Form.Label>Tipo:</Form.Label>
                            <Form.Select
                                className="my-3 shadow"
                                placeholder="Tipo"
                                name="typeId"
                                value={formData.typeId}
                                onChange={handleChange}>
                                {product.types.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Control/>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Imagem do Produto:</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={handleChange}
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
})