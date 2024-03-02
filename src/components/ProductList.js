import React, {useState, useEffect} from "react";
import {getIds, getItems, filterItems} from "../api";
import ProductItem from "./ProductItem";
import "./ProductList.css";

const PAGE_SIZE = 50;

const ProductList = () => {
    const [productIds, setProductIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({field: "product", value: ""});
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProductIds = async () => {
        try {
            setLoading(true);
            const result = await getIds((currentPage - 1) * PAGE_SIZE, PAGE_SIZE);
            setProductIds(result.result);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product IDs:", error.message);
        }
    };
    const fetchFilteredProductIds = async () => {
        try {
            setLoading(true);
            if (filter.value !== "") {
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
                const result = await filterItems(filter.field, parsedValue)
                setProductIds(result.result.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE))
                setLoading(false);
            } else {
                console.error("Invalid filter parameters");
            }
        } catch (error) {
            console.error("Error fetching filtered product IDs:", error.message);
        }
    };

    useEffect(() => {
        if ((filter.field && filter.value !== undefined) &&  filter.value !== "") {
            fetchFilteredProductIds();
        } else {
            fetchProductIds();
        }
    }, [currentPage, filter]);


    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const uniqueIdsSet = new Set(productIds);
                const uniqueIdsArray = Array.from(uniqueIdsSet);
                const result = await getItems(uniqueIdsArray);

                const uniqueProductDetailsMap = new Map();
                result.result.forEach((product) => {
                    uniqueProductDetailsMap.set(product.id, product);
                });
                setProductDetails(Array.from(uniqueProductDetailsMap.values()));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product details:", error.message);
            }
        };

        fetchProductDetails();
    }, [productIds]);

    const handleFilterChange = (field, value) => {
        setFilter({field: field, value: value});
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const resetFilters = () => {
        setFilter({field: "product", value: ""});
        setCurrentPage(1);
    };

    const renderProductList = () => {
        return (
            productDetails &&
            productDetails.map((product) => (
                <ProductItem key={product.id} product={product} />
            ))
        );
    };


    return (
        <div>
            <h1 className="title">Список товаров</h1>
            <div className="filter-div">
                <label className="filter-title">
                    <p>Фильтровать по:</p>
                    <select onChange={(e) => handleFilterChange(e.target.value, filter.value)}>
                        <option value="product">Названию</option>
                        <option value="price">Цене</option>
                        <option value="brand">Бренду</option>
                    </select>
                </label>
                <input
                    type="text"
                    onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                    value={filter.value}
                />
                <button onClick={resetFilters} className="reset-filter-btn btn">Сбросить фильтры</button>
            </div>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div>{renderProductList()}</div>
            )}
            <div className="pages-div">
                <button onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="prev-page-btn btn"
                >
                    Предыдущая страница
                </button>
                <span> Страница {currentPage} </span>
                <button onClick={() => handlePageChange(currentPage + 1)}
                        disabled={productIds.length <  PAGE_SIZE}
                        className="next-page-btn btn"
                >
                    Следующая страница
                </button>
            </div>
        </div>
    );
};

export default ProductList;
