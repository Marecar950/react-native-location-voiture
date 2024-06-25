import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { format } from 'date-fns';
import axios from 'axios';

function Profile() {

    const route = useRoute();
    const { user_id } = route.params;
    const [message, setMessage] = useState('');
    const [showDate, setShowDate] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { userData } = useAuth();

    const [formData, setFormData] = useState({
        civility: '',
        lastname: '',
        firstname: '',
        dateOfBirth: new Date(),
        email: ''
    });

    useEffect(() => {
        setFormData({
            civility: userData.civility,
            lastname: userData.lastname,
            firstname: userData.firstname,
            dateOfBirth: new Date(),
            email: userData.email
        })
    }, []);

    const handleChange= (name, value) => {
        setFormData(prevState => ({
            ...prevState, 
            [name]: value
        }));
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            const formattedDate = format(formData.dateOfBirth, 'yyyy-MM-dd');

            const response = await axios.put(`https://mouzammil-marecar.fr/user/edit_profil/${user_id}`, {
                ...formData
            });
            console.log(response.data);

            if (response.data.message) {
                setMessage(response.data.message);
                setSubmitted(true);
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Informations personnelles</Text>

            {!submitted ? (
                <>
                    <View style={styles.userInfo}>
                        <Text>Civilité</Text>
                        <View style={styles.pickerStyle}>
                            <Picker selectedValue={formData.civility} onValueChange={(itemValue => handleChange('civility', itemValue))}>
                                <Picker.Item label="Monsieur" value="Monsieur" />
                                <Picker.Item label="Madame" value="Madame" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.userInfo}>
                        <Text>Nom</Text>
                        <TextInput style={styles.input} onChangeText={(text) => handleChange('lastname', text)}>{formData.lastname}</TextInput>
                    </View>

                    <View style={styles.userInfo}>
                        <Text>Prénom</Text>
                        <TextInput style={styles.input} onChangeText={(text) => handleChange('firstname', text)}>{formData.firstname}</TextInput>
                    </View>

                    <View style={styles.userInfo}>
                        <Text>Date de naissance</Text>
                        <TouchableOpacity onPress={() => setShowDate(true)}>
                            <Text style={styles.input}>
                                {userData.dateOfBirth}
                            </Text>
                        </TouchableOpacity>
                        {showDate && (
                            <DateTimePicker
                            value={formData.dateOfBirth}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || formData.dateOfBirth;
                                setShowDate(false);
                                handleChange('dateOfBirth', currentDate);
                            }} 
                            />
                        )}
                    </View>

                    <View style={styles.userInfo}>
                        <Text>Adresse e-mail</Text>
                        <TextInput style={styles.input} handleChange={(text) => handleChange('email', text)}>{formData.email}</TextInput>
                    </View>

                    {isLoading && <ActivityIndicator />}    
                    <Button title="Modifier" color="#0d6efd" onPress={handleSubmit} />
                </>
            ):(
                <Text style={styles.message}>{message}</Text>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 17,
        marginBottom: 30
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        height: 40,
        padding: 8
    },
    pickerStyle: {
        borderRadius: 5,
        backgroundColor: '#fff',
        elevation: 1
    },
    userInfo: {
        marginBottom: 10
    },
    message: {
        backgroundColor: '#d1e7dd',
        borderRadius: 5,
        textAlign: 'center',
        color: 'green',    
    }

});

export default Profile;