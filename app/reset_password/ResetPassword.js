import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from'@react-navigation/native';
import axios from 'axios';

function ResetPassword() {
    const route = useRoute();
    const { token } = route.params;
    const [tokenError, setTokenError] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handlechange= (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(`https://mouzammil-marecar.fr/user/verify_token?token=${token}`);
                if (response.data.error) {
                    setError(response.data.error);
                    setTokenError(true);  
                }  
            } catch (error) {
                console.error(error);
            } 
        }
        verifyToken();
    }, [token]);

    const handleSubmit = async () => {

        if (formData !== formData.confirmPassword) {
            setPasswordError(true);
            return;
        }

        setPasswordError(false);

        try {
            setLoading(true);
            const response = await axios.put('https://mouzammil-marecar.fr/user/reset_password', {
                token: token,
                password: formData.password
            });
            if (response.data.message) {
                setMessage(response.data.message);
                setSubmitted(true);
            }
            setError(response.data.error);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>

            <Text>Réinitialisation de votre mot de passe</Text>

            {error && <Text style={styles.error}>{error}</Text>}
            {passwordError && <Text style={styles.error}>Les mots de passe ne correspondent pas</Text>}

            {!tokenError && (
                <>
                    {!submitted ? (
                        <>
                        <View style={styles.form}>
                            <Text>Nouveau mot de passe</Text>
                            <TextInput style={styles.input} secureTextEntry onChangeText={(text) => handlechange('password', text)} />
                        </View>
        
                        <View style={styles.form}>
                            <Text>Confirmation de votre mot de passe</Text>
                            <TextInput style={styles.input} secureTextEntry onChangeText={(text) => handlechange('confirmPassword', text)} />
                        </View>
        
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            {loading ? (
                                <ActivityIndicator color='#fff' size='large' />
                            ): (
                                <Text>Confirmer</Text>
                            )}
                        </TouchableOpacity>
                        </>
                    ): (
                        <Text style={styles.message}>{message}</Text>
                    )}
                </>    
            )}
        </View>
    )
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    form: {
        marginBottom: 10
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5   
    },
    button: {
        backgroundColor: '#0d6efd',
        borderRadius: 5,
        paddingVertical: 10
    },
    error: {
        color: 'red',
        borderWidth: 1,
        borderradius: 5
    },
    message: {
        backgroundColor: '#d1e7dd',
        borderRadius: 5,
        alignItems: 'center'
    }
})

export default ResetPassword;