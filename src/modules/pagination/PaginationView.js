import React from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
    StyleSheet,
} from 'react-native';
import Spotify from 'rn-spotify-sdk/src/Spotify';
import Icon from 'react-native-vector-icons/Ionicons';
import { commonStyles as globalStyles, colors } from '../../styles';
import Text from '../../components/Text';
import Song from '../../components/Song';

const { width } = Dimensions.get('screen');

export default class PaginationView extends React.PureComponent {
    state = {
        next: '',
        href: '',
        data: null,
        type: '',
        loading: true,
    };

    componentDidMount() {
        // create route subscription to know when to re-fetch data because the component is mounted even if it is
        // not in the view, so react-navigation provides events
        this.routeSubscription = this.props.navigation.addListener(
            'willFocus',
            this.fetchInitialData,
        );
    }

    componentWillUnmount() {
        // cancel route subscription when the component unmounts (if the subscription exists)
        if (this.routeSubscription) {
            this.routeSubscription.remove();
        }
    }

    fetchInitialData = ctx => {
        this.setState({ loading: true });
        let url;
        // sometimes react-navigation gives a 'context' object which contains the route params
        if (ctx) {
            // eslint-disable-next-line prefer-destructuring
            url = ctx.state.params.next;
        } else {
            url = this.props.navigation.getParam('next');
        }
        if (this.state.href === url) {
            this.setState({ loading: false });
            return;
        }
        console.log('Pagination url', url);
        const slicedUrl = url.substring(24); // https://api.spotify.com/ is 24 characters, and this is the format that the sdk receives
        console.log('Sliced pagination url', url);
        this.setState({ next: slicedUrl, href: url });

        Spotify.sendRequest(slicedUrl, 'GET', {}, true).then(res => {
            this.setState({ loading: false });
            if ('tracks' in res) {
                this.setState({
                    data: res.tracks,
                    next: res.tracks.next.substring(24),
                    type: 'tracks',
                });
            } else if ('playlists' in res) {
                this.setState({
                    data: res.playlists,
                    next: res.playlists.next.substring(24),
                    type: 'playlists',
                });
            } else if ('artists' in res) {
                this.setState({
                    data: res.artists,
                    next: res.artists.next.substring(24),
                    type: 'artists',
                });
            } else if ('albums' in res) {
                this.setState({
                    data: res.albums,
                    next: res.albums.next.substring(24),
                    type: 'albums',
                });
            } else if ('items' in res) {
                if ('album' in res.items[0]) {
                    const newItems = res.items.map(item => item.album);
                    this.setState({
                        data: { items: newItems },
                        next: res.next.substring(24),
                        type: newItems[0].type,
                    });
                } else if ('track' in res.items[0]) {
                    const newItems = res.items.map(item => item.track);
                    this.setState({
                        data: { items: newItems },
                        next: res.next.substring(24),
                        type: newItems[0].type,
                    });
                } else {
                    this.setState({
                        data: { items: res.items },
                        next: res.next.substring(24),
                        type: res.items[0].type,
                    });
                }
            }
            console.log('Pagination', res);
        });
    };

    fetchPaginationData = () => {
        // this is called whenever the flatlist is scrolled to the bottom
        if (this.state.next) {
            Spotify.sendRequest(this.state.next, 'GET', {}, true).then(res => {
                if ('tracks' in res) {
                    // handle endpoints like https://developer.spotify.com/documentation/web-api/reference/search/search/ when searching for tracks
                    this.setState(state => ({
                        data: {
                            ...state.data,
                            items: [...state.data.items, ...res.tracks.items],
                        },
                        next: res.tracks.next.substring(24),
                    }));
                } else if ('playlists' in res) {
                    // handle endpoints like https://developer.spotify.com/documentation/web-api/reference/search/search/ when searching for playlists
                    this.setState(state => ({
                        data: {
                            ...state.data,
                            items: [
                                ...state.data.items,
                                ...res.playlists.items,
                            ],
                        },
                        next: res.playlists.next.substring(24),
                    }));
                } else if ('artists' in res) {
                    // handle endpoints like https://developer.spotify.com/documentation/web-api/reference/search/search/ when searching for artists
                    this.setState(state => ({
                        data: {
                            ...state.data,
                            items: [...state.data.items, ...res.artists.items],
                        },
                        next: res.artists.next.substring(24),
                    }));
                } else if ('albums' in res) {
                    // handle endpoints like https://developer.spotify.com/documentation/web-api/reference/search/search/ when searching for albums
                    this.setState(state => ({
                        data: {
                            ...state.data,
                            items: [...state.data.items, ...res.albums.items],
                        },
                        next: res.albums.next.substring(24),
                    }));
                } else if ('items' in res) {
                    // handle endpoints where you receive an array of items without a wrapping object (like https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-albums/)
                    if ('album' in res.items[0]) {
                        // handle endpoints where you receive an array of items without a wrapping object but the content inside is wrapped
                        // in an object, like this endpoint https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-albums/
                        const newItems = res.items.map(item => item.album);
                        this.setState(state => ({
                            data: { items: [...state.data.items, ...newItems] },
                            next: res.next.substring(24),
                        }));
                    } else if ('track' in res.items[0]) {
                        // handle endpoints where you receive an array of items without a wrapping object but the content inside is wrapped
                        // in an object, like this endpoint https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks/
                        const newItems = res.items.map(item => item.track);
                        this.setState(state => ({
                            data: { items: [...state.data.items, ...newItems] },
                            next: res.next.substring(24),
                        }));
                    } else {
                        this.setState(state => ({
                            data: {
                                items: [...state.data.items, ...res.items],
                            },
                            next: res.next.substring(24),
                        }));
                    }
                }
            });
        }
    };

