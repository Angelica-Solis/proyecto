import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'subasta';
const BASE_PUJA = import.meta.env.VITE_BASE_URL + "subasta/createPuja";

class PujaService {

    historial(idSubasta) {
        return axios.get(`${BASE_URL}/historial/${idSubasta}`);
    }

    createPuja(data, usuarioId) {
        return axios.post(BASE_PUJA, data, {
            headers: {
                "X-Usuario-Id": usuarioId, //ID del usuario actual
            }
        });
    }
}

export default new PujaService();