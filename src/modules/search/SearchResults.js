import React from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Spotify from 'rn-spotify-sdk';
import { commonStyles as globalStyles, colors } from '../../styles';
import Song from '../../components/Song';
import Text from '../../components/Text';

class SearchResults extends React.Component {
    state = {
        text: '',
        results: null,
    };

    textInput = null; // the ref to TextInput which has the .focus() method

    fetchData = async () => {
        const { text } = this.state;
        try {
            const data = await Spotify.search(text, [
                'album',
                'artist',
                'playlist',
                'track',
            ]);
            this.textInput.blur();
            console.log(data);
            this.setState({ results: data });
        } catch (err) {
            console.log(err);
        }
    };

    onChangeText = text => {
        this.setState({ text });
    };

    render() {
        return (
            <View style={globalStyles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Icon
                            name="ios-arrow-back"
                            color="#fff"
                            size={30}
                            style={{ textAlign: 'center' }}
                        />
                    </TouchableOpacity>
                    <TextInput
                        ref={t => {
                            this.textInput = t;
                        }}
                        onLayout={() => this.textInput.focus()}
                        placeholder="Search..."
                        onEndEditing={this.fetchData}
                        onChangeText={this.onChangeText}
                        placeholderTextColor="#fff"
                        style={{
                            flex: 5,
                            textAlign: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                        }}
                    />
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={this.fetchData}
                    >
                        <Icon
                            name="ios-search"
                            color="#fff"
                            size={30}
                            style={{ textAlign: 'center' }}
                        />
                    </TouchableOpacity>
                </View>
                {this.state.results ? (
                    <ScrollView>
                        {this.state.results.artists.items.length > 0 ? (
                            <View style={styles.albumList}>
                                <Text style={styles.title}>Artists</Text>
                                <FlatList
                                    contentContainerStyle={{
                                        justifyContent: 'center',
                                    }}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.results.artists.items}
                                    renderItem={({ item }) => (
                                        <View style={styles.album}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    // navigate to ArtistView
                                                    this.props.navigation.navigate(
                                                        'ArtistView',
                                                        {
                                                            artistId: item.id,
                                                        },
                                                    )
                                                }
                                            >
                                                <View>
                                                    <Image
                                                        source={{
                                                            uri:
                                                                item.images &&
                                                                item.images
                                                                    .length > 1
                                                                    ? item
                                                                          .images[1]
                                                                          .url
                                                                    : null,
                                                        }}
                                                        style={
                                                            styles.artistImage
                                                        }
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

                        {this.state.results.albums.items.length > 0 ? (
                            <View style={styles.albumList}>
                                <Text style={styles.title}>Albums</Text>
                                <FlatList
                                    contentContainerStyle={{
                                        justifyContent: 'center',
                                    }}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.results.albums.items}
                                    renderItem={({ item }) => (
                                        <View style={styles.album}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    // navigate to AlbumView
                                                    this.props.navigation.navigate(
                                                        'AlbumView',
                                                        {
                                                            albumId: item.id,
                                                        },
                                                    )
                                                }
                                            >
                                                <View>
                                                    <Image
                                                        source={{
                                                            uri:
                                                                item.images &&
                                                                item.images
                                                                    .length > 1
                                                                    ? item
                                                                          .images[1]
                                                                          .url
                                                                    : null,
                                                        }}
                                                        style={
                                                            styles.albumImage
                                                        }
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

                        {this.state.results.playlists.items.length > 0 ? (
                            <View style={styles.albumList}>
                                <Text style={styles.title}>Playlists</Text>
                                <FlatList
                                    contentContainerStyle={{
                                        justifyContent: 'center',
                                    }}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.results.playlists.items}
                                    renderItem={({ item }) => (
                                        <View style={styles.album}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    // navigate to PlaylistView
                                                    this.props.navigation.navigate(
                                                        'PlaylistView',
                                                        {
                                                            playlistId: item.id,
                                                        },
                                                    )
                                                }
                                            >
                                                <View>
                                                    <Image
                                                        source={{
                                                            uri:
                                                                item.images &&
                                                                item.images
                                                                    .length > 0
                                                                    ? item
                                                                          .images[0]
                                                                          .url
                                                                    : null,
                                                        }}
                                                        style={
                                                            styles.albumImage
                                                        }
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

                        {this.state.results.tracks.items.length > 0 ? (
                            <View>
                                <Text
                                    style={[
                                        styles.title,
                                        { textAlign: 'center' },
                                    ]}
                                >
                                    Tracks
                                </Text>
                                <FlatList
                                    contentContainerStyle={{
                                        zIndex: 1000,
                                        flex: 1,
                                        marginHorizontal: 10,
                                    }}
                                    scrollEnabled={false}
                                    data={this.state.results.tracks.items.slice(
                                        0,
                                        5,
                                    )}
                                    keyExtractor={(_, i) => i.toString()}
                                    renderItem={({ item }) => (
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
                                                this.props.currentTrack.uri ===
                                                    item.uri &&
                                                this.props.currentTrack
                                                    .contextUri ===
                                                    item.album.uri
                                                    ? colors.primaryLight
                                                    : null
                                            }
                                            song={item}
                                            artists={item.artists}
                                        />
                                    )}
                                />

                                <View
                                    style={{
                                        flex: 1,
                                        marginHorizontal: 20,
                                        marginTop: 8,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate(
                                                'PaginationView',
                                                {
                                                    next: this.state.results
                                                        .artists.href,
                                                },
                                            )
                                        }
                                    >
                                        <View style={styles.paginationLink}>
                                            <Text bold>See All artists</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate(
                                                'PaginationView',
                                                {
                                                    next: this.state.results
                                                        .tracks.href,
                                                },
                                            )
                                        }
                                    >
                                        <View style={styles.paginationLink}>
                                            <Text bold>See All songs</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate(
                                                'PaginationView',
                                                {
                                                    next: this.state.results
                                                        .playlists.href,
                                                },
                                            )
                                        }
                                    >
                                        <View style={styles.paginationLink}>
                                            <Text bold>See All playlists</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate(
                                                'PaginationView',
                                                {
                                                    next: this.state.results
                                                        .albums.href,
                                                },
                                            )
                                        }
                                    >
                                        <View style={styles.paginationLink}>
                                            <Text bold>See All albums</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}
                    </ScrollView>
                ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 50,
        backgroundColor: '#ffffff55',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    albumList: {
        width: '100%',
        height: 260,
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
    paginationLink: {
        height: 40,
    },
});

const mapStateToProps = state => ({
    currentTrack: state.player.currentTrack,
});

export default connect(mapStateToProps)(SearchResults);
