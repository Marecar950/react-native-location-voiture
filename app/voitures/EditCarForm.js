import { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, TextInput, FlatList, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns'; 
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import googleMapsApiKey from '../googleMapsApiKey';

function EditCarForm() {

    const ref = useRef();
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;
    const [message, setMessage] = useState('');
    const [dateDebutPicker, setDateDebutPicker] = useState(false);
    const [dateFinPicker, setDateFinPicker] = useState(false);
    const Google_Maps_Api_Key = googleMapsApiKey();
    const [submitted, setSubmitted] = useState(false);

    const [voitureDetails, setVoitureDetails] = useState ({
        immatriculation: '',
        marque: '',
        typeCarburant: '',
        kilometrage: 0,
        nombrePassagers: 0,
        transmission: '',
        prixLocation: 0,
        disponibilite: '',
        lieuDepart: '',
        dateDebut: new Date(),
        dateFin: new Date(),
        image: null,
        imagePreview: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://mouzammil-marecar.fr/voiture/${id}`);
                const voiture = response.data[0]["0"];
                const { departureLocation, departureDate, returnDate } = response.data[0];
                const dateDebut = new Date(departureDate.split('/').reverse().join('-'));
                const dateFin = new Date(returnDate.split('/').reverse().join('-')); 

                setVoitureDetails({
                    immatriculation: voiture.immatriculation,
                    marque: voiture.marque,
                    typeCarburant: voiture.typeCarburant,
                    kilometrage: voiture.kilometrage,
                    nombrePassagers: voiture.nombrePassagers,
                    transmission: voiture.transmission,
                    prixLocation: voiture.prixLocation,
                    disponibilite: voiture.disponibilite,
                    lieuDepart: departureLocation,
                    dateDebut: dateDebut,
                    dateFin: dateFin, 
                    image: voiture.image,
                });
                console.log(voitureDetails);

                if (ref.current) {
                    ref.current.setAddressText(departureLocation);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (name, value) => {
        setVoitureDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleImagePick = async () => {
        let result = {};
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const base64Image = await fetch(result.assets[0].uri)
                .then(res => res.blob())
                .then(blob => {
                    const reader = new FileReader();
                    return new Promise((resolve, reject) => {
                        reader.onerror = reject;
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                });
                setVoitureDetails(prevState => ({
                    ...prevState,
                    image: base64Image,
                    imagePreview: result.assets[0].uri  
                }));
        }
    };

    const handleSubmit = async () => {

        const formData = new FormData();

        for (let key in voitureDetails) {
            if (key === 'dateDebut' || key === 'dateFin') {
                formData.append(key, format(voitureDetails[key], 'yyyy-MM-dd'));
            } else {
                formData.append(key, voitureDetails[key]);
            }
        }

        try {
            const response = await axios.post(`https://mouzammil-marecar.fr/voiture/edit/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);

            setMessage(response.data.message);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
              {!submitted ? (
                <>
                <View style={styles.inputGroup}>
                    <Text>Immatriculation :</Text>
                    <TextInput style={styles.input} placeholder="Entrez l'immatriculation" value={voitureDetails.immatriculation} onChangeText={(text) => handleChange('immatriculation', text)} />
                </View>

                <View style={styles.inputGroup}>
                    <Text>Marque :</Text>
                    <TextInput style={styles.input} placeholder="Entrez la marque" value={voitureDetails.marque} onChangeText={(text) => handleChange('marque', text)}></TextInput>
                </View>

                <View style={styles.inputGroup}>
                    <Text>Type de carburant :</Text>
                    <View style={styles.pickerStyle}>
                        <Picker mode='dropdown' selectedValue={voitureDetails.typeCarburant} onValueChange={(itemValue) => handleChange('typeCarburant', itemValue)}>
                            <Picker.Item label="Sélectionnez le type de carburant" value="" />
                            <Picker.Item label="Essence" value="essence" />
                            <Picker.Item label="Diesel" value="diesel" />
                            <Picker.Item label="Electrique" value="électrique" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text>Kilométrage :</Text>
                    <TextInput style={styles.input} placeholder="Entrez le kilométrage" value={String(voitureDetails.kilometrage)} onChangeText={(text) => handleChange('kilometrage', text)} keyboardType="numeric" />
                </View>

                <View style={styles.inputGroup}>
                    <Text>Nombre de passagers :</Text>
                    <TextInput style={styles.input} placeholder="Entrez le nombre de passagers" keyboardType='numeric' value={String(voitureDetails.nombrePassagers)} onChangeText={(text) => handleChange('nombrePassagers', text)} />
                </View>

                <View style={styles.inputGroup}>
                    <Text>Transmission :</Text>
                    <View style={styles.pickerStyle}>
                        <Picker mode='dropdown' selectedValue={voitureDetails.transmission} onValueChange={(itemValue) => handleChange('transmission', itemValue)}>
                            <Picker.Item label="Choisissez une option" value="" />
                            <Picker.Item label="Manuelle" value="manuelle" />
                            <Picker.Item label="Automatique" value="automatique" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text>Prix de la location par jour :</Text>
                    <TextInput style={styles.input} value={String(voitureDetails.prixLocation)} onChangeText={(text) => handleChange('prixLocation', text)} keyboardType="numeric" />
                </View>

                <View style={styles.inputGroup}>
                    <Text>Disponibilité :</Text>
                    <View style={styles.pickerStyle}>
                        <Picker mode='dropdown' selectedValue={voitureDetails.disponibilite} onValueChange={(itemValue) => handleChange('disponibilite', itemValue)}>
                            <Picker.Item label="Disponible" value="disponible" />
                            <Picker.Item label="Non disponible" value="non disponible" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text>Lieu de départ :</Text>
                    <GooglePlacesAutocomplete
                        ref={ref}
                        onValueChange={voitureDetails.lieuDepart}
                        placeholder="Entrez le lieu de départ"
                        onPress={(data, details = null) => {
                            handleChange('lieuDepart', data.description);
                        }}
                        query={{
                            key: Google_Maps_Api_Key
                        }}
                        styles={{
                            textInput: styles.input
                        }}
                        disableScroll={true}
                    />    
                </View> 

                <Text>Date de début de location :</Text>
                <View style={styles.inputGroup}>
                    <TouchableOpacity onPress={() => setDateDebutPicker(true)}>
                        <Text style={styles.input}>{voitureDetails.dateDebut.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {dateDebutPicker && (
                        <DateTimePicker
                            value={voitureDetails.dateDebut}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || voitureDetails.dateDebut;
                                setDateDebutPicker(false);
                                handleChange('dateDebut', currentDate);
                            }}
                        />    
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text>Date de fin de location :</Text>
                    <TouchableOpacity onPress={() => setDateFinPicker(true)}>
                        <Text style={styles.input}>{voitureDetails.dateFin.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                        {dateFinPicker && (
                            <DateTimePicker
                                value={voitureDetails.dateFin}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    const currentDate = selectedDate || voitureDetails.dateFin;
                                    setDateFinPicker(false);
                                    handleChange('dateFin', currentDate);
                                }}
                            />    
                        )}
                </View>        

                <View style={styles.inputGroup}>
                    <TouchableOpacity onPress={handleImagePick}>
                        <Text>Choisir une image</Text> 
                    </TouchableOpacity>
                    {voitureDetails.imagePreview && (
                        <Image source ={{ uri: voitureDetails.imagePreview }} style={styles.image} />
                    )}

                    {voitureDetails.image && (
                        <Image source={{ uri: `https://mouzammil-marecar.fr/uploads/${voitureDetails.image}` }} style={styles.image} />
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <Button color='#6c757d' title="Retour" onPress={() => navigation.goBack()} />    
                    <Button color='#0d6efd' title="Modifier" onPress={handleSubmit} />
                </View>    
                
                </>
                ) : (
                    <>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.successMessage}>{message}</Text>
                        </View>
                        <Button style={styles.inputGroup} title="Retour" onPress={navigation.goBack}></Button>
                    </>    
              )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    card: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 3
    },
    inputGroup: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10
    },
    pickerStyle: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
    },
    dateText: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1
    },
    button: {
        backgroundColor: '#C0C0C0',
        padding: 10
    },
    image: {
        marginTop: 10,
        width: '100%',
        height: 200,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    successMessage: {
        backgroundColor: '#d1e7dd',
        color: '#0a3622',
        borderRadius: 5,
        textAlign: 'center',
    }
})

export default EditCarForm;