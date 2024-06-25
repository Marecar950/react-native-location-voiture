import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';

function ClientList() {
    const [tableHead, setTableHead] = useState([
        { name: 'Civilité', width: 105 },
        { name: 'Nom', width: 130 },
        { name: 'Prénom', width: 130 },
        { name: 'Date de naissance', width: 140 },
        { name: 'Email', width: 300 },
    ]);
    const [data, setData] = useState([]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() +1;
        const year = date.getFullYear();

        const formattedMonth = month < 10 ? `0${month}` : `month`;
        return `${day}/${formattedMonth}/${year}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://mouzammil-marecar.fr/admin/list_clients');
                const clientsData = response.data.map(client => [
                    client.civility,
                    client.lastname,
                    client.firstname,
                    formatDate(client.dateOfBirth),
                    client.email,
                ]);
                setData(clientsData);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData(); 
    }, []);

    return (
            <ScrollView horizontal>
                <View style={styles.container}>
                    <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Row data={tableHead.map(item => item.name)} widthArr={tableHead.map(item => item.width)} style={styles.head} textStyle={styles.text} />
                        <Rows data={data} widthArr={tableHead.map(item => item.width)} textStyle={styles.text} /> 
                    </Table>
                </View>
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#fff'
    },
    head: {
        height: 40,
        backgroundColor: '#f1f8ff'
    },
    text: {
        margin: 6,
    }
})

export default ClientList;