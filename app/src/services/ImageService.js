import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'image';

class ImageService {
    createImage(formData) {
        return axios.post(BASE_URL, formData);
    }

    updateImage(formData) {
        return axios.post("http://localhost:81/proyecto/api/image/update", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }
}

export default new ImageService();