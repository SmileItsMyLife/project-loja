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

    return (
        <Card className='shadow my-5'>
            <Card.Header>Conta</Card.Header>
            <Card.Body>
                <Card.Title>{user.role}</Card.Title>
                <Card.Text>
                    {user.email}
                </Card.Text>
                <Link to="/" onClick={handleLogout}>
                    <Button variant="danger">Log out</Button>
                </Link>
            </Card.Body>
        </Card>
    );
})

export default AccountCard;