import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react-lite';
import { useStore } from '../main';
import { deleteProduct, fetchBasket } from '../http/basketAPI';

export const ProductCardBasket = observer(({ properts, id }) => {
  const { product } = useStore();

  const handleClose = () => setShowMessage(false);

  const handleDeleteClick = async () => {
    await deleteProduct(id)
    const basketData = await fetchBasket();
    product.setBasket(basketData);
  };

  return (
    <>
      <Card style={{ width: '18rem' }} className='m-3 shadow '>
        <Card.Img variant="top" src={`http://localhost:4242/${properts.img}`} style={{ minHeight: '50%', maxHeight: '50%', objectFit: 'cover' }} />
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Title>{properts.name}</Card.Title>
          <Card.Text>
            {properts.info}
          </Card.Text>
        </Card.Body>
        <Button onClick={handleDeleteClick} className='m-3' variant="primary">Excluir</Button>
      </Card>
    </>
  );
});
