//connects backend and frontend 
//centralises the location of the backend 
//instead of making every conpoment independently find the backend, we store it here 
const API_URL = import.meta.env.VITE_API_URL;


//req the health information
//asynchronous rrquest because it is a network request
const getHealth = async () => {
    const response = await fetch(
        `${API_URL}/health`
    );

    if(!response.ok){
        throw new Error(
            "Could not connect to the backend"
        );

        const data = await response.json();

    }

    return data;
};

const registerUser = async(
    registratioData
) => {
    //send reqs to the backend = communicating with reg endpoint
    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            //specify http method using
            method:"POST",


            //tells the backend that the reg body has json data 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registratioData)
            
        }
    );
    //converting the backend json res into js 
    const data = await response .json();

    if(!response.ok){
        throw new Error(
            data.error || "Registration failed"
        );

    }

    return data;

};

const loginUser = async(
    loginData
) => {
    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registratioData)
        }
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error(
            data.error || "Login failed."
        );
    }

    return data;
};

export{
    getHealth,
    registerUser,
    loginUser
};

export const getToken = () => {
    return sessionStorage.getItem('token');
};

export const saveAuth = (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
sessionStorage.removeItem('token');
sessionStorage.removeItem('user');
};

export const getSavedUser =() => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const apiRequest = async (path, options = {}) => {
    const token = getToken();

    const headers = {
        'Content-Type':'application/json',
        ...options.headers
    };

    if(token){
        headers.Authorization = 'Bearer ${token';
    }

    const response = await fetch('${API_URL}${path}', {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok){
        throw new Error(data.error || 'Request failed');
    }

    return data;
};