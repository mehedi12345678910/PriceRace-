import React from "react";
import { Link } from "react-router";

const Product = ({ product }) => {
  const { _id, title, price_min, price_max, image } = product;
  return (
    <div className="card bg-base-100  shadow-sm">
      <figure className="px-4 pt-4">
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
          className="rounded-xl"
        />
      </figure>
      <div className="card-body ">
        <div className="w-full flex justify-between items-center gap-35">
          <h2 className="card-title flex-1">{title}</h2>
          <p className="font-bold flex-1">
            Price : ${price_min}-${price_max}
          </p>
        </div>

        <div className="card-actions">
          <Link
            to={`/productDetails/${_id}`}
            className="btn btn-primary w-full"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
