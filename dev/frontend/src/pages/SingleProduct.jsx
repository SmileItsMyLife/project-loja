import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';

import { useStore } from '../main';

import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button, Modal } from 'react-bootstrap';

import { fetchOneProduct } from '../services/productAPI';
import { addProduct, fetchBasket } from '../services/basketAPI';

import StarRating from '../components/UI/StarRating';

export const SingleProduct = observer(() => {
    const [userRating, setUserRating] = useState(0)
    const { user, product } = useStore()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const [dataLoaded, setDataLoaded] = useState(false);
    const [data, setData] = useState({})
    const [type, setType] = useState("Null")
    const navigate = useNavigate();

    const [showMessage, setShowMessage] = useState(false);
    const handleClose = () => setShowMessage(false);

    const getOneProduct = async () => {
        await fetchOneProduct(id).then((data) => {
            setData(data)
            setType(findObjectById(product.types, data.typeId))
            setDataLoaded(true);
        })
        setDataLoaded(true);
    }

    useEffect(() => {
        getOneProduct()
    }, [])

    const findObjectById = (array, id) => {
        return array.find(item => item.id === id);
    };

    if (!dataLoaded) {
        return <div>Loading</div>; // Render the Loading component until data is loaded
    }

    const handleBuyClick = async () => {
        if (!user.isAuth) {
            navigate('auth');
        } else {
            await addProduct(id).then(() => {
                setShowMessage(true)
            })
            const basketData = await fetchBasket();
            product.setBasket(basketData);
        }
    };

    return (
        <Container fluid className='my-5'>
            <Row>
                <Col className="d-flex justify-content-center">
                    <Card xs={12} md={8} className='m-5'>
                        <Card.Img variant="top" src={`http://localhost:4242/${data.img}`} />
                        <Card.Body>
                            <Card.Title>{data.name}</Card.Title>
                            <Card.Text>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col >
                <Col xs={12} md={4} className="d-flex justify-content-left">
                    <ListGroup className="mt-5" variant="flush">
                        <ListGroup.Item>Informação: {data.info}</ListGroup.Item>
                        <ListGroup.Item>Preço: {data.price} €</ListGroup.Item>
                        <ListGroup.Item>Tipo: {type.name}</ListGroup.Item>
                        <StarRating maxStars={5} rating={userRating} onRatingChange={setUserRating} onlyRead={false}/>
                        <Button className='my-3' variant="primary" onClick={handleBuyClick}>Comprar</Button>
                        <Button className='' variant="primary" onClick={() => { navigate(`/`) }}>Voltar</Button>
                    </ListGroup>
                </Col>
            </Row>
            <Modal show={showMessage} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>O produto foi colocado à caixa!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}); 