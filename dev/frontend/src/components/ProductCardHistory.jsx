import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'; // Importe o componente ListGroup
import img01 from '../images/img01.jpg'; // Importe a imagem

export default function ProductCardHistory() {
    return (
        <Card className='m-3' style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>Compra</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item>Data: 01/01/2000</ListGroup.Item>
                <ListGroup.Item>Status: Fechado</ListGroup.Item>
            </ListGroup>
            <Card.Body>
                <Card.Link href="#">Detalhas</Card.Link>
            </Card.Body>
        </Card>
    );
}