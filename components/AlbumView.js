import React from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { Text } from '../UI';
import Spotify from 'rn-spotify-sdk';
import {
    FlatList,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../styles';

function AlbumView(props) {
    const [data, setData] = React.useState(null);
    const albumId = props.navigation.getParam('albumId');

    React.useEffect(() => {
        Spotify.getAlbum(albumId)
            .then(res => {
                console.log(res);
                setData(res);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
    return (
        <View style={globalStyles.container}>
            {data ? (
                <View style={globalStyles.container}>
                    <Image
                        source={{ uri: data.images[1].url }}
                        style={{ width: 150, height: 150 }}
                    />
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 24,
                            textAlign: 'center'
                        }}
                    >
                        {data.name}
                    </Text>
                    <TouchableOpacity
                        onPress={() => Spotify.playURI(data.uri, 0, 0)}
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
                    <FlatList
                        data={data.tracks.items}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginLeft: 0,
                                    paddingRight: 0
                                }}
                            >
                                <TouchableWithoutFeedback
                                    onPress={() =>
                                        Spotify.playURI(item.uri, 0, 0)
                                    }
                                >
                                    <Icon
                                        name="ios-play"
                                        color="#fff"
                                        size={30}
                                    />
                                </TouchableWithoutFeedback>
                                <Text
                                    style={{
                                        marginLeft: 10
                                    }}
                                >
                                    {item.name}
                                </Text>
                            </View>
                        )}
                    />
                </View>
            ) : null}
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexGrow: 1,
//         alignItems: 'center',
//         backgroundColor: '#191414',
//         paddingTop: 40
//     }
// });

export default AlbumView;
