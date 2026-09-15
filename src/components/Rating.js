import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Rating = ({ rate, count, size = "sm" }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const fill = rate - i;
    if (fill >= 0.75) return <FaStar key={i} />;
    if (fill >= 0.25) return <FaStarHalfAlt key={i} />;
    return <FaRegStar key={i} />;
  });

  return (
    <span
      className={`rating rating--${size}`}
      role="img"
      aria-label={`Rated ${rate} out of 5 from ${count} reviews`}
    >
      <span className="rating__stars" aria-hidden="true">
        {stars}
      </span>
      {count !== undefined && <span className="rating__count">({count})</span>}
    </span>
  );
};

export default Rating;
