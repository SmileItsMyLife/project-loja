import axios from "axios";

const $host = axios.create({
    baseURL: //"https://a870-88-157-232-138.ngrok-free.app"
    "http://localhost:4242" 
})

const $authHost = axios.create({ 
    baseURL: //"https://a870-88-157-232-138.ngrok-free.app"
    "http://localhost:4242" 
})

const $userHost = axios.create({
    baseURL: //"https://a870-88-157-232-138.ngrok-free.app"
    "http://localhost:4243" 
})

const $userAuthHost = axios.create({ 
    baseURL: //"https://a870-88-157-232-138.ngrok-free.app"
    "http://localhost:4243" 
})


const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}` // Adiciona o token armazenado no localStorage
    return config
}

$authHost.interceptors.request.use(authInterceptor)
$userAuthHost.interceptors.request.use(authInterceptor)

export {
    $host,     // Exporta a instância para requisições não autenticadas
    $authHost,
    $userHost,
    $userAuthHost  // Exporta a instância para requisições autenticadas
}