import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'subasta';
const BASE_PUJA = import.meta.env.VITE_BASE_URL + "subasta/createPuja";

class PujaService {

    historial(idSubasta) {
        return axios.get(`${BASE_URL}/historial/${idSubasta}`);
    }

    createPuja(data, usuarioId) {
        return axios.post(BASE_PUJA, {
            ...data,
            idUsuario: usuarioId
        });
    }
    obtenerCompradores() {
        return axios.get(BASE_URL + '/obtenerCompradores/');
    }
}

export default new PujaService();