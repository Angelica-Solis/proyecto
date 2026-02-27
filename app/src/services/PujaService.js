import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'subasta';

class PujaService {

    historial($idSubasta){
    return axios.get(BASE_URL + '/historial/'+ $idSubasta);
    }

}

export default new PujaService();