import axios from 'axios';
import ENV from '../env';

const httpClient = axios.create({
  baseURL: ENV.API_ROOT,
});

export default httpClient;
