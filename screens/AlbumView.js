import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    ScrollView,
    StatusBar
} from 'react-native';
import { Text } from '../UI';
import Spotify from 'rn-spotify-sdk';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../styles';
import Song from '../components/Song';
import LinearGradient from 'react-native-linear-gradient';
import { ModalContext } from '../App';

class AlbumView extends React.Component {
    state = {
        data: null,
        loading: true,
        showModal: false
    };

    componentDidMount() {
        this.routeSubscription = this.props.navigation.addListener(
            'willFocus',
            this.fetchData
        );
    }

    componentWillUnmount() {
        if (this.routeSubscription) {
            this.routeSubscription.remove();
        }
    }

    fetchData = ctx => {
        this.setState({ loading: true });
        let albumId;
        if (ctx) {
            albumId = ctx.state.params.albumId;
        } else {
            albumId = this.props.navigation.getParam('albumId');
        }
        // console.log('Fetching album...');
        // console.log('albumId', albumId);
        Spotify.getAlbum(albumId)
            .then(res => {
                console.log(res);
                this.setState({ data: res, loading: false });
            })
            .catch(err => {
                console.log(err);
            });
    };

    setModal = () => {
        this.setState(prevState => ({ showModal: !prevState.showModal }));
    };

    render() {
        return (
            <View style={globalStyles.container}>
                <StatusBar backgroundColor="#191414" />
                {this.state.data && !this.state.loading ? (
                    <ModalContext.Consumer>
                        {({ openModal }) => (
                            <ScrollView>
                                <View
                                    style={
                                        ([globalStyles.container],
                                        { paddingTop: 0 })
                                    }
                                >
                                    <View style={styles.header}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.props.navigation.goBack()
                                            }
                                        >
                                            <Icon
                                                name="ios-arrow-back"
                                                size={30}
                                                color="#fff"
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                openModal(
                                                    this.state.data.images[1]
                                                        .url,
                                                    this.state.data.name,
                                                    this.state.data.artists
                                                        .map(
                                                            artist =>
                                                                artist.name
                                                        )
                                                        .join(', '),
                                                    [
                                                        {
                                                            text:
                                                                'Add To Queue',
                                                            click: () =>
                                                                Spotify.queueURI(
                                                                    this.state
                                                                        .data
                                                                        .uri
                                                                )
                                                        },
                                                        {
                                                            text: 'View Artist',
                                                            click: () =>
                                                                this.props.navigation.navigate(
                                                                    'ArtistView',
                                                                    {
                                                                        artistId: this
                                                                            .state
                                                                            .data
                                                                            .artists[0]
                                                                            .id
                                                                    }
                                                                )
                                                        }
                                                    ]
                                                );
                                            }}
                                        >
                                            <Icon
                                                name="md-more"
                                                size={30}
                                                color="#fff"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Image
                                            source={{
                                                uri: this.state.data.images[1]
                                                    .url
                                            }}
                                            style={{ width: 150, height: 150 }}
                                        />
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: 24,
                                                textAlign: 'center'
                                            }}
                                        >
                                            {this.state.data.name}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                textAlign: 'center'
                                            }}
                                            color="grey"
                                        >
                                            Album by{' '}
                                            {this.state.data.artists
                                                .map(artist => artist.name)
                                                .join(', ')}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                Spotify.playURI(
                                                    this.state.data.uri,
                                                    0,
                                                    0
                                                )
                                            }
                                        >
                                            <View
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 150,
                                                    height: 50,
                                                    borderRadius: 25,
                                                    backgroundColor: '#1DB954',
                                                    marginTop: 10,
                                                    marginBottom: 10
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 28,
                                                        textAlign: 'center',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Play
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <FlatList
                                        contentContainerStyle={{
                                            zIndex: 1000,
                                            flex: 1,
                                            marginHorizontal: 10
                                        }}
                                        scrollEnabled={false}
                                        data={this.state.data.tracks.items}
                                        keyExtractor={(_, i) => i.toString()}
                                        renderItem={({ item }) => (
                                            <Song
                                                song={item}
                                                artists={
                                                    this.state.data.artists
                                                }
                                            />
                                        )}
                                    />
                                </View>
                            </ScrollView>
                        )}
                    </ModalContext.Consumer>
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
const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: '#191414',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: 15,
        height: 35
    }
});

export default AlbumView;
