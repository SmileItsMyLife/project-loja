import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../main'; // importe o contexto necessário
import Slider from '../components/Slider';
import {ProductCard} from '../components/ProductCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Search from '../components/Search';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import { fetchProducts, fetchTypes } from '../http/productAPI';

export const Shop = observer(() => {
    const { user, product } = useContext(Context)

    const [data, setData] = useState({
        typeId: 0,
        page: 1,
        limit: 24,
    })

    useEffect(() => {
        const fetchData = async () => {
            await fetchTypes().then((data) => {
                product.setTypes(data)
            })

            await fetchProducts(data.typeId, data.page, data.limit).then((data) => {
                product.setProducts(data)
            })
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await fetchProducts(data.typeId, data.page, data.limit).then((data) => {
                product.setProducts(data)
            })

        }
        fetchData()
    }, [data])
    const handleTypeChange = (e) => {
        setData({
            ...data,
            typeId: e.target.value
        })
    }

    const handlePageChange = (page) => {
        if (page > 0 ){
            setData({
                ...data,
                page
            })
        }
    }

    return (
        <>
            <Slider />
            <Container fluid>
                <Row xs={1} sm={2}>
                    <Col xs={12} sm={3} className='d-flex justify-content-center'>
                        <Container>
                            <Form>
                                <Search />
                                <Form.Select className="my-3 shadow" onChange={handleTypeChange}>
                                    <option value={0}>Todos tipos</option>
                                    {product.types.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Select className="my-3 shadow">
                                    {/* Options here */}
                                </Form.Select>

                            </Form>
                        </Container>
                    </Col>
                    <Col xs={12} sm={9} >
                        <Row xs={1} md={2} xl={3} className="d-flex justify-content-center">
                            {product.products.rows && product.products.rows.map((object) => (
                                <Col key={object.id} className="d-flex justify-content-center">
                                    <ProductCard properts={object} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Container className='d-flex justify-content-center'>
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} />
                    <Pagination.Prev onClick={() => handlePageChange(data.page - 1)} />
                    <Pagination.Item active>{data.page}</Pagination.Item>
                    <Pagination.Next onClick={() => handlePageChange(data.page + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                </Pagination>
            </Container>
        </>
    );
});