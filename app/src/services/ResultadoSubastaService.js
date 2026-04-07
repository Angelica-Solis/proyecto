import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'resultado';

class ResultadoSubastaService {

    get(id) {
        return axios.get(BASE_URL + '/detalle/' + id);
    }
};
export default new ResultadoSubastaService();