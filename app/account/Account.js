import { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

function Account() {

    const route = useRoute();
    const navigation = useNavigation();
    const { user_id } = route.params;
    const [data, setData] = useState({

    });

    const formatDate = (isoDate) => {
        const dateObj = new Date(isoDate);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() +1;
        const year = dateObj.getFullYear();

        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        
        return `${day}/${formattedMonth}/${year}`;
    }

        const fetchData = useCallback(async () => {
            try {
                const response = await axios.get(`https://mouzammil-marecar.fr/user/${user_id}`);
                setData(response.data);
            } catch (error) {
                console.error(error);   
           }
        }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])        
       );

    return (
        <View style={styles.container}>

            <View style={styles.userInfo}>
                <Text>Civilité</Text>
                <Text style={styles.text}>{data.civility}</Text>
            </View>
            <View style={styles.userInfo}>
                <Text>Nom</Text>
                <Text style={styles.text}>{data.lastname}</Text>
            </View>
            <View style={styles.userInfo}>
                <Text>Prénom</Text>
                <Text style={styles.text}>{data.firstname}</Text>
            </View>
            <View style={styles.userInfo}>
                <Text>Date de naissance</Text>
                <Text>{data.dateOfBirth ? formatDate(data.dateOfBirth) : '-'}</Text>
            </View>
            <View style={styles.userInfo}>
                <Text>Adresse e-mail</Text>
                <Text style={styles.text}>{data.email}</Text>
            </View>
            <Button title="Modifier mon profil" color="#0d6efd" onPress={() => navigation.navigate('account/Profil', { user_id: data.id})} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    userInfo: {
        marginBottom: 10
    }
})

export default Account;