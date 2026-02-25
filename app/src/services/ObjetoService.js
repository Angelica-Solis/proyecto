import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'objeto';

class ObjetoService {


  getListadoObjeto() {
    return axios.get(BASE_URL + '/ListadoObjetos/');
  }

  getDetalleObjeto(id){
    return axios.get(BASE_URL + '/DetalleObjeto/'+ id);
  }
  
};

export default new ObjetoService();
