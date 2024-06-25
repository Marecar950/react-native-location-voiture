import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import SearchVehiculesForm from './search_vehicules/SearchVehiculesForm';
import Registration from './registration/Registration';
import Login from './login/Login';
import Dashboard from './voitures/Dashboard';
import { useAuth } from './AuthContext';

const CustomDrawerContent = (props) => {
    const { isLoggedUser, isLoggedAdmin, userData, adminData, logout} = useAuth();

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            {isLoggedUser && userData.roles.includes('ROLE_USER') && (
            <>
                <DrawerItem label="Mon compte" onPress={() => {
                    props.navigation.navigate('account/Account', { user_id: userData.id });
                }}
                />
                <DrawerItem label="Mes réservations" onPress={() => {
                    props.navigation.navigate('reservation/UserReservations', { user_id: userData.id});
                }}
                />
                <DrawerItem label="Déconnexion" onPress={() => {
                    logout();
                    props.navigation.navigate('login/Login');
                }}
                />
            </>    
            )}
            {isLoggedAdmin && adminData.roles.includes('ROLE_ADMIN') && (
                <>
                    <DrawerItem label="Tableau de bord" onPress={() => {
                        props.navigation.navigate('voitures/Dashboard');
                    }}
                    />
                    <DrawerItem label="Liste des clients" onPress={() => {
                        props.navigation.navigate('admin/ClientList');
                    }}
                    />
                    <DrawerItem label="Déconnexion" onPress={() => {
                        logout();
                        props.navigation.navigate('login/Login');
                    }}
                    />
                </>
            )}
        </DrawerContentScrollView>
    )
}

export default function DrawerNav() {
    const Drawer = createDrawerNavigator();
    const { userData, adminData, isLoggedUser, isLoggedAdmin } = useAuth();

    return (
        <Drawer.Navigator 
            drawerContent={(props) => <CustomDrawerContent {...props} />} 
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#0d6efd'
                },
                headerTintColor: '#fff'
            }}
        >
            {(!isLoggedUser && !isLoggedAdmin) ? (
                <>
                    <Drawer.Screen name='Accueil' component={SearchVehiculesForm} />
                    <Drawer.Screen name='Inscription' component={Registration} />
                    <Drawer.Screen name='Connexion' component={Login} />
                </>
            ): (
                <Drawer.Screen name='Accueil' component={SearchVehiculesForm} />
            )}
          
        </Drawer.Navigator>
    )
}