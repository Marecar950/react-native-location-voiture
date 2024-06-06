import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../screens/Dashboard';
import AddCarForm from '../screens/AddCarForm';
import EditCarForm from '../screens/EditCarForm';

const Stack = createStackNavigator();

export default function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="screens/Dashboard" component={Dashboard} />
            <Stack.Screen name="screens/AddCarForm" component={AddCarForm} />
            <Stack.Screen name="screens/EditCarForm" component={EditCarForm} />
        </Stack.Navigator>  
    );
}