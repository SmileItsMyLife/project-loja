import React from 'react';
import img from "../images/example.png"

const ExampleCarouselImage = ({ text }) => {
  return (
    <img
      className="d-block w-100"
      src={img}
      alt={text}
    />
  );
};

export default ExampleCarouselImage;