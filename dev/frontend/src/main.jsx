import { createContext } from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM from 'react-dom' instead of 'react-dom/client'
import App from './App.jsx';
import UserStore from './store/UserStore.js';
import ProductStore from './store/ProductStore.js';

export const Context = createContext(null);
const email2 = "lol@gmail.com"

// Render the root component using ReactDOM.createRoot() only once
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Context.Provider value={{
      user: new UserStore(),
      product: new ProductStore(),
      email: email2
    }}>
      <App />
    </Context.Provider>
  </>
);