    renderItem = ({ item }) => {
        if (item.type === 'track') {
            return (
                <Song
                    onPress={() =>
                        Spotify.playURI(
                            item.album.uri,
                            item.track_number - 1, // for some reason item.track_number is not an index (which is what it should be)
                            0,
                        )
                    }
                    color={
                        this.props.currentTrack &&
                        this.props.currentTrack.uri === item.uri &&
                        this.props.currentTrack.contextUri === item.album.uri
                            ? colors.primaryLight
                            : null
                    }
                    song={item}
                    artists={item.artists}
                    onOpenModal={() => {
                        this.props.showModal(
                            {
                                image: item.album.images[1].url,
                                primaryText: item.album.name,
                                secondaryText: item.name,
                            },

                            [
                                {
                                    text: 'Add To Queue',
                                    click: () => Spotify.queueURI(item.uri),
                                },
                                {
                                    text: 'View Artist',
                                    click: () =>
                                        this.props.navigation.navigate(
                                            'ArtistView',
                                            {
                                                artistId: item.artists[0].id,
                                            },
                                        ),
                                },
                                {
                                    text: 'View Album',
                                    click: () =>
                                        this.props.navigation.navigate(
                                            'ArtistView',
                                            {
                                                artistId: item.album.id,
                                            },
                                        ),
                                },
                            ],
                        );
                    }}
                />
            );
        }
        if (item.type === 'artist') {
            return (
                <Song
                    onPress={() =>
                        this.props.navigation.navigate('ArtistView', {
                            artistId: item.id,
                        })
                    }
                    color={
                        this.props.currentTrack &&
                        this.props.currentTrack.contextUri === item.uri
                            ? colors.primaryLight
                            : null
                    }
                    song={item}
                    artists={null}
                    artist
                    image={
                        item.images && item.images.length > 1
                            ? item.images[1].url
                            : null
                    }
                />
            );
        }

        if (item.type === 'playlist') {
            return (
                <View
                    style={{
                        flex: 1,
                        paddingBottom: 25,
                    }}
                >
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate('PlaylistView', {
                                playlistId: item.id,
                            })
                        }
                        style={{ alignItems: 'center' }}
                    >
                        <Image
                            source={{ uri: item.images[0].url }}
                            style={{
                                height: width / 2 - 30,
                                width: width / 2 - 30,
                            }}
                        />
                        <Text bold numberOfLines={1}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (item.type === 'album') {
            return (
                <View
                    style={{
                        flex: 1,
                        paddingBottom: 25,
                    }}
                >
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate('AlbumView', {
                                albumId: item.id,
                            })
                        }
                        style={{ alignItems: 'center' }}
                    >
                        <Image
                            source={{ uri: item.images[1].url }}
                            style={{
                                height: width / 2 - 30,
                                width: width / 2 - 30,
                            }}
                        />
                        <Text bold numberOfLines={1}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    render() {
        return (
            <View style={[globalStyles.container, { paddingTop: 0 }]}>
                {this.state.data && !this.state.loading ? (
                    <View style={globalStyles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Icon
                                    name="ios-arrow-back"
                                    size={30}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                            <View>
                                <View>
                                    <Text bold>{this.state.type}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }} />
                        </View>
                        {this.state.data &&
                        (this.state.data.items[0].type === 'artist' ||
                            this.state.data.items[0].type === 'track') ? (
                            <FlatList
                                data={this.state.data.items}
                                keyExtractor={(_, i) => i.toString()}
                                onEndReached={this.fetchPaginationData}
                                onEndReachedThreshold={0.1}
                                renderItem={this.renderItem}
                            />
                        ) : null}
                        {this.state.data &&
                        (this.state.data.items[0].type === 'album' ||
                            this.state.data.items[0].type === 'playlist') ? (
                            <FlatList
                                contentContainerStyle={{
                                    marginHorizontal: 10,
                                }}
                                data={this.state.data.items}
                                keyExtractor={(_, i) => i.toString()}
                                onEndReached={this.fetchPaginationData}
                                numColumns={2}
                                onEndReachedThreshold={0.1}
                                renderItem={this.renderItem}
                            />
                        ) : null}
                    </View>
                ) : (
                    <View
                        style={[
                            globalStyles.container,
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
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
        backgroundColor: '#191414',
        flexDirection: 'row',
        marginHorizontal: 25,
        height: 35,
        alignItems: 'center',
    },
});
