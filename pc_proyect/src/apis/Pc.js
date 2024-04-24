import axios from 'axios';

const BASE_URL = 'http://localhost/lab%20mac/pc_proyect/src/';

const fetchData = async (endpoint) => {
    try {
        const response = await axios.get(BASE_URL + endpoint);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        throw new Error(`Error fetching data from ${endpoint}`);
    }
};

const postData = async (endpoint, data) => {
    try {
        const response = await axios.post(BASE_URL + endpoint, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error posting data to ${endpoint}:`, error);
        throw new Error(`Error posting data to ${endpoint}`);
    }
};

export const fetchPCs = async () => {
    return await fetchData('server/index.php');
};

export const updatePc = async (pcData) => {
    return await postData('server/actualizar.php', pcData);
};

export const createPC = async (pcData) => {
    return await postData('server/crearpc.php', pcData);
};

export const deletePc = async (pcId) => {
    return await postData('server/eliminar.php', { ID: pcId });
};
