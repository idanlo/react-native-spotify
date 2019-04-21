import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
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
                // backgroundColor: 'green',
                // width: '100%',
            }}
        >
            <TouchableOpacity onPress={props.onPress} style={{ flex: 10 }}>
                <View
                    // only apply these styles if there is an image (if it is an artist)
                    style={{
                        flexDirection: props.image ? 'row' : null,
                        alignItems: props.image ? 'center' : null,
                    }}
                >
                    {props.image ? (
                        <Image
                            source={{ uri: props.image }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: props.artist ? 20 : 0,
                                marginRight: 10,
                            }}
                        />
                    ) : null}
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
                    {props.secondaryText ? (
                        <Text numberOfLines={1} size={13} color="grey">
                            {props.secondaryText}
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={props.onOpenModal}
                style={{ flex: 1, alignItems: 'flex-end' }}
            >
                <Icon name="md-more" color="#fff" size={30} />
            </TouchableOpacity>
        </View>
    );
}

export default Song;
