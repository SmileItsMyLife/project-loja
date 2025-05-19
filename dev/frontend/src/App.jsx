import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';

import { check } from './http/userAPI';
import { useStore } from './main';

import { fetchBasket } from './http/basketAPI';
import { fetchTypes } from './http/productAPI';

import { Shop } from './pages/Shop';
import { Admin } from './pages/Admin';
import { Basket } from './pages/Basket';
import { Auth } from './pages/Auth';
import { SingleProduct } from './pages/SingleProduct';
import Account from './pages/Account';

import { NavBar } from './components/NavBar';
import Footer from './components/Footer';

import "./style/style.scss"

export const App = observer(() => {
    const { user, product } = useStore();
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const typesData = await fetchTypes();
                console.log('Types data:', typesData);
                product.setTypes(typesData);

                const token = localStorage.getItem('token');
                if (token) {
                    const userData = await check();
                    console.log('User data:', userData);
                    if (userData != 400 && userData != 401 && userData != 403 && userData != 404 && userData!=500 && userData != undefined) {
                        user.setEmail(userData.email);
                        user.setId(userData.id);
                        user.setIsAuth(true);
                        user.setRole(userData.role);
                        user.setIsVerified(userData.verified);
                        const basketData = await fetchBasket();
                        console.log('Basket data:', basketData);
                        product.setBasket(basketData);
                    }
                }
                setDataLoaded(true); // Ensure dataLoaded is set to true
            } catch (error) {
                console.error('Error fetching data:', error);
                setDataLoaded(true); // Set dataLoaded to true even if there's an error
            }
        };
        fetchData();
    }, []); // Use an empty dependency array to run only once

    if (!dataLoaded) {
        return <div>Loading...</div>; // Render the Loading component until data is loaded
    }

    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Shop />} />
                <Route path="/product" element={<SingleProduct />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/basket" element={<Basket />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
            <Footer />
        </Router>
    );
});