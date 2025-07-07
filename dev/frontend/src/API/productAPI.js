import { $productAuthHost, $productHost } from "./index";

export const createProduct = async (product) => {
    const { data } = await $productAuthHost.post('api/products', product);
    return data;
};

export const deleteProduct = async (id) => {
    const { data } = await $productAuthHost.delete('api/products/' + id);
    return data;
};

export const fetchProducts = async (filter) => {
    return await $productHost.get('api/products/all', {
        params: filter
    });
}

export const fetchOneProduct = async (id) => {
    return await $productHost.get('api/products/' + id);
}

export const fetchRecommendsProduct = async () => {
    return await $productHost.get('api/products/recommends')
}

export const updateProduct = async (productPatch) => {
    return await $productAuthHost.put('api/products/', productPatch);
};

