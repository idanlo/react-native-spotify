import React from 'react';
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import SearchScreen from './screens/Search';
import LibraryScreen from './screens/Library';
import {
    createSwitchNavigator,
    createAppContainer,
    createBottomTabNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeNavigator = createBottomTabNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="md-home" size={30} color={tintColor} />
                )
            }
        },
        Search: {
            screen: SearchScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-search" size={30} color={tintColor} />
                )
            }
        },
        Library: {
            screen: LibraryScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-apps" size={30} color={tintColor} />
                )
            }
        }
    },
    {
        initialRouteName: 'Home',
        tabBarOptions: {
            activeTintColor: '#1DB954',
            showIcon: true,
            style: { backgroundColor: '#212025' }
        }
    }
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
