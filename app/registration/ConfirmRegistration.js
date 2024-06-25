import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

function ConfirmRegistration() {
    const route = useRoute();
    const { token } = route.params;
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        console.log(token);
        const confirmRegistration = async () => {
            try {
                const response = await axios.get(`https://mouzammil-marecar.fr/user/confirm_registration?token=${token}`);
                if (response.data.message) {
                    setConfirmationMessage(response.data.message);
                } else {
                    setError(response.data.error);
                }
            } catch (error) {
                console.error(error);
            }
        };

        confirmRegistration();
    }, [token]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Confirmation d'inscription</Text>
            {confirmationMessage !== '' && <Text style={{ margin: 20, color: 'green' }}>{confirmationMessage}</Text>}
            {error !== '' && <Text style={{ margin: 20, color: 'red' }}>{error}</Text>}
        </View>
    )
}

export default ConfirmRegistration;