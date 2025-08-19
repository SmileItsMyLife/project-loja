import { $typeAuthHost, $typeHost } from "./index";

export const addType = async (typeName) => {
    return await $typeAuthHost.post('api/types/create', typeName);
}

export const deleteType = async (id) => {
    return await $typeAuthHost.delete('api/types/delete/?id=' + id);
}

export const fetchTypes = async () => {
    return await $typeHost.get('api/types/all');
}