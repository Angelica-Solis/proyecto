import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'subasta';

class SubastaService {
    getActivas() {
    return axios.get(BASE_URL + '/activas/');
    }

    getFinalizadas() {
    return axios.get(BASE_URL + '/finalizadas/');
    }

    getDetalle(id) {
    return axios.get(BASE_URL + '/' + id);
    }

    // Traer todas para la tabla de mantenimiento
    getAll() {
        return axios.get(BASE_URL + '/all/');
    }

    // Crear (envía el objeto al controller)
    create(subasta) {
        return axios.post(BASE_URL + '/create/', subasta);
    }

    // Actualizar
    update(subasta) {
        return axios.put(BASE_URL + '/update/', subasta);
    }

    // Publicar (solo cambia estado)
    publicar(id) {
        return axios.get(BASE_URL + '/publicar/' + id);
    }

    // Cancelar (solo cambia estado)
    cancelar(id) {
        return axios.get(BASE_URL + '/cancelar/' + id);
    }
}

export default new SubastaService();