import React, { useState, useEffect } from "react";
import { fetchData } from "./api";
// Добавленный метод для фильтрации
// ...

export const filterData = async (params) => {
    try {
        const response = await fetchData("filter", params);

        if (response.status !== undefined && !response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Response from filterData:", response);

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data && data.result) {
                // Проверка, что data.result - это массив
                if (Array.isArray(data.result)) {
                    return data.result;
                } else {
                    console.error("Ответ не содержит массив идентификаторов");
                    return [];
                }
            } else {
                console.error("Ответ не содержит ожидаемых данных");
                return [];
            }
        } else {
            console.error("Ответ не содержит JSON");
            return [];
        }
    } catch (error) {
        console.error("Ошибка при фильтрации данных:", error.message);
        throw error;
    }
};

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({});
    const [productNameFilter, setProductNameFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");
    const [brandFilter, setBrandFilter] = useState("");

    const fetchProducts = async () => {
        try {
            const offset = (currentPage - 1) * 50;
            const limit = 50;

            if (Object.keys(filter).length > 0) {
                console.log("Offset:", offset);
                console.log("Limit:", limit);
                console.log("Filter:", filter);

                // Запрашиваем идентификаторы товаров с учетом фильтров
                const filteredProductIds = await filterData(filter);

                console.log("Filtered Product IDs:", filteredProductIds);

                // Запрашиваем товары по отфильтрованным идентификаторам
                const productList = await fetchData("get_items", { ids: filteredProductIds });
                setProducts(productList);
            } else {
                console.log("Фильтр не задан");

                // Если фильтр не задан, запрашиваем все товары
                const productIds = await fetchData("get_ids", { offset, limit });
                const productList = await fetchData("get_items", { ids: productIds });
                setProducts(productList);
            }
        } catch (error) {
            console.error("Ошибка при получении товаров:", error.message);
        }
    };


    const handleFilterChange = () => {
        const newFilter = {
            product: productNameFilter,
            price: priceFilter !== "" ? parseFloat(priceFilter) : undefined,
            brand: brandFilter,
        };

        // Проверка наличия значений в фильтрах перед установкой
        const filteredValues = Object.values(newFilter).filter(value => value !== undefined && value !== "");
        const finalFilter = filteredValues.length > 0 ? newFilter : {};

        console.log("Новый фильтр:", finalFilter); // Вывод в консоль для отладки

        setFilter(finalFilter);
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, filter]);

    useEffect(() => {
        handleFilterChange();
    }, [productNameFilter, priceFilter, brandFilter]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <h1>Список товаров</h1>
            {/* Поля ввода для фильтрации */}
            <input
                type="text"
                placeholder="Фильтр по названию"
                value={productNameFilter}
                onChange={(e) => setProductNameFilter(e.target.value)}
            />
            <input
                type="number"
                placeholder="Фильтр по цене"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
            />
            <input
                type="text"
                placeholder="Фильтр по бренду"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
            />

            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {`ID: ${product.id}, Название: ${product.product}, Цена: ${product.price}, Бренд: ${product.brand || 'N/A'}`}
                    </li>
                ))}
            </ul>
            <div>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Предыдущая страница
                </button>
                <span>Страница {currentPage}</span>
                <button onClick={() => handlePageChange(currentPage + 1)}>Следующая страница</button>
            </div>
        </div>
    );
};

export default ProductList;