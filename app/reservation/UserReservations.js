import { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

function UserReservations() {

    const [reservations, setReservations] = useState([]);
    const  [success, setSuccess] = useState('');
    const route = useRoute();
    const { user_id } = route.params;

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`https://mouzammil-marecar.fr/reservations?user_id=${user_id}`);
                console.log(response.data);
                console.log(user_id);
                setReservations(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des réservations', error);
            }
        };

        fetchReservations();
    }, []);

    const handleCancelReservation = async (reservationId) => {
        try {
            const response = await axios.put(`https://mouzammil-marecar.fr/reservation/cancel/${reservationId}`);
            setSuccess(response.data.success);
        } catch (error) {
            console.error(error);
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.text}>Référence : {item.reference}</Text>
            <Text style={styles.text}>Lieu de départ : { item.lieuDepart}</Text>
            <Text style={styles.text}>Date de départ : { item.dateDepart}</Text>
            <Text style={styles.text}>Date de retour : {item.dateRetour}</Text>
            <Text style={styles.statut}>Statut : {item.statut}</Text>
            <View style={styles.button}>
                <Button title="Annuler" color='red'  onPress={() => handleCancelReservation(item.id)} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes réservations</Text>
            {success && <Text style={styles.message}>{success}</Text>
            }
            <FlatList data={reservations} renderItem={renderItem} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        marginBottom: 20
    },
    item:{
        padding: 15,
        borderBottomWidth: 1,
    },
    statut: {
        color: 'green'
    },
    button: {
        backgroundColor: 'red',
        marginTop: 20
    },
    message: {
        backgroundColor: '#d1e7dd',
        color: 'green',
        textAlign: 'center',
        padding: 8
    }
})

export default UserReservations;