import { $productAuthHost, $productHost } from "./index";

export const createType = async (type) => {
    const { data } = await $productAuthHost.post('api/type/create', type)
    return data
}

export const fetchTypes = async () => {
    const { data } = await $productHost.get('api/types/all')
    return data
}

export const createProduct = async (product) => {
    const { data } = await $productAuthHost.post('api/products', product);
    return data;
};

export const deleteProduct = async (id) => {
    const { data } = await $productAuthHost.delete('api/products/' + id);
    return data;
};

export const fetchProducts = async (typeId, page, limit, sortedBy, name) => {
    try {
        const { data } = await $productHost.get('api/products/all', {
            params: {
                typeId, page, limit, sortedBy, name
            }
        });
        console.log(data)
        return data;
    } catch (error) {
        // Trate o erro aqui
        console.error('Erro ao buscar produtos:', error);
        throw error; // Re-lança o erro para ser tratado no chamador
    }
};

export const fetchOneProduct = async (id) => {
    const { data } = await $productHost.get('api/products/' + id)
    return data
}

export const fetchRecommendsProduct = async () => {
    const { data } = await $productHost.get('api/products/recommends')
    return data
}

export const updateProduct = async (productPatch) => {
    try {
      const { data } = await $productAuthHost.put('api/products/', productPatch);
      console.log('Produto atualizado com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error; // Re-throw the error to handle it elsewhere if needed
    }
  };
  
