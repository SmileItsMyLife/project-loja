import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../main'; // importe o contexto necessário
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { ProductCardBasket } from '../components/ProductCardBasket';
import AccountCard from '../components/AccountCard';
import { fetchBasket } from '../http/basketAPI';

export const Basket = observer(() => {
    const { user, product } = useContext(Context);

    const getBasket = async () => {
        const basketData = await fetchBasket();
        product.setBasket(basketData);
    }

    useEffect(() => {
        if (user.isAuth){
            getBasket()
        }
    }, [])

    return (
        <>
            <Container>
                <AccountCard />
                <Container fluid>
                    <Row xs={1} sm={2} md={3} lg={3} xl={4} className="justify-content-center">
                        {product.basket.productsInBasket && product.basket.productsInBasket.map((object, index) => {
                            console.log("Index:", index); // Adicione esta linha para depurar o valor de index
                            return (
                                <Col key={object.id} className="d-flex justify-content-center">
                                    <ProductCardBasket properts={object.productData} id={object.id}/>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </Container>
        </>
    );
});