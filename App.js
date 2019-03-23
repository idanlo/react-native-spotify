import React from 'react';
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import SearchScreen from './screens/Search';
import LibraryScreen from './screens/Library';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
    createSwitchNavigator,
    createAppContainer,
    createBottomTabNavigator,
    BottomTabBar
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Player from './components/Player';
import PlayerView from './screens/PlayerView';
import AlbumView from './components/AlbumView';

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
        },
        PlayerView: {
            screen: PlayerView,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-apps" size={30} color={tintColor} />
                )
            }
        },
        AlbumView: {
            screen: AlbumView,
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
        },
        tabBarComponent: props => (
            <View>
                <Player navigation={props.navigation} />
                <BottomTabBar {...props} />
            </View>
        )
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

const Container = createAppContainer(AppNavigator);

class App extends React.Component {
    componentDidMount() {
        SplashScreen.hide();
    }

    render() {
        return <Container />;
    }
}

export default App;
