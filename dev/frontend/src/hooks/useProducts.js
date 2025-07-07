import { useState, useEffect } from 'react';
import { fetchProducts, fetchRecommendsProduct } from '../API/productAPI';
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

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchProducts(productFilter);
            const recommendProducts = await fetchRecommendsProduct()<
            console.log(response.data);
            product.setProducts(response.data.products);
            product.setTotalPages(response.data.totalPages);
            product.setRecommends(recommendProducts.data);
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productFilter]);

    return { productFilter, setProductFilter, product };
}