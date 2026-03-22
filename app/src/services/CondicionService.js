import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'condicion';

class CondicionService {
    getCondiciones() {
        return axios.get(BASE_URL);
    }
}

export default new CondicionService();