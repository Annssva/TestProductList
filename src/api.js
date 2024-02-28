import md5 from 'md5';

const API_URL = "https://api.valantis.store:41000/";
const PASSWORD = "Valantis";

const generateAuthHeader = () => {
    const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const authString = `${PASSWORD}_${timestamp}`;
    return {
        "X-Auth": md5(authString),
    };
};

export const fetchData = async (action, params = {}) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                ...generateAuthHeader(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ action, params }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
            console.error("Ошибка API:", data.error);
            throw new Error(`Ошибка API! ${data.error}`);
        }

        return data.result;
    } catch (error) {
        console.error("Ошибка при получении данных:", error.message);
        throw error;
    }
};