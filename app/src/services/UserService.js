import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'user';

class UserService {
  //trae el nombre del usuario, rol y estado del usuario 
  getUsers() {
    return axios.get(BASE_URL + '/RolEstadoUsuarios/');
  }
  getUserById(UserId) {
    return axios.get(BASE_URL + '/' + UserId);
  }
  getAllCustomer() {
    return axios.get(BASE_URL + '/allCustomer/');
  }
  getUserDetail(id) {
    return axios.get(BASE_URL + '/DetalleUsuarios/' + id);
  }
  getUserUpdate(usuario) {
    return axios.put(BASE_URL + '/update/' + usuario.id, usuario);
  }
}

export default new UserService();
