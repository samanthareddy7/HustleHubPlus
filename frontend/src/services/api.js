//connects backend and frontend 
//centralises the location of the backend 
//instead of making every conpoment independently find the backend, we store it here 
const API_URL = import.meta.env.VITE_API_URL;

//for authentication and token management 
//jwt is stored in sessionStorage not localStorage 
//so auth is removed when session ends
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

//generic api request 

export const apiRequest = async (path, options = {}) => {
    const token = getToken();

    const headers = {
        'Content-Type':'application/json',
        ...options.headers
    };

    if(token){
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        console.log("API REQUEST:", `${API_URL}${path}`);
        console.log("METHOD:", options.method || "GET");
        console.log("BODY:", options.body);

        const response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers
        });

        console.log("API STATUS:", response.status);

        const data = await response.json().catch(() => ({}));

        console.log("API RESPONSE:", data);

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                `Request failed with status ${response.status}`
            );
        }

        return data;

    } catch (error) {
        console.error("API REQUEST ERROR:", error);

        if (error instanceof TypeError) {
            throw new Error(
                "Unable to connect to the backend. Check that the API is running and the API URL is correct."
            );
        }

        throw error;
    }
};

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

    }

    const data = await response.json();

    return data;
};


const registerUser = async (registrationData) => {

    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(registrationData)
    });

};

const loginUser = async (loginData) => {

    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData)
    });

};

//gigs 

const getGigs = async () => {
    return apiRequest("/gigs");
};

const getMyGigs = async () => {
    return apiRequest("/gigs/mine/list");
};

const getMyBookings = async () => {
    return apiRequest("/bookings/mine");
};

const getFreelancerBookings = async () => {
    return apiRequest("/bookings/freelancer");
};

const getFreelancerIncome = async () => {
    return apiRequest("/transactions/income");
};

export{
    getHealth,
    registerUser,
    loginUser,
    getGigs,
    getMyGigs,
    getMyBookings,
    getFreelancerBookings,
    getFreelancerIncome
};



