import { createContext, useContext } from 'react';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);
export default StoreContext;