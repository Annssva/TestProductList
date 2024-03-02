import React from "react";
import "./ProductItem.css";

const ProductItem = ({ product }) => {
    return (
        <div className="product-item">
            <p className="product-info">ID: {product.id}</p>
            <hr className="product-divider" />
            <p className="product-info">Название: {product.product}</p>
            <p className="product-info">Цена: {product.price}</p>
            <p className="product-info">Бренд: {product.brand || "Неизвестно"}</p>
        </div>
    );
};

export default ProductItem;
