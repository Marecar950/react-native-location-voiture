import { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Button, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import googleMapsApiKey from '../googleMapsApiKey';
import { format } from 'date-fns';
import axios from 'axios';

function SearchVehiculesForm() {
    const navigation = useNavigation();
    const apiKey = googleMapsApiKey();
    const [formData, setFormData] = useState({
        lieuDepart: '',
        dateDepart: new Date(),
        dateRetour: new Date()
    });

    const [showDatePicker, setShowDatePicker] = useState({
        dateDepart: false,
        dateRetour: false
    });

    const handleChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleSubmit = async () => {
            
        const formDataToSend = new FormData();

        for (let key in formData) {
            if (key === 'dateDepart' || key === 'dateRetour') {
                formDataToSend.append(key, format(formData[key], 'yyyy-MM-dd'));
            } else {
                formDataToSend.append(key, formData[key]);
            }    
        }
        try {
            const response = await axios.post('https://mouzammil-marecar.fr/search', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);

            const serializedFormData = {
                ...formData,
                dateDepart: formData.dateDepart.toISOString(),
                dateRetour: formData.dateRetour.toISOString()
            };

            navigation.navigate('search_vehicules/searchResults', { results: response.data, formData: serializedFormData });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ImageBackground source={require('../image/image_location-voiture.jpg')} style={styles.backgroundImage}>
            <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={styles.container}>
            <View style={styles.form}>
                <View style={styles.card}>
                    <Text style={styles.title}>Rechercher un véhicule</Text>
                    <View style={styles.cardBody}>
                        <View style={styles.mb3}>
                            <Text>Lieu de départ</Text>
                                <GooglePlacesAutocomplete placeholder="Saisissez une ville" onPress={(data, details = null) => 
                                {
                                    handleChange('lieuDepart', data.description);
                                }}
                                    query={{
                                        key: apiKey
                                    }}
                                    disableScroll={true} 
                                    styles={{
                                        textInput: styles.textInput,
                                    }}
                                />
                        </View>

                            <View style={styles.row}>
                                <View style={styles.colMd6}>
                                    <Text>Date de départ</Text>
                                    <TouchableOpacity onPress={() => setShowDatePicker({ ...showDatePicker, dateDepart: true })}>
                                        <Text style={styles.textInput}>
                                            {formData.dateDepart.toLocaleDateString()}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDatePicker.dateDepart && (
                                        <DateTimePicker value={formData.dateDepart} 
                                                        mode="date" 
                                                        display="default" 
                                                        onChange={(event, selectedDate) => {
                                                            const currentDate = selectedDate || formData.dateDepart;
                                                            setShowDatePicker(false);
                                                            handleChange('dateDepart', currentDate);
                                                        }} 
                                        />
                                    )}
                                </View>
                                <View style={styles.colMd6}>
                                    <Text>Date de retour</Text>
                                    <TouchableOpacity onPress={() => setShowDatePicker({ ...showDatePicker, dateRetour: true })}>
                                        <Text style={styles.textInput}>
                                            {formData.dateRetour.toLocaleDateString()}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDatePicker.dateRetour && (
                                        <DateTimePicker 
                                            value={formData.dateRetour} 
                                            mode="date" 
                                            display="default" 
                                            onChange={(event, selectedDate) => {
                                                const currentDate = selectedDate || formData.dateRetour;
                                                setShowDatePicker(false);
                                                handleChange('dateRetour', currentDate);
                                            }} 
                                        />
                                    )}
                                </View>
                            </View>
                        <View style={styles.buttonContainer}>
                            <Button color="#0d6efd" title="Rechercher" onPress={handleSubmit} />
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '90%',
        justifyContent: 'center',
    },
    container: {
        padding: 10,
        justifyContent: 'flex-start'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowOffset: { width: 0, height: 5 },
        elevation: 1,
        marginTop: 20
    },
    title:{
        fontSize: 20,
        marginBottom: 20
    },
    textInput: {
        height: 40,
        borderColor: '#ccc',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    colMd6: {
        width: '48%'
    },    
    buttonContainer: {
    }
})

export default SearchVehiculesForm;
