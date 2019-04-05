import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    StatusBar,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Spotify from 'rn-spotify-sdk';
import Text from '../../components/Text';
import { commonStyles as globalStyles } from '../../styles';
import Album from '../album/Album';

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
            true,
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
            true,
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
            true,
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
        <View style={[globalStyles.container, { paddingTop: 0 }]}>
            <StatusBar backgroundColor="transparent" translucent />
            <ScrollView>
                <View style={{ marginTop: StatusBar.currentHeight }}>
                    {recentlyPlayed ? (
                        <View style={styles.albumList}>
                            <Text style={styles.header}>Recently Played</Text>
                            <FlatList
                                contentContainerStyle={{
                                    justifyContent: 'center',
                                }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={recentlyPlayed.items}
                                renderItem={({ item }) => (
                                    <View style={styles.album}>
                                        {item.context !== 'null' &&
                                        item.context.type === 'artist' &&
                                        item.track.artists &&
                                        item.track.artists.length > 0 ? (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    // navigate to ArtistView
                                                    props.navigation.navigate(
                                                        'ArtistView',
                                                        {
                                                            artistId:
                                                                item.track
                                                                    .artists[0]
                                                                    .id,
                                                        },
                                                    )
                                                }
                                            >
                                                <View>
                                                    <Image
                                                        source={{
                                                            uri:
                                                                item.track.album
                                                                    .images[1]
                                                                    .url,
                                                        }}
                                                        style={
                                                            styles.artistImage
                                                        }
                                                    />
                                                    <Text
                                                        numberOfLines={1}
                                                        style={styles.albumName}
                                                    >
                                                        {
                                                            item.track
                                                                .artists[0].name
                                                        }
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <Album
                                                style={{ height: 200 }}
                                                onPress={() =>
                                                    // navigate to AlbumView
                                                    props.navigation.navigate(
                                                        'AlbumView',
                                                        {
                                                            albumId:
                                                                item.track.album
                                                                    .id,
                                                        },
                                                    )
                                                }
                                                image={
                                                    item.track.album.images[1]
                                                        .url
                                                }
                                                imageStyle={styles.albumImage}
                                                primaryText={item.track.name}
                                                secondaryText={
                                                    item.track.album.name
                                                }
                                            />
                                        )}
                                    </View>
                                )}
                                keyExtractor={(_, i) => i.toString()}
                            />
                        </View>
                    ) : null}
                    {featured ? (
                        <View style={styles.albumList}>
                            <Text style={styles.header}>
                                {featured.message}
                            </Text>
                            <FlatList
                                contentContainerStyle={{
                                    justifyContent: 'center',
                                }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={featured.playlists.items}
                                renderItem={({ item }) => (
                                    <View style={styles.album}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                // navigate to PlaylistView
                                                props.navigation.navigate(
                                                    'PlaylistView',
                                                    { playlistId: item.id },
                                                )
                                            }
                                        >
                                            <View>
                                                <Image
                                                    source={{
                                                        uri: item.images[0].url,
                                                    }}
                                                    style={styles.albumImage}
                                                />
                                                <Text
                                                    numberOfLines={1}
                                                    style={styles.albumName}
                                                >
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
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
                                contentContainerStyle={{
                                    justifyContent: 'center',
                                }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={topArtists.items}
                                renderItem={({ item }) => (
                                    <View style={styles.album}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                // navigate to ArtistView
                                                props.navigation.navigate(
                                                    'ArtistView',
                                                    { artistId: item.id },
                                                )
                                            }
                                        >
                                            <View>
                                                <Image
                                                    source={{
                                                        uri: item.images[1].url,
                                                    }}
                                                    style={styles.artistImage}
                                                />
                                                <Text
                                                    numberOfLines={1}
                                                    style={styles.albumName}
                                                >
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
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
                                contentContainerStyle={{
                                    justifyContent: 'center',
                                }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={newReleases.albums.items}
                                renderItem={({ item }) => (
                                    <View style={styles.album}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                // navigate to AlbumView
                                                props.navigation.navigate(
                                                    'AlbumView',
                                                    { albumId: item.id },
                                                )
                                            }
                                        >
                                            <View>
                                                <Image
                                                    source={{
                                                        uri: item.images[1].url,
                                                    }}
                                                    style={styles.albumImage}
                                                />
                                                <Text
                                                    numberOfLines={1}
                                                    style={styles.albumName}
                                                >
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                keyExtractor={(_, i) => i.toString()}
                            />
                        </View>
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    albumList: {
        width: '100%',
        height: 248,
        justifyContent: 'center',
        alignItems: 'center',
    },
    album: {
        height: 180,
        width: 170,
        alignItems: 'center',
    },
    albumImage: {
        height: 150,
        width: 150,
    },
    albumName: {
        fontWeight: 'bold',
        textAlign: 'center',
        width: 150,
    },
    artistImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
});

export default Home;
