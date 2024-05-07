import React from 'react'
import Container from 'react-bootstrap/esm/Container';
import AccountCard from '../components/AccountCard';
import HistoryList from '../components/HistoryList';
import ProductPagination from '../components/ProductPagination';

export default function Account() {
  return (
    <Container>
        <AccountCard/>

        História das compras:
        <HistoryList/>
        <ProductPagination/>
        
        Favoritos:
        <HistoryList/>
        <ProductPagination/>
    </Container>
  )
}
