import React from 'react';
import { Text, View, StyleSheet, Image, StatusBar } from 'react-native';
import {
    FlatList,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native-gesture-handler';
import Spotify from 'rn-spotify-sdk';

export default function Home() {
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
        <View style={styles.container}>
            <ScrollView>
                {recentlyPlayed ? (
                    <View style={styles.albumList}>
                        <Text style={styles.header}>Recently Played</Text>
                        <FlatList
                            contentContainerStyle={{ justifyContent: 'center' }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={recentlyPlayed.items}
                            renderItem={({ item }) => (
                                <View style={styles.album}>
                                    <TouchableWithoutFeedback
                                        onPress={() =>
                                            Spotify.playURI(
                                                item.track.uri,
                                                0,
                                                0
                                            )
                                        }
                                    >
                                        <Image
                                            source={{
                                                uri:
                                                    item.track.album.images[1]
                                                        .url
                                            }}
                                            style={styles.albumImage}
                                        />
                                        <Text style={styles.albumName}>
                                            {item.track.album.name}
                                        </Text>
                                    </TouchableWithoutFeedback>
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
                            renderItem={({ item }) => (
                                <View style={styles.album}>
                                    <TouchableWithoutFeedback
                                        onPress={() =>
                                            Spotify.playURI(item.uri, 0, 0)
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
                            renderItem={({ item }) => (
                                <View style={styles.album}>
                                    <TouchableWithoutFeedback
                                        onPress={() =>
                                            Spotify.playURI(item.uri, 0, 0)
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
                            renderItem={({ item }) => (
                                <View style={styles.album}>
                                    <TouchableWithoutFeedback
                                        onPress={() =>
                                            Spotify.playURI(item.uri, 0, 0)
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#191414',
        paddingTop: StatusBar.currentHeight
    },
    header: {
        color: '#fff',
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10
    },
    albumList: {
        width: '95%',
        height: 204,
        justifyContent: 'center',
        alignItems: 'center'
    },
    album: {
        height: 150,
        width: 130,
        marginLeft: 10
    },
    albumImage: {
        width: 120,
        height: 120
    },
    albumName: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    artistImage: {
        width: 120,
        height: 120,
        borderRadius: 60
    }
});
