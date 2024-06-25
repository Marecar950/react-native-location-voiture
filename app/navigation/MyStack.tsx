import { createStackNavigator } from '@react-navigation/stack';
import ConfirmRegistration from '../registration/ConfirmRegistration';
import Login from '../login/Login';
import VerifyMail from '../reset_password/Verify_mail';
import ResetPassword from '../reset_password/ResetPassword';
import Dashboard from '../voitures/Dashboard';
import AddCarForm from '../voitures/AddCarForm';
import EditCarForm from '../voitures/EditCarForm';
import SearchResults from '../search_vehicules/searchResults';
import Reservation from '../reservation/Reservation';
import UserReservations from '../reservation/UserReservations';
import Account from '../account/Account.js';
import Profile from '../account/Profil';
import ClientList from '../admin/ClientList';
import DrawerNav from '../DrawerNav';

const Stack = createStackNavigator();

export default function MyStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name="DrawerNav" component={DrawerNav} />
            <Stack.Screen options={{ title: 'Connexion' }} name='login/Login' component={Login} />
            <Stack.Screen options={{ title: 'Vérification de l\'adresse mail' }} name="reset_password/Verify_mail" component={VerifyMail} />
            <Stack.Screen options={{ title: 'Réinitialisation de votre mot de passe' }} name='reset_password/ResetPassword' component={ResetPassword} />
            <Stack.Screen options={{ title: 'Confirmation de votre inscription'}} name="registration/ConfirmRegistration" component={ConfirmRegistration} />            
            <Stack.Screen options={{ title: 'Tableau de bord' }} name="voitures/Dashboard" component={Dashboard} />
            <Stack.Screen options={{ title: 'Ajouter une voiture'}} name="voitures/AddCarForm" component={AddCarForm} />
            <Stack.Screen options={{ title: 'Modifier une voiture'}} name="voitures/EditCarForm" component={EditCarForm} />
            <Stack.Screen options={{ title: 'Résultats'}} name="search_vehicules/searchResults" component={SearchResults} />
            <Stack.Screen options={{ title: 'Réservation' }} name="reservation/Reservation" component={Reservation} />
            <Stack.Screen options={{ title: 'Informations personnelles'}} name="account/Account" component={Account} />
            <Stack.Screen options={{ title: 'Modifier mon profil'}} name="account/Profil" component={Profile} />
            <Stack.Screen options={{ title: 'Liste des clients' }} name="admin/ClientList" component={ClientList} />
            <Stack.Screen options={{ title: 'Mes réservations'}} name="reservation/UserReservations" component={UserReservations} />
        </Stack.Navigator>  
    );
}