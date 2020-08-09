import React from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import Text from '../../components/Text';
import styles from './styles';

export default function TopArtists(props) {
    return (
        <View style={styles.albumList}>
            <Text style={styles.header}>Your top artists</Text>
            <FlatList
                contentContainerStyle={{
                    justifyContent: 'center',
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={props.items}
                renderItem={({ item }) => (
                    <View style={styles.album}>
                        <TouchableOpacity
                            onPress={() =>
                                // navigate to ArtistView
                                props.navigation.navigate('ArtistView', {
                                    artistId: item.id,
                                })
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
    );
}
