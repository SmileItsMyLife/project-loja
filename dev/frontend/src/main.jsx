import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';

import UserStore from './store/UserStore.js';
import ProductStore from './store/ProductStore.js';
import StoreContext from './hooks/useStore.js';
import TypeStore from './store/TypeStore.js';

// Initialize stores once
const store = {
  user: new UserStore(),
  product: new ProductStore(),
  type: new TypeStore()
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>
);