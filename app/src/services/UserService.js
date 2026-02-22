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
  getCustomerbyShopRental(ShopRentalId) {
    return axios.get(BASE_URL + '/customerbyShopRental/'+ ShopRentalId);
  }
  createUser(User) {
    return axios.post(BASE_URL, JSON.stringify(User));
  }
  loginUser(User) {
    return axios.post(BASE_URL + '/login/', JSON.stringify(User));
  }
getUserDetail(id) {
  return axios.get(BASE_URL + '/DetalleUsuarios/' + id);
}
}

export default new UserService();
