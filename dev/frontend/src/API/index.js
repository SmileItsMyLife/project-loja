import axios from "axios";

const getBaseUrl = (port) => `http://localhost:${port}`;
const createApi = (port) => axios.create({ baseURL: getBaseUrl(port) });

const $host = createApi(4242);
const $authHost = createApi(4242);
const $userHost = createApi(4243);
const $userAuthHost = createApi(4243);
const $productHost = createApi(4245);
const $productAuthHost = createApi(4245);

const authInterceptor = config => {
    try {
        const token = localStorage.getItem('token');
        if (token) config.headers.authorization = `Bearer ${token}`;
        return config;
    } catch (error) {
        console.error('Error in authInterceptor:', error);
        return config;
    }
};

$authHost.interceptors.request.use(authInterceptor);
$userAuthHost.interceptors.request.use(authInterceptor);
$productAuthHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost,
    $userHost,
    $userAuthHost,
    $productHost,
    $productAuthHost
};