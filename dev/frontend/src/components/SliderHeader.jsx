import { observer } from 'mobx-react-lite';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from 'react';
import { fetchRecommendsProduct } from '../http/productAPI';
import { useStore } from '../main';

export const SliderHeader = observer(() => {
    const { product } = useStore()

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchRecommendsProduct().then((data) => {
                    product.setRecommends(data)
                });
            } catch (error) {
                console.error("Error fetching recommended products:", error);
            }
        };

        fetchData();
    }, []);


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024, // Tablets
                settings: {
                    slidesToShow: 4, // Adjusted value
                },
            },
            {
                breakpoint: 768, // Smaller tablets
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480, // Mobile
                settings: {
                    slidesToShow: 2, // Ensure enough spacing
                },
            },
        ],
    };
    
    return (
        <>
            <Slider  {...settings}>
                {product.recommends.map((product) => (
                    <div key={product.id} className="p-2">
                        <div className="bg-white rounded-xl shadow-md p-4 bg-primary">
                            <img
                                src={`http://localhost:4242/${product.img}`}
                                alt={product.name}
                                className='img-fluid rounded mx-auto d-block'
                                style={{ objectPosition: "center", objectFit: "cover", height: "200px" }}
                            >
                            </img>
                            <h3 className="text-center mt-2">{product.name}</h3>
                        </div>
                    </div>
                ))}
            </Slider>
        </>
    )
})
