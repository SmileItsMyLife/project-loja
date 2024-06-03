import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { Context } from '../main';
import { observer } from 'mobx-react-lite';

const AccountCard = observer(() => {
    const { user, product } = useContext(Context)
    const handleLogout = () => {
        // Remover o token do armazenamento local
        user.setEmail("");
        user.setId(0);
        user.setIsAuth(false);
        user.setRole("GUEST");
        user.setIsVerified(false);
        product.setBasket([])
        localStorage.removeItem('token');
    };

    const purchaseMake = () => {

    }

    return (
        <Card className='shadow my-5'>
            <Card.Header className="bg-primary text-white">Conta</Card.Header>
            <Card.Body>
                <Card.Title className="text-muted mb-4">{user.role}</Card.Title>
                <Card.Text className="mb-2">
                    <strong>Email:</strong> {user.email}
                </Card.Text>
                <Card.Text className="mb-4">
                    <strong>Verificado:</strong> {user.isVerified ? 'Sim' : 'Não'}
                </Card.Text>
                <div className="d-flex justify-content-between">
                    <Link to="/" onClick={handleLogout}>
                        <Button variant="danger">Log out</Button>
                    </Link>
                    <Button onClick={purchaseMake} variant="success">Pagar a caixa</Button>
                </div>
            </Card.Body>
        </Card>
    );
})

export default AccountCard;