import { $userHost, $userAuthHost } from "./index";
import { jwtDecode } from "jwt-decode";

// Função de registro de usuário
export const registration = async (email, password) => {
    try {
        // Verifica se o email e a senha foram fornecidos
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        // Envia uma solicitação POST para o endpoint de registro
        const res = await $userHost.post('api/users/registration', { email, password });
        if (res.status === 200) {
            // Armazena o token JWT no localStorage
            localStorage.setItem('token', res.data.token);
            return jwtDecode(res.data.token); // Retorna o token JWT decodificado
        }
        // Trata outras respostas de sucesso, se necessário
    } catch (error) {
        // Trata erros
        if (error.response) {
            // A solicitação foi feita e o servidor respondeu com um status fora do intervalo 2xx
            console.error('Error response status:', error.response.status);
            return error.response.status; // Retorna o código de status do erro
        } else if (error.request) {
            // A solicitação foi feita, mas nenhuma resposta foi recebida
            console.error('No response received');
            return 500; // Retorna um código de erro genérico
        } else {
            // Algo deu errado na configuração da solicitação que desencadeou um erro
            console.error('Request setup error:', error.message);
            return 500; // Retorna um código de erro genérico
        }
    }
};

// Função de login de usuário
export const login = async (email, password) => {
    try {
        // Verifica se o email e a senha foram fornecidos
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        // Envia uma solicitação POST para o endpoint de login
        const { data } = await $userHost.post('api/users/login', { email, password }).then(response => {
            localStorage.setItem('token', response.data.token);
            console.log(response)
            return jwtDecode(response.data.token);
        });
    } catch (error) {
        // Trata erros
        if (error.response) {
            // A solicitação foi feita e o servidor respondeu com um status fora do intervalo 2xx
            console.error('Error response status:', error.response.status);
            return error.response.status; // Retorna o código de status do erro
        } else if (error.request) {
            // A solicitação foi feita, mas nenhuma resposta foi recebida
            console.error('No response received');
            return 500; // Retorna um código de erro genérico
        } else {
            // Algo deu errado na configuração da solicitação que desencadeou um erro
            console.error('Request setup error:', error.message);
            return 500; // Retorna um código de erro genérico
        }
    }
};

// Função para verificar a autenticação do usuário
export const check = async () => {
    try {
        // Envia uma solicitação GET para o endpoint de verificação de autenticação
        const { data } = await $userAuthHost.get('api/users/auth');
        // Armazena o token JWT no localStorage
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token); // Retorna o token JWT decodificado
    } catch (error) {
        // Trata erros
        if (error.response) {
            console.error('Error response status:', error.response.status);
            return error.response.status; // Retorna o código de status do erro
        }
    }
}