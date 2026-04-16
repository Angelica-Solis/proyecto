import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'user';

class UserService {
  //trae el nombre del usuario, rol y estado del usuario 
  getUsers() {
    return axios.get(BASE_URL + '/RolEstadoUsuarios/');
  }
  getUserById(id) {
    return axios.get(`user/${id}`);
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

  createUsuario(usuario) {
    return axios.post(BASE_URL, JSON.stringify(usuario));
  }

  getRoles() {
    return axios.get(BASE_URL + '/getRoles/');
  }

  loginUser(User) {
    return axios.post(BASE_URL + '/login/', JSON.stringify(User));
  }
}

export default new UserService();
