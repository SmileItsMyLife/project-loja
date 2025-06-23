import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import img01 from '../images/avatar.svg'; // Import the image

export default function HeaderBasket() {
    return (
        <Container fluid className='my-5'>
            <Row xs={1} md={2} className="justify-content-center">
                <Col xs={12} md={4} className="d-flex justify-content-end">
                    <Image src={img01} roundedCircle style={{ width: '100px', height: '100px', border: '2px solid blue' }} />
                </Col>
                <Col xs={12} md={7} className="d-flex justify-content-left">
                    
                </Col>
            </Row>
        </Container>
    )
}
