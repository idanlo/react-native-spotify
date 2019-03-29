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
import { ModalContext } from '../App';

function PlaylistView(props) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    let routeSubscription;

    React.useEffect(() => {
        routeSubscription = props.navigation.addListener(
            'willFocus',
            fetchData
        );
        fetchData();
        return () => {
            console.log('unmount', routeSubscription);
            routeSubscription.remove();
        };
    }, []);

    fetchData = ctx => {
        setLoading(true);
        let playlistId;
        if (ctx) {
            playlistId = ctx.state.params.playlistId;
        } else {
            playlistId = props.navigation.getParam('playlistId');
        }

        Spotify.getPlaylist(playlistId)
            .then(res => {
                console.log(res);
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            });

        Spotify.getMe().then(res => {
            Spotify.sendRequest(
                `v1/playlists/${playlistId}/followers/contains?ids=${res.id}`,
                'GET',
                {},
                false
            ).then(isFollowing => {
                console.log(isFollowing);
            });
        });
    };

    return (
        <View style={globalStyles.container}>
            <StatusBar backgroundColor="#191414" />
            {data && !loading ? (
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
                                            props.navigation.goBack()
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
                                                    image: data.images[0].url,
                                                    primaryText: data.name,
                                                    secondaryText: `Playlist by ${
                                                        data.owner.display_name
                                                    }`
                                                },
                                                [
                                                    {
                                                        text: 'Follow',
                                                        click: () =>
                                                            Spotify.sendRequest(
                                                                `v1/playlists/${
                                                                    data.id
                                                                }/followers`,
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
                                            uri: data.images[0].url
                                        }}
                                        style={{ width: 150, height: 150 }}
                                    />
                                    <Text
                                        bold
                                        size={24}
                                        style={{
                                            textAlign: 'center'
                                        }}
                                    >
                                        {data.name}
                                    </Text>
                                    <Text
                                        size={14}
                                        style={{
                                            textAlign: 'center'
                                        }}
                                        color="grey"
                                    >
                                        Playlist by {data.owner.display_name}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            Spotify.playURI(data.uri, 0, 0)
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
                                                bold
                                                size={28}
                                                style={{
                                                    textAlign: 'center'
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
                                    data={data.tracks.items}
                                    keyExtractor={(_, i) => i.toString()}
                                    renderItem={({ item }) => (
                                        <Song
                                            song={item.track}
                                            artists={item.track.artists}
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

export default PlaylistView;
