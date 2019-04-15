import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from './Text';

function Song(props) {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                marginHorizontal: 10,
                justifyContent: 'space-between',
            }}
        >
            <TouchableOpacity onPress={props.onPress} style={{ flex: 10 }}>
                <View>
                    <Text numberOfLines={1} color={props.color || '#fff'}>
                        {props.song.name}
                    </Text>
                    {props.artists && props.artists.length > 0 ? (
                        <Text numberOfLines={1} size={13} color="grey">
                            {props.artists
                                .map(artist => artist.name)
                                .join(', ')}
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => console.log('MODAL')}
                style={{ flex: 1, alignItems: 'flex-end' }}
            >
                <Icon name="md-more" color="#fff" size={30} />
            </TouchableOpacity>
        </View>
    );
}

export default Song;
