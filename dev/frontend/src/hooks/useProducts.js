import { useState, useEffect } from 'react';
import { fetchProducts, fetchRecommendsProduct, updateProduct } from '../API/productAPI';
import { useStore } from './useStore';

export function useProduct() {
    const { product } = useStore();
    const [productFilter, setProductFilter] = useState({
        typeId: 0,
        page: 1,
        limit: 3,
        sortedBy: "normal",
        name: ""
    });

    const refreshProducts = async () => {
        try {
            const response = await fetchProducts(productFilter);
            const recommendProducts = await fetchRecommendsProduct();
            product.setProducts(response.data.products);
            product.setTotalPages(response.data.totalPages);
            product.setRecommends(recommendProducts.data);
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    }

    const updateProductById = async (data) => {
        try {
            const response = await updateProduct(data);
            await refreshProducts();
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error };
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchProducts(productFilter);
            const recommendProducts = await fetchRecommendsProduct();
            product.setProducts(response.data.products);
            product.setTotalPages(response.data.totalPages);
            product.setRecommends(recommendProducts.data);
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productFilter]);

    return { productFilter, setProductFilter, product, updateProductById, refreshProducts };
}