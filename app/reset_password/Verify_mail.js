import{ useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

function VerifyMail() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        console.log(email);
        setLoading(true);

        try {
            const response = await axios.get(`https://mouzammil-marecar.fr/user/verify_mail?email=${email}`);
            if (response.data.message) {
                setMessage(response.data.message);
                setSubmitted(true);
            } else {
                setError(response.data.error);
            } 
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Confirmer votre adresse email</Text>
                    {!submitted ? (
                        <>
                            <Text>Adresse email</Text>
                            <TextInput style={styles.input} value={email} onChangeText={text => setEmail(text)} />
                             
                            <Button color='#0d6efd' title='Vérifier' onPress={handleSubmit} disabled={loading} />
                        </> 
                    ): (
                        <Text style={styles.successMessage}>{message}</Text>
                    )}
                    
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16
    },
    card: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        elevation: 3
    },
    title: {
        marginBottom: 20
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10
    },
    successMessage: {
        color: 'green'
    }
})

export default VerifyMail;