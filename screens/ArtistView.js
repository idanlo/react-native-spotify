import React from 'react';
import { View, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { Text } from '../UI';
import Spotify from 'rn-spotify-sdk/src/Spotify';
import globalStyles from '../styles';

class ArtistView extends React.Component {
    state = {
        data: null,
        loading: true
    };
    routeSubscription = null;

    componentDidMount() {
        this.routeSubscription = this.props.navigation.addListener(
            'willFocus',
            this.fetchData
        );
        this.fetchData();
    }

    fetchData = ctx => {
        this.setState({ loading: true });
        let artistId;
        if (ctx) {
            artistId = ctx.state.params.artistId;
        } else {
            artistId = this.props.navigation.getParam('artistId');
        }
        Spotify.getArtist(artistId)
            .then(res => {
                this.setState({ data: res });
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    };
    componentWillUnmount() {
        this.routeSubscription.remove();
    }
    render() {
        return (
            <View style={globalStyles.container}>
                <StatusBar backgroundColor="#191414" />
                {!this.state.loading ? (
                    <ScrollView>
                        <Text>Artist</Text>
                    </ScrollView>
                ) : (
                    <View
                        style={[
                            globalStyles.container,
                            {
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        ]}
                    >
                        <ActivityIndicator size="large" color="#1DB954" />
                    </View>
                )}
            </View>
        );
    }
}

export default ArtistView;
