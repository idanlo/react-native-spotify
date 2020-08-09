import React from 'react';
import {View, FlatList, TouchableOpacity, Image} from 'react-native';
import Text from '../../components/Text';
import styles from './styles';

export default function Featured(props) {
  return (
    <View style={styles.albumList}>
      <Text style={styles.header}>Featured</Text>
      <FlatList
        contentContainerStyle={{
          justifyContent: 'center',
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={props.featured.playlists.items}
        renderItem={({item}) => (
          <View style={styles.album}>
            <TouchableOpacity
              onPress={() =>
                // navigate to PlaylistView
                props.navigation.navigate('PlaylistView', {
                  playlistId: item.id,
                })
              }>
              <View>
                <Image
                  source={{
                    uri: item.images[0].url,
                  }}
                  style={styles.albumImage}
                />
                <Text numberOfLines={1} style={styles.albumName}>
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
