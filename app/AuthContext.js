import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedUser, setIsLoggedUser] = useState(false);
    const [isLoggedAdmin, setIsLoggedAdmin] = useState(false);
    const [userData, setUserData] = useState({
        id: '',
        civility: '',
        email: '',
        lastname: '',
        firstname: '',
        roles: []
    });

    const [adminData, setAdminData] = useState({
        email: '',
        roles: []
    });

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const tokenAdmin = await AsyncStorage.getItem('token');

                if (token) {
                    const decodedToken = jwtDecode(token);
                        setIsLoggedUser(true);
                        setUserData({
                            id: decodedToken.id,
                            civility: decodedToken.civility,
                            email: decodedToken.email,
                            lastname: decodedToken.lastname,
                            firstname: decodedToken.firstname,
                            roles: decodedToken.roles
                        });
                }

                if (tokenAdmin) {
                   const decodedToken = jwtDecode(tokenAdmin);
                    setIsLoggedAdmin(true);
                    setAdminData({
                        email: decodedToken.username,
                        roles: decodedToken.roles
                    });
                } 
            } catch (error) {
                console.log(error);
            }
        };
        fetchToken();    
    }, []);

    const login = async (token) => {
        try {
            await AsyncStorage.setItem('token', token);
            setIsLoggedUser(true);
        } catch (error) {
            console.log('Failed to save token', error);
        }
    }

    const loginAdmin = async (token) => {
        try {
            await AsyncStorage.setItem('token', token);
            setIsLoggedAdmin(true);
        } catch (error) {
            console.log('Failed to save token', error);
        }
    }

    const user = (newUserData) => {
        setIsLoggedUser(true);
        setUserData(newUserData);
    }

    const admin = (newAdminData) => {
        setIsLoggedAdmin(true);
        setAdminData(newAdminData);
    }

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setIsLoggedUser(false);
        setIsLoggedAdmin(false);
    }

    return (
        <AuthContext.Provider value={{ isLoggedUser, isLoggedAdmin, userData, adminData, user, admin, login, loginAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);