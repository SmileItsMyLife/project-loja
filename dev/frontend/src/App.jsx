import { BrowserRouter as Router, Routes, /*Route*/ } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

// import { Shop } from './pages/Shop';
// import { Admin } from './pages/Admin';
// import { Basket } from './pages/Basket';
// import { Auth } from './pages/Auth';
// import { SingleProduct } from './pages/SingleProduct';
// import Account from './pages/Account';

import { NavBar } from './components/NavBar';
import Footer from './components/Footer';

import "./style/style.scss"
import { useAuth } from './hooks/useAuth';

export const App = observer(() => {
    const { isAuth, loading, error } = useAuth();
    console.log(isAuth, loading, error)
    return (
        <Router>
            <NavBar />
            <Routes>
                {/* <Route path="/" element={<Shop />} /> */}
                {/* <Route path="/product" element={<SingleProduct />} /> */}
                {/* <Route path="/auth" element={<Auth />} />
                <Route path="/basket" element={<Basket />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin" element={<Admin />} /> */}
            </Routes>
            <Footer />
        </Router>
    );
});