import React from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import Text from '../../components/Text';
import Album from '../album/Album';
import styles from './styles';

export default function RecentlyPlayed(props) {
    return (
        <View style={styles.albumList}>
            <Text style={styles.header}>Recently Played</Text>
            <FlatList
                contentContainerStyle={{
                    justifyContent: 'center',
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={props.items}
                renderItem={({ item }) => (
                    <View style={styles.album}>
                        {item.context !== 'null' &&
                        item.context.type === 'artist' &&
                        item.track.artists &&
                        item.track.artists.length > 0 ? (
                            <TouchableOpacity
                                onPress={() =>
                                    // navigate to ArtistView
                                    props.navigation.navigate('ArtistView', {
                                        artistId: item.track.artists[0].id,
                                    })
                                }
                            >
                                <View>
                                    <Image
                                        source={{
                                            uri: item.track.album.images[1].url,
                                        }}
                                        style={styles.artistImage}
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={styles.albumName}
                                    >
                                        {item.track.artists[0].name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Album
                                style={{ height: 200 }}
                                onPress={() =>
                                    // navigate to AlbumView
                                    props.navigation.navigate('AlbumView', {
                                        albumId: item.track.album.id,
                                    })
                                }
                                image={item.track.album.images[1].url}
                                imageStyle={styles.albumImage}
                                primaryText={item.track.name}
                                secondaryText={item.track.album.name}
                            />
                        )}
                    </View>
                )}
                keyExtractor={(_, i) => i.toString()}
            />
        </View>
    );
}
