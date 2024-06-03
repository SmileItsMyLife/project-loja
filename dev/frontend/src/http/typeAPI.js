import { $authHost, $host } from "./index";

export const addType = async (nameType) => {
    const { data } = await $authHost.post('api/types', nameType)
    return data
}

export const deleteType = async (nameType) => {
    const { data } = await $authHost.delete('api/types/' + nameType)
    return data
}

export const fetchTypes = async () => {
    const { data } = await $authHost.get('api/types')
    return data
}