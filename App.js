import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import SearchScreen from './screens/Search';
import LibraryScreen from './screens/Library';
import {
    createSwitchNavigator,
    createAppContainer,
    createBottomTabNavigator
} from 'react-navigation';

const HomeNavigator = createBottomTabNavigator(
    {
        Home: {
            screen: HomeScreen
        },
        Search: {
            screen: SearchScreen
        },
        Library: {
            screen: LibraryScreen
        }
    },
    { initialRouteName: 'Home' }
);

const AppNavigator = createSwitchNavigator(
    {
        Login: {
            screen: LoginScreen
        },
        Home: HomeNavigator
    },
    { initialRouteName: 'Login' }
);

export default createAppContainer(AppNavigator);
