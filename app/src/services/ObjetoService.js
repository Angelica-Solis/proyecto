import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'objeto';

class ObjetoService {


  getListadoObjeto() {
    return axios.get(BASE_URL + '/ListadoObjetos/');
  }

  getDetalleObjeto(){
    return axios.get(BASE_URL + '/DetalleObjeto/');
  }
  
};

export default new ObjetoService();
