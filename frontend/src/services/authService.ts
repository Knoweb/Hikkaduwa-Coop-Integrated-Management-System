import api from '../api/axiosConfig';

export const loginUser = async (username: string, password: string): Promise<string> => {
    console.log("DEBUG: Sending request with:", { username, password });
    try {
        // The Gateway expects a JSON body with username and password
        const response = await api.post<string>('/auth/token', {
            username,
            password
        });

        // Extract the raw string token
        const token = response.data; 
        
        // Store it securely in the browser
        localStorage.setItem('jwt_token', token);
        
        return token;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const logoutUser = (): void => {
    localStorage.removeItem('jwt_token');
};