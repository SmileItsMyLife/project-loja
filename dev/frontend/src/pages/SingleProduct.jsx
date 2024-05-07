import React, { useContext ,useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import { useLocation } from 'react-router-dom';
import { fetchOneProduct } from '../http/productAPI';
import ListGroup from 'react-bootstrap/ListGroup';
import { Context } from '../main';

const SingleProduct = observer(() => {
    const {product} = useContext(Context)
    console.log(product.types)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const [dataLoaded, setDataLoaded] = useState(false);
    const [data, setData] = useState({})
    const [type, setType] = useState("Null")

    const getOneProduct = async () => {
        await fetchOneProduct(id).then((data) => {
            setData(data)
            setType(findObjectById(product.types, data.typeId))
            console.log(findObjectById(product.types, data.typeId))
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

    return (
        <Container fluid className='my-5'>
            <Row>
                <Col className="d-flex justify-content-center">
                    <Card xs={12} md={8} className='m-5'>
                        <Card.Img variant="top" src={`http://localhost:5000/${data.img}`} />
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
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
});

export default SingleProduct;