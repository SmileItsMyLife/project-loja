import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { addProduct, deleteProduct } from '../http/basketAPI';
import { observer } from 'mobx-react-lite';
import { fetchBasket } from '../http/basketAPI';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../main';
import StarRating from './UI/StarRating';

export const ProductCard = observer(({ properts }) => {
  const { user, product } = useStore();
  const navigate = useNavigate();

  const [showMessage, setShowMessage] = useState(false);
  const handleClose = () => setShowMessage(false);

  const handleBuyClick = async () => {
    if (!user.isAuth) {
      navigate('auth');
    } else {
      await addProduct(properts.id).then(() => {
        setShowMessage(true)
      })
      const basketData = await fetchBasket();
      product.setBasket(basketData);
    }
  };

  return (
    <>
      <Card style={{ width: '18rem', height: '28rem' }} className="m-3 shadow">
        <Card.Img
          variant="top"
          src={`http://localhost:4242/${properts.img}`}
          style={{ minHeight: '50%', maxHeight: '50%', objectFit: 'cover' }}
        />
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Title>{properts.name}</Card.Title>
          <Card.Text>
            {properts.info}
          </Card.Text>
          <StarRating maxStars={5} rating={4} readOnly={true} />
          {/* Buttons wrapped in a flex container */}
          <div className="d-flex justify-content-around">
            <Button className="" variant="primary" onClick={handleBuyClick}>Comprar</Button>
            <Button className="" variant="primary" onClick={() => { navigate(`product?id=${properts.id}`) }}>Observar</Button>
          </div>
        </Card.Body>
      </Card>
      <Modal show={showMessage} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body>O produto foi colocado à caixa!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});
