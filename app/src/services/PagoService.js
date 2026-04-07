import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'pago';

class PagoService {

    create(pago) {
        return axios.post(BASE_URL, JSON.stringify(pago));
    }
    get(id) {
        return axios.get(BASE_URL + '/detalle/' + id);
    }
};
export default new PagoService();