import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useStore } from '../main';
import { observer } from 'mobx-react-lite';

const AccountCard = observer(() => {
    const { user, product } = useStore()

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
                    <Link to="/payment-data">
                        <Button variant="link">Pay</Button>
                    </Link>
                    {/* */}
                    {/* https://chatgpt.com/share/b6c77bb9-b6ea-4b52-a090-36f1a1618548 */}
                </div>
            </Card.Body>
        </Card>
    );
})

export default AccountCard;