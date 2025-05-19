import { $authHost, $host } from "./index";

export const addType = async (nameType) => {
    const { data } = await $authHost.post('api/types', nameType)
    return data
}

export const deleteType = async (id) => {
    const { data } = await $authHost.delete('api/types?id=' + id)
    return data
}

export const fetchTypes = async () => {
    const { data } = await $host.get('api/types')
    return data
}