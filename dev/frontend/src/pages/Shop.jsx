import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { useStore } from '../main';
import { fetchProducts, fetchTypes } from '../http/productAPI';

import { ProductCard } from '../components/ProductCard';
import Search from '../components/Search';
import { SliderHeader } from '../components/SliderHeader';
import { Pagination } from '../components/Pagination';
import { Filter } from '../components/forms/Filter';

import '../style/Shop.css'; // Importar arquivo CSS

export const Shop = observer(() => {
    const { product } = useStore();

    const [data, setData] = useState({
        typeId: 0,
        page: 1,
        limit: 3,
        sortedBy: "normal",
        name: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            await fetchTypes().then((data) => {
                product.setTypes(data);
            });

            await fetchProducts(data.typeId, data.page, data.limit, data.sortedBy, data.name).then((data) => {
                product.setProducts(data.products);
                product.setTotalPages(data.totalPages);
            });
        };
        fetchData();
    }, [data]);

    const handleSearchChange = (e) => {
        const searchValue = e.target?.value || ""; // Prevents error if `e` is undefined
        setData({
            ...data,
            name: searchValue
        });
    };

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <SliderHeader />
                    </Col>
                </Row>
            </Container>
            <Container fluid>
                <Row xs={1} sm={2}>
                    <Col xs={12} sm={3} className='d-flex justify-content-center border-end border-top'>
                        <Container>
                            <Search onChangeSearch={handleSearchChange} />
                            <Filter data={data} setData={setData} />
                        </Container>
                    </Col>
                    <Col xs={12} sm={9} className='border-top'>
                        <div className="row"> {/* Div para suportar o sistema de grades */}
                            <TransitionGroup component={null}>
                                {product.products.rows && product.products.rows.map((object) => (
                                    <CSSTransition key={object.id} timeout={500} classNames="product">
                                        <Col
                                            xs={12} // 1 card por linha no telemóvel
                                            sm={6}  // 2 cards por linha em dispositivos médios
                                            lg={4}  // 3 cards por linha em desktops
                                            className="d-flex justify-content-center mb-4"
                                        >
                                            <ProductCard properts={object} />
                                        </Col>
                                    </CSSTransition>
                                ))}
                            </TransitionGroup>
                        </div>
                        <Pagination data={data} setData={setData} />
                    </Col>
                </Row>
            </Container>
        </>
    );
});