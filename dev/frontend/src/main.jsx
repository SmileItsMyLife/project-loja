import { createContext } from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import UserStore from './store/UserStore.js';
import ProductStore from './store/ProductStore.js';

// Criação de um contexto com valor inicial null
export const Context = createContext(null);

// Renderização do componente raiz usando ReactDOM.createRoot() apenas uma vez
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    {/* O Context.Provider envolve o componente App para fornecer os valores user, product e email */}
    <Context.Provider value={{
      user: new UserStore(),
      product: new ProductStore(),
    }}>
      <App />
    </Context.Provider>
  </>
);
