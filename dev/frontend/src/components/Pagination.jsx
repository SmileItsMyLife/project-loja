import { observer } from 'mobx-react-lite'
import { default as P } from 'react-bootstrap/Pagination';
import { Container } from 'react-bootstrap';
import { useStore } from '../hooks/useStore';

export const Pagination = observer(({ data, setData }) => {
    const { product } = useStore();
    const handlePageChange = (page) => {
        if (page > 0 && page <= product.totalPages) {
            setData({
                ...data,
                page
            });
        }
    };
    if (!product.totalPages || product.totalPages <= 1) {
        return null; // Não renderiza a paginação se não houver páginas
    } else {
        return (
            <Container className='d-flex justify-content-center'>
                <P>
                    <P.Prev onClick={() => handlePageChange(data.page - 1)} />
                    <P.Item active>{data.page}</P.Item>
                    <P.Next onClick={() => handlePageChange(data.page + 1)} />
                </P>
            </Container>
    )} 
})