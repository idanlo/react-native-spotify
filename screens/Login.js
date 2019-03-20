import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import Spotify from 'rn-spotify-sdk';

export default class LoginScreen extends Component {
    state = {
        loaded: false
    };
    componentDidMount() {
        console.log(this.props);
        this.initializeIfNeeded().catch(err => {
            console.warn('Error', err.message);
        });
    }

    initializeIfNeeded = async () => {
        if (!(await Spotify.isInitializedAsync())) {
            // init
            const options = {
                clientID: '4266b38056c54d47a5480dc099f59cb6',
                sessionUserDefaultsKey: 'SpotifySession',
                redirectURL: 'reactnativespotify://auth',
                scopes: [
                    'streaming',
                    'app-remote-control',
                    'user-read-playback-state',
                    'user-modify-playback-state',
                    'user-read-currently-playing',
                    'user-read-recently-played',
                    'user-top-read',
                    'user-library-read',
                    'user-read-private',
                    'playlist-read-private',
                    'playlist-read'
                ]
            };

            const loggedIn = await Spotify.initialize(options);

            if (loggedIn) {
                this.props.navigation.navigate('Home');
            } else {
                this.setState({ loaded: true });
            }
        } else {
            if (await Spotify.isLoggedInAsync()) {
                this.props.navigation.navigate('Home');
            } else {
                this.setState({ loaded: true });
            }
        }
    };

    login = () => {
        Spotify.login().then(loggedIn => {
            if (loggedIn) {
                this.props.navigation.navigate('Home');
            } else {
                console.log('FAILURE');
            }
        });
    };

    render() {
        return this.state.loaded ? (
            <View style={styles.container}>
                <Text style={styles.loginHeader}>Spotify</Text>
                <TouchableNativeFeedback onPress={this.login}>
                    <View style={styles.login}>
                        <Text style={styles.loginText}>Login</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        ) : null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191414'
    },
    loginHeader: {
        fontSize: 34,
        color: '#fff',
        marginBottom: 25,
        fontWeight: 'bold'
    },
    login: {
        backgroundColor: '#1DB954',
        width: 120,
        height: 60,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginText: {
        color: '#fff'
    }
});
