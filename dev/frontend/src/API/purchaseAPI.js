import { $authHost, $host } from "./index";

export const addPurchase = async () => {
    const { data } = await $authHost.post('api/purchases')
    return data
}

export const getPurchases = async () => {
    const { data } = await $authHost.get('api/purchases/user')
    return data
}