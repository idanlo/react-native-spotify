import React from 'react';
import {
    View,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
    TouchableWithoutFeedback,
    Image,
    StyleSheet
} from 'react-native';
import { Text } from '../UI';
import Icon from 'react-native-vector-icons/Ionicons';
import Spotify from 'rn-spotify-sdk/src/Spotify';
import { ModalContext } from '../components/Modal';
import Song from '../components/Song';
import globalStyles from '../styles';

const { width } = Dimensions.get('window');

class ArtistView extends React.Component {
    state = {
        artist: null,
        artistTopTracks: null,
        artistAlbums: null,
        artistRelated: null,
        loading: true
    };
    routeSubscription = null;

    componentDidMount() {
        this.routeSubscription = this.props.navigation.addListener(
            'willFocus',
            this.fetchData
        );
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
                this.setState({ artist: res, loading: false });
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });

        Spotify.getArtistTopTracks(artistId, 'from_token')
            .then(res => {
                this.setState({ artistTopTracks: res.tracks, loading: false });
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });

        Spotify.getArtistAlbums(artistId, { limit: 4 })
            .then(res => {
                this.setState({ artistAlbums: res, loading: false });
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });

        Spotify.getArtistRelatedArtists(artistId, { limit: 10 })
            .then(res => {
                this.setState({ artistRelated: res.artists, loading: false });
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
                {this.state.artist &&
                this.state.artistTopTracks &&
                this.state.artistAlbums &&
                this.state.artistRelated &&
                !this.state.loading ? (
                    <ModalContext.Consumer>
                        {({ openModal }) => (
                            <ScrollView>
                                <View
                                    style={[
                                        globalStyles.container,
                                        { paddingTop: 0 }
                                    ]}
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
                                                    {
                                                        image: this.state.artist
                                                            .images[1].url,
                                                        primaryText: this.state
                                                            .artist.name,
                                                        type: 'artist'
                                                    },
                                                    [
                                                        {
                                                            text:
                                                                'Add To Queue',
                                                            click: () =>
                                                                Spotify.queueURI(
                                                                    this.state
                                                                        .artist
                                                                        .uri
                                                                )
                                                        },
                                                        {
                                                            text: 'Follow',
                                                            click: () =>
                                                                Spotify.sendRequest(
                                                                    `v1/me/following?type=artist&ids=${
                                                                        this
                                                                            .state
                                                                            .artist
                                                                            .id
                                                                    }`,
                                                                    'PUT',
                                                                    {},
                                                                    false
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
                                                uri: this.state.artist.images[1]
                                                    .url
                                            }}
                                            style={{
                                                width: 150,
                                                height: 150,
                                                borderRadius: 75
                                            }}
                                        />
                                        <Text
                                            bold
                                            size={24}
                                            style={{
                                                textAlign: 'center'
                                            }}
                                        >
                                            {this.state.artist.name}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                Spotify.playURI(
                                                    this.state.artist.uri,
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
                                                    size={28}
                                                    bold
                                                    style={{
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    Play
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <Text
                                        bold
                                        size={18}
                                        style={{ textAlign: 'center' }}
                                    >
                                        Popular
                                    </Text>
                                    {/* Popular songs list (top 5). this is not in the topTracks View because it 
                                    then makes the Song component not full width for some reason */}
                                    <FlatList
                                        contentContainerStyle={{
                                            flex: 1,
                                            marginHorizontal: 10
                                        }}
                                        scrollEnabled={false}
                                        data={this.state.artistTopTracks.slice(
                                            5
                                        )}
                                        keyExtractor={(_, i) => i.toString()}
                                        renderItem={({ item }) => (
                                            <Song
                                                song={item}
                                                artists={item.artists}
                                            />
                                        )}
                                    />

                                    <Text
                                        bold
                                        size={18}
                                        style={{
                                            textAlign: 'center',
                                            marginBottom: 15
                                        }}
                                    >
                                        Albums
                                    </Text>
                                    <FlatList
                                        contentContainerStyle={{
                                            flex: 1,
                                            marginHorizontal: 10
                                        }}
                                        numColumns={2}
                                        scrollEnables={false}
                                        data={this.state.artistAlbums.items}
                                        keyExtractor={(_, i) => i.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.props.navigation.navigate(
                                                        'AlbumView',
                                                        { albumId: item.id }
                                                    )
                                                }
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'center',
                                                    paddingBottom: 10
                                                }}
                                            >
                                                <Image
                                                    source={{
                                                        uri: item.images[1].url
                                                    }}
                                                    style={{
                                                        height: width / 2 - 30,
                                                        width: width / 2 - 30
                                                    }}
                                                />
                                                <Text
                                                    bold
                                                    size={16}
                                                    style={{
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {item.name}
                                                </Text>
                                                <Text
                                                    size={12}
                                                    color="grey"
                                                    style={{
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {item.total_tracks} Songs ●{' '}
                                                    {item.release_date.substring(
                                                        0,
                                                        4
                                                    )}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />

                                    <Text
                                        bold
                                        size={18}
                                        style={{
                                            textAlign: 'center',
                                            marginBottom: 15
                                        }}
                                    >
                                        Related Artists
                                    </Text>

                                    <FlatList
                                        contentContainerStyle={{
                                            justifyContent: 'center'
                                        }}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        data={this.state.artistRelated}
                                        keyExtractor={(_, i) => i.toString()}
                                        renderItem={({ item }) => (
                                            <View
                                                style={{
                                                    height: 180,
                                                    width: 170,
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        // navigate to ArtistView
                                                        this.props.navigation.navigate(
                                                            'ArtistView',
                                                            {
                                                                artistId:
                                                                    item.id
                                                            }
                                                        );
                                                        this.fetchData();
                                                    }}
                                                >
                                                    <View>
                                                        <Image
                                                            source={{
                                                                uri:
                                                                    item
                                                                        .images[1]
                                                                        .url
                                                            }}
                                                            style={{
                                                                width: 150,
                                                                height: 150,
                                                                borderRadius: 75
                                                            }}
                                                        />
                                                        <Text
                                                            bold
                                                            style={{
                                                                textAlign:
                                                                    'center'
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
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
    },
    topTracks: {
        flex: 1,
        alignItems: 'center'
    }
});

export default ArtistView;
