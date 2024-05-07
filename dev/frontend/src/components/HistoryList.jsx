import Container from 'react-bootstrap/esm/Container';
import ProductCardHistory from './ProductCardHistory';

export default function HistoryList() {
  return (
    <Container className='d-flex justify-content-center'>
        <ProductCardHistory/>
        <ProductCardHistory/>
        <ProductCardHistory/>
    </Container>
  )
}
