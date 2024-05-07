import { $authHost, $host } from "./index";

export const addProduct = async (productId) => {
    const { data } = await $authHost.post('api/basket-products', {productId})
    return data
}

export const deleteProduct = async (productId) => {
    const { data } = await $authHost.delete('api/basket-products?productId=' + productId)
    return data
}

export const fetchBasket = async () => {
    const { data } = await $authHost.get('api/basket-products')
    return data
}