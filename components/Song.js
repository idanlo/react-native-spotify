import React from 'react';
import {
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native-gesture-handler';
import { View } from 'react-native';
import { Text } from '../UI';
import Icon from 'react-native-vector-icons/Ionicons';
import Spotify from 'rn-spotify-sdk';

function Song(props) {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                marginHorizontal: 10,
                justifyContent: 'space-between'
            }}
        >
            <TouchableOpacity
                onPress={() => Spotify.playURI(props.song.uri, 0, 0)}
            >
                <View>
                    <Text>{props.song.name}</Text>
                    {props.artists && props.artists.length > 0 ? (
                        <Text style={{ color: 'grey', fontSize: 13 }}>
                            {props.artists
                                .map(artist => artist.name)
                                .join(', ')}
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log('MODAL')}>
                <Icon name="md-more" color="#fff" size={30} />
            </TouchableOpacity>
        </View>
    );
}

export default Song;