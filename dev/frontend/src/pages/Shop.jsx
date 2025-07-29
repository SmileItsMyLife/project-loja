import { observer } from 'mobx-react-lite';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { ProductCard } from '../components/ProductCard';
import Search from '../components/Search';
import { Pagination } from '../components/Pagination';
import { Filter } from '../components/forms/Filter';

import '../style/Shop.css';
import image404 from '../assets/images/image404.jpg';
import { useProduct } from '../hooks/useProducts';

export const Shop = observer(() => {
    const { data, setData, product } = useProduct();

    const handleSearchChange = (e) => {
        const searchValue = e.target?.value || "";
        setData({
            ...data,
            name: searchValue
        });
    };

    return (
        <>
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
                            {!product.products.count ? (
                                <div
                                    className="w-100 text-center py-5"
                                    style={{
                                        background: "#fff",
                                        borderRadius: 16,
                                        boxShadow: "0 2px 16px rgba(8, 3, 3, 0.07)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minHeight: 320,
                                    }}
                                >
                                    <img
                                        src={image404}
                                        alt="No products found"
                                        style={{ maxWidth: 180, marginBottom: 24 }}
                                    />
                                    <h4 style={{ color: "#333", fontWeight: 600, marginBottom: 8 }}>
                                        Oops... We havent products for you at the moment...
                                    </h4>
                                    <p style={{ color: "#888", fontSize: 16 }}>
                                        Try adjusting your filters or check back later!
                                    </p>
                                </div>
                            ) : (
                                <TransitionGroup component={null}>
                                    {product.products.rows && product.products.rows.map((object) => (
                                        <CSSTransition key={object.id} timeout={500} classNames="product">
                                            <Col
                                                xs={12}
                                                sm={6}
                                                lg={4}
                                                className="d-flex justify-content-center mb-4"
                                            >
                                                <ProductCard properts={object} />
                                            </Col>
                                        </CSSTransition>
                                    ))}
                                </TransitionGroup>
                            )}
                        </div>
                        <Pagination data={data} setData={setData} />
                    </Col>
                </Row>
            </Container>
        </>
    );
});