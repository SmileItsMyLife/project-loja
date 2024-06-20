import axios from "axios";

// Cria uma instância do axios com a baseURL definida como "http://localhost:5000"
const $host = axios.create({
    baseURL: "http://localhost:4242"
})

// Cria outra instância do axios com a mesma baseURL, que será usada para requisições autenticadas
const $authHost = axios.create({ 
    baseURL: "http://localhost:4242"
})

// Interceptor que adiciona o token de autorização ao cabeçalho das requisições
const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}` // Adiciona o token armazenado no localStorage
    return config
}

// Adiciona o interceptor de requisição à instância $authHost
$authHost.interceptors.request.use(authInterceptor)

export {
    $host,     // Exporta a instância para requisições não autenticadas
    $authHost  // Exporta a instância para requisições autenticadas
}