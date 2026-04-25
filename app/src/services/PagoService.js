import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'pago';

class PagoService {

    create(pago) {
        return axios.post(BASE_URL, JSON.stringify(pago));
    }
    get(id) {
        return axios.get(BASE_URL + '/detalle/' + id);
    }
    getPagoBySubasta(id) {
        return axios.get(BASE_URL + '/getBySubasta/' + id);
    }

    confirmarPago(idPago) {
        return axios.get(BASE_URL + `/confirmarPago/${Number(idPago)-1}`);
    }
};
export default new PagoService();