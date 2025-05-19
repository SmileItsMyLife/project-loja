import React, {useState} from 'react'
import Container from 'react-bootstrap/esm/Container';

import { AccountCard } from '../components/AccountCard';

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
    </Container>
  )
}
