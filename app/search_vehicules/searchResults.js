import { useState, useEffect, useRef} from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import googleMapsApiKey from '../googleMapsApiKey';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { format } from 'date-fns';

function SearchResults() {
    const { isLoggedUser } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();
    const inputRef = useRef();
    const apiKey = googleMapsApiKey();

    const {results, formData } = route.params || { results: [], formData: { lieuDepart: '', dateDepart: new Date(), dateRetour: new Date()}};
    const initialFormData = {
        lieuDepart: formData.lieuDepart,
        dateDepart: formData.dateDepart,
        dateRetour: formData.dateRetour
    };

    const [formState, setFormState] = useState(initialFormData);
    const [manuelle, setManuelle] = useState(false);
    const [automatique, setAutomatique] = useState(false);
    const [filteredResults, setFilteredResults] = useState(results);
    const [showDatePicker, setShowDatePicker] = useState({ 
        dateDepart: false,
        dateRetour: false
     });

    const handleChange = (name, value) => {
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const filterOptions = () => {
        let filtered = results;
        if (manuelle) {
            filtered = filtered.filter(result => result[0].transmission === 'manuelle');
        }
        if (automatique) {
            filtered = filtered.filter(result => result[0].transmission === 'automatique');
        }
        setFilteredResults(filtered); 
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setAddressText(formState.lieuDepart);
        }

    }, []);

    useEffect(() => {

        filterOptions();   
    }, [manuelle, automatique, results]);

    const handleSubmit =  async () => {
        console.log(formState.lieuDepart);

        try {

            const formDataToSend = new FormData();

            for (let key in formState) {
                if (key === 'dateDepart' || key === 'dateRetour') {
                    formDataToSend.append(key, format(formState[key], 'yyyy-MM-dd'));
                } else {
                    formDataToSend.append(key, formState[key]);
                }
            }
            const response = await axios.post('https://mouzammil-marecar.fr/search', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }    
            });
            setFilteredResults(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleReservation = (result) => {
        if (isLoggedUser) {
            navigation.navigate('reservation/Reservation', { result, formData: formState });
        } else {
            navigation.navigate('Login');
        }
    }

    return (
        <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={styles.container}>
            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text>Lieu de départ</Text>
                    <GooglePlacesAutocomplete
                        ref={inputRef}
                        onValueChange={formState.lieuDepart}
                        placeholder="Saississez une ville"
                        onPress={(data, details = null) => {
                            handleChange('lieuDepart', data.description);

                        }}
                        query={{
                            key: apiKey
                        }}
                        disableScroll={true}
                        styles={{
                            textInput: styles.textInput
                        }}
                        
                    />    
                </View>
                <View style={styles.inputGroup}>
                    <Text>Date de départ</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker({ dateDepart: true })}>
                        <Text style={styles.textInput}>
                            {new Date(formState.dateDepart).toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker.dateDepart && (
                        <DateTimePicker
                            value={new Date(formState.dateDepart)}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || formState.dateDepart;
                                setShowDatePicker(false);
                                handleChange('dateDepart', currentDate);
                            }}
                        />    
                    )}
                </View>
                <Text>Date de retour</Text>
                <TouchableOpacity onPress={() => setShowDatePicker({ dateRetour: true})}>
                    <Text style={styles.textInput}>
                        {new Date(formState.dateRetour).toLocaleDateString()}
                    </Text>
                </TouchableOpacity>
                {showDatePicker.dateRetour && (
                    <DateTimePicker
                        value={new Date(formState.dateRetour)}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            const currentDate = selectedDate || formState.dateRetour;
                            setShowDatePicker(false);
                            handleChange('dateRetour', currentDate);
                        }}
                    />
                )}

                <Button title="Modifier" color="#0d6efd" onPress={handleSubmit} />
            </View>

            <View style={styles.options}>
                <Text style={styles.optionsTitle}>Options</Text>
                <View style={styles.checkboxContainer}>
                    <Checkbox value={manuelle} onValueChange={setManuelle} />
                    <Text style={styles.checkboxLabel}>Manuelle</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <Checkbox value={automatique} onValueChange={setAutomatique} />
                    <Text style={styles.checkboxLabel}>Automatique</Text>
                </View>
            </View>
            <View>
                {filteredResults.map((result, index) => (
                    <View key={index} style={styles.card}>
                        <Image source={{ uri: `https://mouzammil-marecar.fr/uploads/${result[0].image}`}} style={styles.carImage} />

                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>{result[0].marque}</Text>
                            <View style={styles.detailsContainer}>
                                <FontAwesome6 name="gas-pump" size={25} />
                                <Text style={styles.details}>{result[0].typeCarburant}</Text>
                                <Icon name="speedometer" size={25} />
                                <Text style={styles.details}>{result[0].kilometrage} km</Text>
                            </View>
                            <View style={styles.detailsContainer}>        
                                <FontAwesome5 name="user-friends" size={25} />
                                <Text style={styles.details}>{result[0].nombrePassagers}</Text>
                                <MaterialCommunityIcons name="car-shift-pattern" size={25} />
                                <Text style={styles.details}>{result[0].transmission}</Text>
                            </View>    
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>Total pour {result.nb_days} jours : { result.prix_location} €</Text>
                            </View>                
                        </View>
                        <View style={styles.reserveButtonContainer}>
                            <Button title="Réserver" color="#0d6efd" style={styles.reserveButton} onPress={() => handleReservation(result)} />
                        </View>                   
                    </View>
                ))}

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderradius: 8,
        elevation: 2
    },
    textInput: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 10
    },
    carImage: {
        width: '100%',
        height: 200,
    },
    options: {
        marginBottom: 20
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    checkboxLabel: {
        marginLeft: 10
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 20
    },
    detailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10
    },
    details: {
        marginRight: 20,
        marginLeft: 10
    },
    priceContainer: {
        marginTop: 10
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'right'
    },
    reserveButtonContainer: {
        marginTop: 10,
        alignItems: 'flex-end'
    }
})

export default SearchResults;
