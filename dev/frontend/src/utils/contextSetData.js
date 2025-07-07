import { jwtDecode } from 'jwt-decode';

export const setUserContext = (userData, usertore) => {
    const decodedData = jwtDecode(userData);
    usertore.setIsAuth(true);
    usertore.setId(decodedData.id);
    usertore.setRole(decodedData.role);
    usertore.setEmail(decodedData.email);
    usertore.setIsVerified(decodedData.verified);
}

export const setUserContextDefault = (usertore, productStore) => {
    usertore.setEmail("");
    usertore.setId(0);
    usertore.setIsAuth(false);
    usertore.setRole("GUEST");
    usertore.setIsVerified(false);
    productStore.setBasket([])
    localStorage.removeItem('token');
}