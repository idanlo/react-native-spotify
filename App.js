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
import AlbumView from './screens/AlbumView';
import PlaylistView from './screens/PlaylistView';
import ArtistView from './screens/ArtistView';
import Modal from './components/Modal';

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
                tabBarButtonComponent: () => null,
                tabBarVisible: false
            }
        },
        AlbumView: {
            screen: AlbumView,
            navigationOptions: {
                tabBarButtonComponent: () => null
            }
        },

        PlaylistView: {
            screen: PlaylistView,
            navigationOptions: {
                tabBarButtonComponent: () => null
            }
        },
        ArtistView: {
            screen: ArtistView,
            navigationOptions: {
                tabBarButtonComponent: () => null
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

export const ModalContext = React.createContext({
    isOpen: false,
    openModal: null,
    closeModal: null,
    image: '',
    primaryText: '',
    secondaryText: '',
    actions: []
});

class App extends React.Component {
    state = {
        isOpen: false,
        actions: null
    };

    componentDidMount() {
        SplashScreen.hide();
    }

    openModal = (image, primaryText, secondaryText, actions) => {
        this.setState({
            isOpen: true,
            image,
            primaryText,
            secondaryText,
            actions
        });
    };

    closeModal = () => {
        this.setState({ isOpen: false });
    };
    contextData = {
        isOpen: this.state.isOpen,
        openModal: this.openModal,
        closeModal: this.closeModal
    };

    render() {
        return (
            <ModalContext.Provider value={this.contextData}>
                <Modal
                    showModal={this.state.isOpen}
                    onClose={this.closeModal}
                    image={this.state.image}
                    primaryText={this.state.primaryText}
                    secondaryText={this.state.secondaryText}
                    actions={this.state.actions}
                />
                <Container />
            </ModalContext.Provider>
        );
    }
}

export default App;
