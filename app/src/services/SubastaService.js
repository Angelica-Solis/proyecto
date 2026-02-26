import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'subasta';

class SubastaService {
    getActivas() {
    return axios.get(BASE_URL + '/activas/');
    }

    getFinalizadas() {
    return axios.get(BASE_URL + '/finalizadas/');
    }

    getDetalle(id) {
    return axios.get(BASE_URL + '/' + id);
    }
}

export default new SubastaService();