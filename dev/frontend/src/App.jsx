import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useState, useContext, useEffect } from 'react';
import { check } from './http/userAPI';
import { Context } from './main';
import { fetchBasket } from './http/basketAPI';
import { Shop } from './pages/Shop';
import { NavBar } from './components/NavBar';
import "./style.scss"
import SingleProduct from './pages/SingleProduct';
import { Auth } from './pages/Auth';
import Footer from './components/Footer';
import { Basket } from './pages/Basket';
import Account from './pages/Account';
import { Admin } from './pages/Admin';
import { fetchTypes } from './http/productAPI';
import Success from './pages/Success';
import Canceled from './pages/Canceled';

const App = observer(() => {
    const { user, product } = useContext(Context);
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
                    if (userData != 400 && userData != 401 && userData != 403 && userData != 404 && userData!=500) {
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
                <Route path="/success.html" element={<Success />} />
                <Route path="/canceled.html" element={<Canceled />} />
            </Routes>
            <Footer />
        </Router>
    );
});

export default App;