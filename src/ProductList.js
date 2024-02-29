import React, { useState, useEffect } from "react";
import { getIds, getItems, filterItems } from "./api"; // Подключите ваши методы из файла api.js

const PAGE_SIZE = 50;

const ProductList = () => {
    const [productIds, setProductIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({ field: "product", value: "" });
    const [productDetails, setProductDetails] = useState([]);

    useEffect(() => {
        const fetchProductIds = async () => {
            try {
                const result = await getIds((currentPage - 1) * PAGE_SIZE, PAGE_SIZE);
                setProductIds(result.result);
            } catch (error) {
                console.error("Error fetching product IDs:", error.message);
            }
        };

        fetchProductIds();
    }, [currentPage]);

    const fetchFilteredProductIds = async () => {
        try {
            console.log(filter.field, filter.value, filter.value === NaN)
            if (filter.field && filter.value !== undefined) {
                let parsedValue;

                if (filter.field === "price") {
                    parsedValue = parseFloat(filter.value);
                    if (isNaN(parsedValue)) {
                        console.error("Invalid filter parameters: Price must be a number");
                        return;
                    }
                } else {
                    parsedValue = filter.value;
                }
                const result = await filterItems(filter.field, parsedValue);
                setProductIds(result.result);
            } else {
                console.error("Invalid filter parameters");
            }
        } catch (error) {
            console.error("Error fetching filtered product IDs:", error.message);
        }
    };

    useEffect(() => {
        fetchFilteredProductIds();
    }, [filter]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const result = await getItems(productIds);
                setProductDetails(result.result);
            } catch (error) {
                console.error("Error fetching product details:", error.message);
            }
        };

        fetchProductDetails();
    }, [productIds]);

    const handleFilterChange = (field, value) => {
        setFilter({ field: field, value: value });
    };


    const handleSearchClick = () => {
        fetchFilteredProductIds();
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const renderProductList = () => {
        return productDetails.map((product) => (
            <div key={product.id}>
                <p>ID: {product.id}</p>
                <p>Название: {product.product}</p>
                <p>Цена: {product.price}</p>
                <p>Бренд: {product.brand || "Неизвестно"}</p>
                <hr />
            </div>
        ));
    };

    return (
        <div>
            <h1>Список товаров</h1>
            <div>
                <label>
                    Фильтр по:
                    <select onChange={(e) => handleFilterChange(e.target.value, filter.value)}>
                        <option value="product">Названию</option>
                        <option value="price">Цене</option>
                        <option value="brand">Бренду</option>
                    </select>
                </label>
                <input
                    type="text"
                    onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                />
                <button onClick={handleSearchClick}>Поиск</button>
            </div>
            <div>{renderProductList()}</div>
            <div>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Предыдущая страница
                </button>
                <span> Страница {currentPage} </span>
                <button onClick={() => handlePageChange(currentPage + 1)}>
                    Следующая страница
                </button>
            </div>
        </div>
    );
};

export default ProductList;
