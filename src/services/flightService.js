import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Укажите актуальный URL

export default {
    getFlights(criteria, pageNo, pageSize) {
        console.log(criteria);
        const params = {
            ...criteria,
            pageNo,
            pageSize
        };
        return axios.get(`${API_URL}/flights`, { params });
    },
    getSeatSchemaWithRecommendations(airplaneId, criteria) {
        const params = {
            airplaneId,
            ...criteria
        };
        return axios.get(`${API_URL}/seat-schemas`, { params });
    },
    generateRandomFlights(count) {
        return axios.post(`${API_URL}/generate/flights`, null, { params: { count } });
    }
}
