import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const StarRating = ({ maxStars = 5, rating = 0, onRatingChange, readOnly = false }) => {
  const [hovered, setHovered] = useState(0);

  // Handle click only if not readOnly
  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="d-flex">
      <p>{rating}</p>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <i
            key={starValue}
            className={`bi ${
              starValue <= (hovered || rating) ? "bi-star-fill text-warning" : "bi-star text-secondary"
            }`}
            style={{ fontSize: "24px", cursor: readOnly ? "default" : "pointer" }}
            onMouseEnter={() => !readOnly && setHovered(starValue)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
