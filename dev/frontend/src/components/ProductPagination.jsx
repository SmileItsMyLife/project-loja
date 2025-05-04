import Pagination from 'react-bootstrap/Pagination';
import Container from 'react-bootstrap/esm/Container';
import { observer } from 'mobx-react-lite';
import { useStore } from '../main'; // importe o contexto necessário

export default function ProductPagination() {
    return (
        <Container className='d-flex justify-content-center'>
            <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Ellipsis />

                <Pagination.Item>{10}</Pagination.Item>
                <Pagination.Item>{11}</Pagination.Item>
                <Pagination.Item>{12}</Pagination.Item>
                <Pagination.Item>{13}</Pagination.Item>
                <Pagination.Item disabled>{14}</Pagination.Item>

                <Pagination.Ellipsis />
                <Pagination.Item>{20}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
        </Container>
    )
}
