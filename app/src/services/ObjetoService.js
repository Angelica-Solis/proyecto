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
    delete(id) {
        return axios.delete(`${BASE_URL}/delete/${id}`);
    }

    restore(id) {
        return axios.get(`${BASE_URL}/restore/${id}`);
    }
    getEliminados() {
        return axios.get(`${BASE_URL}/eliminados`);
    }

      getUpdateObjeto(objeto) {
    return axios.put(BASE_URL + '/update/' + objeto.id, objeto);
  }

    getObjetoById(ObjetoId) {
    return axios.get(BASE_URL + '/' + ObjetoId);
  }
};

export default new ObjetoService();
