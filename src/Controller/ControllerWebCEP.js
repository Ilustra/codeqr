import api from '../services/api';

export async function getCEP(cep) {
    return await api.get(`https://viacep.com.br/ws/${cep}/json/`);

}

