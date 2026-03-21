import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'objeto';

class ObjetoService {


  getListadoObjeto() {
    return axios.get(BASE_URL + '/ListadoObjetos/');
  }

  getDetalleObjeto(id) {
    return axios.get(BASE_URL + '/DetalleObjeto/' + id);
  }
  getActivos() {
    return axios.get(BASE_URL + '/activos/');
  }

  createObjeto(objeto) {
    return axios.post(BASE_URL, JSON.stringify(objeto));
  }
};

export default new ObjetoService();
