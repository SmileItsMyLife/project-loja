import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ProductCard } from '../components/ProductCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Search from '../components/Search';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import { fetchProducts, fetchTypes } from '../http/productAPI';
import './Shop.css'; // Importar arquivo CSS

export const Shop = observer(() => {
    const { user, product } = useContext(Context);

    const [data, setData] = useState({
        typeId: 0,
        page: 1,
        limit: 24
    });

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            await fetchTypes().then((data) => {
                product.setTypes(data);
            });

            await fetchProducts(data.typeId, data.page, data.limit).then((data) => {
                product.setProducts(data.products);
                product.setTotalPages(data.totalPages);
                setTotalPages(() => (data.totalPages > 1 ? data.totalPages : 1));
            });
        };
        fetchData();
    }, [data]);

    const handleTypeChange = (e) => {
        setData({
            ...data,
            typeId: e.target.value,
            page: 1 // Resetar para a primeira página ao mudar de tipo
        });
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setData({
                ...data,
                page
            });
        }
    };

    return (
        <>
            <Container fluid>
                <Row xs={1} sm={2}>
                    <Col xs={12} sm={3} className='d-flex justify-content-center border-end'>
                        <Container>
                            <Form>
                                <Search />
                                <Form.Select className="my-3 shadow" onChange={handleTypeChange}>
                                    <option value={0}>Todos tipos</option>
                                    {product.types.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </Form.Select>
                                {/* <Form.Select className="my-3 shadow">
                                    Options here
                                </Form.Select> */}
                            </Form>
                        </Container>
                    </Col>
                    <Col xs={12} sm={9}>
                        <TransitionGroup className="product-list">
                            {product.products.rows && product.products.rows.map((object) => (
                                <CSSTransition key={object.id} timeout={500} classNames="product">
                                    <Col className="d-flex justify-content-center">
                                        <ProductCard properts={object} />
                                    </Col>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </Col>
                </Row>
            </Container>
            <Container className='d-flex justify-content-center'>
                <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(data.page - 1)} />
                    <Pagination.Item active>{data.page}</Pagination.Item>
                    <Pagination.Next onClick={() => handlePageChange(data.page + 1)} />
                </Pagination>
            </Container>
        </>
    );
});