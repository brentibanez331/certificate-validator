"use client"
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
    name: string;
    email: string;
}

export const fetchUserInfo = async () => {
    const token = Cookies.get('token');
    if (!token) return null;

    try {
        const response = await axios.get('http://192.168.1.11:5000/api/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        return null;
    }
};