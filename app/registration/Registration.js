import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { format } from 'date-fns';
import axios from 'axios';

function Registration() {

    const [ formData, setFormData] = useState({
        civility: '',
        lastname: '',
        firstname: '',
        dateOfBirth: new Date(),
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [formFieldsError, setFormFieldsError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [datePicker, setDatePicker] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState, 
            [name]: value 
        }));
    };

    const handleSubmit = async () => {

        const allFieldsFilled = Object.values(formData).every(value => value !== '');

        if (!allFieldsFilled) {
            setFormFieldsError(true);
            setPasswordError(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordError(true);
            return;
        }

        const formDataToSend = new FormData();

        for (let key in formData) {
            if (key === 'dateOfBirth') {
                formDataToSend.append(key, format(formData[key], 'yyyy-MM-dd'));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        }

        try {
            setIsLoading(true);

            const response = await axios.post('https://mouzammil-marecar.fr/user/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'User-Agent': 'location-voiture/1.0.0'
                }
            });
            console.log(response.data);
            if(response.data.message) {
                setMessage(response.data.message);
                setSubmitted(true);
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
            <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 15 }}>Bienvenue dans la page d'inscription</Text>
            {!submitted ? (
                <View>
                    {formFieldsError && (
                        <Text style={styles.error}>Veuillez renseigner tous les champs.</Text>
                    )}
                    <Text>Civilité :</Text>
                    <View style={styles.pickerStyle}>
                        <Picker selectedValue={formData.civility} onValueChange={(itemValue) => handleChange('civility', itemValue)}>
                            <Picker.Item label="Choisissez une option" value="" />
                            <Picker.Item label="Monsieur" value="Monsieur" />
                            <Picker.Item label="Madame" value="Madame" />
                        </Picker>
                    </View>    
                        
                    <View>
                        <Text>Nom :</Text>
                        <TextInput style={styles.input} onChangeText={(text) => handleChange('lastname', text)} />
                    </View>

                    <View>
                        <Text>Prénom :</Text>
                        <TextInput style={styles.input} onChangeText={(text) => handleChange('firstname', text)} />
                    </View>

                    <View>
                        <Text>Date de naissance :</Text>
                        <TouchableOpacity onPress={() => setDatePicker(true)}>
                            <Text style={styles.input}>
                                {new Date(formData.dateOfBirth).toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                            {datePicker && (
                                <DateTimePicker
                                    value={formData.dateOfBirth}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const currentDate = selectedDate || formData.dateOfBirth;
                                        setDatePicker(false); 
                                        handleChange('dateOfBirth', currentDate);
                                    }}
                                />    
                            )}
                    </View>

                    <View>
                        <Text>Adresse email :</Text>
                        <TextInput style={styles.input} onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" />
                    </View>

                    <View>
                        {error && ( <Text>{error}</Text> )}
                    </View>

                    <View>
                        <Text>Mot de passe :</Text>
                        <TextInput style={styles.input} onChangeText={(text) => handleChange('password', text)} secureTextEntry />    
                    </View>

                    <View>
                        <Text>Confirmation de mot de passe :</Text>
                        <TextInput style={styles.input} onChangeText={(text) => handleChange('confirmPassword', text)} secureTextEntry />    
                    </View>    

                    <Button color='#0d6efd' title={isLoading ? 'Inscription...' : "S'inscrire"} onPress={handleSubmit} disabled={isLoading} />
            </View>  
            ) : (
                <Text style={styles.message}>{message}</Text>
            )}
        </View>
      </ScrollView>  
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 16
    },
    card: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 20,
        elevation: 3
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 20
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        padding: 8
    },
    pickerStyle: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc'
    },
    button: {
        backgroundColor: '#C0C0C0',
        padding: 10
    },
    message: {
        backgroundColor: '#d1e7dd',
        color: 'green',
        borderRadius: 5,
        textAlign: 'center'
    }
})

export default Registration;