import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import Spotify from 'rn-spotify-sdk';

export default class App extends Component {
    componentDidMount() {
        this.initializeIfNeeded().catch(err => {
            console.warn('Error');
        });
    }

    async initializeIfNeeded() {
        if (!(await Spotify.isInitializedAsync())) {
            // init
            const options = {
                clientID: '4266b38056c54d47a5480dc099f59cb6',
                sessionUserDefaultsKey: 'SpotifySession',
                redirectURL: 'spotify://auth',
                scopes: [
                    'user-read-private',
                    'playlist-read',
                    'playlist-read-private',
                    'streaming'
                ]
            };

            const loggedIn = await Spotify.initialize(options);

            if (loggedIn) {
                console.warn('Success');
            }
        } else {
            if (await Spotify.isLoggedInAsync()) {
                console.warn('Success');
            }
        }
    }

    login() {
        Spotify.login().then(loggedIn => {
            if (loggedIn) {
                console.warn('SUCCESS');
            } else {
                console.error('FAILURE');
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.loginHeader}>Spotify</Text>
                <TouchableNativeFeedback
                    style={styles.login}
                    onPress={this.login}
                >
                    <Text style={styles.loginText}>Login</Text>
                </TouchableNativeFeedback>
            </View>
        );
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
