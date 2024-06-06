import React, {useState} from 'react'
import Container from 'react-bootstrap/esm/Container';
import AccountCard from '../components/AccountCard';
import HistoryList from '../components/HistoryList';
import { Pagination } from 'react-bootstrap';

export default function Account() {
  const [data, setData] = useState({
    page: 1,
    limit: 12
  });

  const handlePageChange = (page) => {
    if (page > 0) {
      setData({
        ...data,
        page
      });
    }
  };
  return (
    <Container>
      <AccountCard />

      {/* História das compras:
      <HistoryList />
      <Container className='d-flex justify-content-center'>
        <Pagination>
          <Pagination.Prev onClick={() => handlePageChange(data.page - 1)} />
          <Pagination.Item active>{data.page}</Pagination.Item>
          <Pagination.Next onClick={() => handlePageChange(data.page + 1)} />
        </Pagination>
      </Container> */}

      {/* Favoritos:
        <HistoryList/>
        <ProductPagination/> */}
    </Container>
  )
}
