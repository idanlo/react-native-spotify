import React from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { Text } from '../UI';
import { createStackNavigator } from 'react-navigation';
import {
    FlatList,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native-gesture-handler';
import Spotify from 'rn-spotify-sdk';
import globalStyles from '../styles';
import AlbumView from '../components/AlbumView';
import ArtistView from '../components/ArtistView';
import PlaylistView from '../components/PlaylistView';

function Home(props) {
    const [recentlyPlayed, setRecentlyPlayed] = React.useState(null);
    const [featured, setFeatured] = React.useState(null);
    const [topArtists, setTopArtists] = React.useState(null);
    const [newReleases, setNewReleases] = React.useState(null);

    React.useEffect(() => {
        // fetch recently played
        Spotify.sendRequest(
            'v1/me/player/recently-played',
            'GET',
            { limit: 10 },
            true
        )
            .then(res => {
                console.log('RECENTLY PLAYED', res);
                setRecentlyPlayed(res);
            })
            .catch(err => {
                console.log(err);
            });

        // fetch browse featured
        Spotify.sendRequest(
            'v1/browse/featured-playlists',
            'GET',
            { limit: 10 },
            true
        )
            .then(res => {
                console.log('FEATURED', res);
                setFeatured(res);
            })
            .catch(err => {
                console.log(err);
            });

        // fetch top artists
        Spotify.sendRequest('v1/me/top/artists', 'GET', { limit: 10 }, true)
            .then(res => {
                console.log('TOP ARTISTS', res);
                setTopArtists(res);
            })
            .catch(err => {
                console.log(err);
            });

        // fetch new releases
        Spotify.sendRequest(
            'v1/browse/new-releases',
            'GET',
            { limit: 10 },
            true
        )
            .then(res => {
                console.log('NEW RELEASES', res);
                setNewReleases(res);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
    return (
        <View style={globalStyles.container}>
            <ScrollView>
                {recentlyPlayed ? (
                    <View style={styles.albumList}>
                        <Text style={styles.header}>Recently Played</Text>
                        <FlatList
                            contentContainerStyle={{ justifyContent: 'center' }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={recentlyPlayed.items}
                            renderItem={({ item, index }) => (
                                <View
                                    style={getAlbumStyle(
                                        index,
                                        recentlyPlayed.items.length
                                    )}
                                >
                                    {item.context !== 'null' &&
                                    item.context.type === 'artist' &&
                                    item.track.artists &&
                                    item.track.artists.length > 0 ? (
                                        <TouchableWithoutFeedback
                                            onPress={() =>
                                                // navigate to ArtistView
                                                props.navigation.navigate(
                                                    'ArtistView',
                                                    {
                                                        artistId:
                                                            item.track
                                                                .artists[0].id
                                                    }
                                                )
                                            }
                                        >
                                            <Image
                                                source={{
                                                    uri:
                                                        item.track.album
                                                            .images[1].url
                                                }}
                                                style={styles.artistImage}
                                            />
                                            <Text style={styles.albumName}>
                                                {item.track.artists[0].name}
                                            </Text>
                                        </TouchableWithoutFeedback>
                                    ) : (
                                        <TouchableWithoutFeedback
                                            onPress={() =>
                                                // navigate to AlbumView
                                                props.navigation.navigate(
                                                    'AlbumView',
                                                    {
                                                        albumId:
                                                            item.track.album.id
                                                    }
                                                )
                                            }
                                        >
                                            <Image
                                                source={{
                                                    uri:
                                                        item.track.album
                                                            .images[1].url
                                                }}
                                                style={styles.albumImage}
                                            />
                                            <Text style={styles.albumName}>
                                                {item.track.name}
                                            </Text>
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'grey',
                                                    fontSize: 12
                                                }}
                                            >
                                                {item.track.album.name}
                                            </Text>
                                        </TouchableWithoutFeedback>
                                    )}
                                </View>
                            )}
                            keyExtractor={(_, i) => i.toString()}
                        />
                    </View>
                ) : null}
                {featured ? (
                    <View style={styles.albumList}>
                        <Text style={styles.header}>{featured.message}</Text>
                        <FlatList
                            contentContainerStyle={{ justifyContent: 'center' }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={featured.playlists.items}
                            renderItem={({ item, index }) => (
                                <View
                                    style={getAlbumStyle(
                                        index,
                                        featured.playlists.items.length
                                    )}
                                >
                                    <TouchableWithoutFeedback
                                        onPress={() =>
                                            // navigate to PlaylistView
                                            props.navigation.navigate(
                                                'PlaylistView',
                                                { playlistId: item.id }
                                            )
                                        }
                                    >
                                        <Image
                                            source={{
                                                uri: item.images[0].url
                                            }}
                                            style={styles.albumImage}
                                        />
                                        <Text style={styles.albumName}>
                                            {item.name}
                                        </Text>
                                    </TouchableWithoutFeedback>
                                </View>
                            )}
                            keyExtractor={(_, i) => i.toString()}
                        />
                    </View>
                ) : null}
                {topArtists ? (
                    <View style={styles.albumList}>
                        <Text style={styles.header}>Your top artists</Text>
                        <FlatList
                            contentContainerStyle={{ justifyContent: 'center' }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={topArtists.items}
                            renderItem={({ item, index }) => (
                                <View
                                    style={getAlbumStyle(
                                        index,
                                        topArtists.items.length
                                    )}
                                >
                                    <TouchableWithoutFeedback
                                        onPress={() =>
                                            // navigate to ArtistView
                                            props.navigation.navigate(
                                                'ArtistView',
                                                { artistId: item.id }
                                            )
                                        }
                                    >
                                        <Image
                                            source={{
                                                uri: item.images[1].url
                                            }}
                                            style={styles.artistImage}
                                        />
                                        <Text style={styles.albumName}>
                                            {item.name}
                                        </Text>
                                    </TouchableWithoutFeedback>
                                </View>
                            )}
                            keyExtractor={(_, i) => i.toString()}
                        />
                    </View>
                ) : null}
                {newReleases ? (
                    <View style={styles.albumList}>
                        <Text style={styles.header}>New Releases</Text>
                        <FlatList
                            contentContainerStyle={{ justifyContent: 'center' }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={newReleases.albums.items}
                            renderItem={({ item, index }) => (
                                <View
                                    style={getAlbumStyle(
                                        index,
                                        newReleases.albums.items.length
                                    )}
                                >
                                    <TouchableWithoutFeedback
                                        onPress={() =>
                                            // navigate to AlbumView
                                            props.navigation.navigate(
                                                'AlbumView',
                                                { albumId: item.id }
                                            )
                                        }
                                    >
                                        <Image
                                            source={{
                                                uri: item.images[1].url
                                            }}
                                            style={styles.albumImage}
                                        />
                                        <Text style={styles.albumName}>
                                            {item.name}
                                        </Text>
                                    </TouchableWithoutFeedback>
                                </View>
                            )}
                            keyExtractor={(_, i) => i.toString()}
                        />
                    </View>
                ) : null}
            </ScrollView>
        </View>
    );
}

const getAlbumStyle = (index, length) => ({
    height: 180,
    width: 170,
    marginLeft: index === 0 ? 10 : 0,
    marginRight: index === length - 1 ? -10 : 0,
    alignItems: 'center'
});

const styles = StyleSheet.create({
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10
    },
    albumList: {
        width: '100%',
        height: 248,
        justifyContent: 'center',
        alignItems: 'center'
    },
    album: {
        height: 180,
        width: 170
    },
    albumImage: {
        height: 150,
        width: 150
    },
    albumName: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    artistImage: {
        width: 150,
        height: 150,
        borderRadius: 75
    }
});

export default createStackNavigator(
    {
        Main: {
            screen: Home
        },
        AlbumView: {
            screen: AlbumView
        },
        ArtistView: {
            screen: ArtistView
        },
        PlaylistView: {
            screen: PlaylistView
        }
    },
    { headerMode: 'none' }
);
