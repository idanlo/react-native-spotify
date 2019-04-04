import React from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
    createSwitchNavigator,
    createAppContainer,
    createBottomTabNavigator,
    BottomTabBar
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal, { ModalContext } from './components/Modal';
import LoginScreen from './containers/LoginScreen';
import HomeScreen from './containers/HomeScreen';
import SearchScreen from './containers/Search/SearchScreen';
import LibraryScreen from './containers/LibraryScreen';
import PlayerView from './containers/Player/PlayerScreen';
import Player from './containers/Player/Player';
import AlbumView from './containers/Album/AlbumScreen';
import PlaylistView from './containers/Playlist/PlaylistScreen';
import ArtistView from './containers/Artist/ArtistScreen';

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
        backBehavior: 'history',
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
    state = {
        isOpen: false,
        actions: null
    };

    componentDidMount() {
        SplashScreen.hide();
    }

    openModal = (options, actions) => {
        this.setState({
            isOpen: true,
            actions,
            options: { ...options }
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
                    options={this.state.options}
                    actions={this.state.actions}
                />
                <Container />
            </ModalContext.Provider>
        );
    }
}

export default App;
