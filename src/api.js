import axios from 'axios';

const md5 = require('md5');
const API_URL = "http://api.valantis.store:40000/";
const API_SECURE_URL = "https://api.valantis.store:41000/";
const PASSWORD = "Valantis";

const generateXAuth = () => {
    const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const authString = `${PASSWORD}_${timestamp}`;
    return md5(authString);
};

const makeApiRequest = async (endpoint, method, payload) => {
    const url = API_SECURE_UR;
    const headers = {
        "Content-Type": "application/json",
        "X-Auth": generateXAuth(),
    };

    try {
        const response = await axios({
            method: method,
            url: url + endpoint,
            headers: headers,
            data: payload,
        });

        if (response.status !== 200) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка запроса к API:", error.message);
        throw error;
    }
};


export const getIds = async (offset = 0, limit = 10) => {
    const payload = {
        action: "get_ids",
        params: { offset, limit },
    };

    return await makeApiRequest("", "POST", payload);
};

export const getItems = async (ids) => {
    if (!ids || ids.length === 0) {
        return null;
    }

    const payload = {
        action: "get_items",
        params: { ids },
    };

    return await makeApiRequest("", "POST", payload);
};

const getFields = async (field, offset = 0, limit = 10) => {
    const payload = {
        action: "get_fields",
        params: { field, offset, limit },
    };

    return await makeApiRequest("", "POST", payload);
};

export const filterItems = async (field, value) => {
    const endpoint = "";
    const method = "POST";
    const payload = {
        action: "filter",
        params: { [field]: value },
    };

    try {
        return await makeApiRequest(endpoint, method, payload);
    } catch (error) {
        console.error("Error fetching filtered product IDs:", error.message);
        throw error;
    }
};


