import { useState } from 'react';
import { View, Text, TextInput, Button, Picker } from 'react-native';
//import { TextInput, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

function Registration() {

    const [ formData, setFormData] = useState({
        civility: '',
        lastname: '',
        firstname: '',
        dateOfBirth: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [formFieldsError, setFormFieldsError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
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
            formDataToSend.append(key, formData[key]);
        }

        try {
            setIsLoading(true);

            const response = await axios.post('https://mouzammil-marecar.fr/user/register', formDataToSend);
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
        <View style={{ justifyContent: 'center'}}>
            <Text style={{ textAlign: 'center'}}>Bienvenue dans la page d'inscription</Text>
            {!submitted ? (
                <View>
                    {formFieldsError && (
                        <Text>Veuillez renseigner tous les champs.</Text>
                    )}
                    <RNPickerSelect 
                        onValueChange={(value) => handleChange('civility', value)}
                        items={[
                            { label: 'Choisissez une option', value: ''},
                            { label: 'Monsieur', value: 'Monsieur' },
                            { label: 'Madame', value: 'Madame' },     
                        ]}
                        value={formData.civility} 
                    />
                    <View>
                        <Text>Nom :</Text>
                        <TextInput onChangeText={(text) => handleChange('lastname', text)} />
                    </View>
                    <View>
                        <Text>Prénom :</Text>
                        <TextInput onChangeText={(text) => handleChange('firstname', text)} />
                    </View>
                    <View>
                        <Text>date de naissance :</Text>
                        <TextInput onChangeText={(text) => handleChange('dateOfBirth', text)} />
                    </View>
                    <View>
                        <Text>Adresse email :</Text>
                        <TextInput 
                            onChangeText={(text) => handleChange('email', text)}
                            keyboardType="email-address"
                        />
                    </View>
                    <View>
                        {error && ( <Text>{error}</Text> )}
                    </View>
                    <View>
                        <Text>Mot de passe :</Text>
                        <TextInput 
                            onChangeText={(text) => handleChange('password', text)}
                            secureTextEntry
                        />    
                    </View>
                    <View>
                        <Text>Confirmation de mot de passe :</Text>
                        <TextInput 
                            onChangeText={(text) => handleChange('confirmPassword', text)}
                            secureTextEntry
                        />    
                    </View>    

                    <Button title={isLoading ? 'Inscription...' : "S'inscrire"} onPress={handleSubmit} disabled={isLoading} />
                </View>    
            ) : (
                <Text style={{ textAlign: 'center', color: 'green'}}>{message}</Text>
            )}
        </View>
    );
}

export default Registration;