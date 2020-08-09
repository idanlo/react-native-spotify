import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Spotify from 'rn-spotify-sdk';
import Text from '../../components/Text';
import Song from '../../components/Song';
import {commonStyles as globalStyles} from '../../styles';

export default class Library extends React.Component {
  state = {
    recentlyPlayed: null,
  };

  routeSubscription = null;

  componentDidMount() {
    // create route subscription to know when to re-fetch data because the component is mounted even if it is
    // not in the view, so react-navigation provides events
    this.routeSubscription = this.props.navigation.addListener(
      'willFocus',
      this.fetchData,
    );
  }

  componentWillUnmount() {
    this.routeSubscription.remove();
  }

  fetchData = async () => {
    if (this.state.recentlyPlayed) {
      return;
    }
    Spotify.sendRequest('v1/me/player/recently-played', 'GET', {}, false)
      .then(async (res) => {
        const recentlyPlayed = await Promise.all(
          res.items.map(async (item) => {
            try {
              // the spotify api returns the string 'null' for recently-played tracks with no context
              if (item.context && item.context !== 'null') {
                if (item.context.type === 'artist') {
                  const artist = await Spotify.sendRequest(
                    item.context.href.substring(24),
                    'GET',
                    {},
                    false,
                  );
                  return {
                    track: item.track,
                    artist,
                  };
                }
                if (item.context.type === 'playlist_v2') {
                  const playlist = await Spotify.sendRequest(
                    item.context.href.substring(24),
                    'GET',
                    {},
                    false,
                  );
                  return {
                    track: item.track,
                    playlist,
                  };
                }
              } else {
                return item;
              }
            } catch (e) {
              console.log(e);
            }
          }),
        );
        console.log('Recenly', recentlyPlayed);
        this.setState({recentlyPlayed});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getSongProps = (item) => {
    const props = {};
    if ('artist' in item) {
      props.text = item.artist.name;
      props.secondaryText = 'Artist';
      props.artist = true;
      props.image =
        item.artist.images && item.artist.images.length > 0
          ? item.artist.images[0].url
          : null;
      props.onPress = () =>
        this.props.navigation.navigate('ArtistView', {
          artistId: item.artist.id,
        });
    } else if ('playlist' in item) {
      props.text = item.playlist.name;
      props.secondaryText = 'Playlist';
      props.artist = false;
      props.image =
        item.playlist.images && item.playlist.images.length > 0
          ? item.playlist.images[0].url
          : null;
      props.onPress = () =>
        this.props.navigation.navigate('PlaylistView', {
          playlistId: item.playlist.id,
        });
    } else {
      props.text = item.track.album.name;
      props.secondaryText = `Album ● by ${item.track.artists
        .map((artist) => artist.name)
        .join(', ')}`;
      props.artist = false;
      props.image =
        item.track.album.images && item.track.album.images.length > 0
          ? item.track.album.images[0].url
          : null;
      props.onPress = () =>
        this.props.navigation.navigate('AlbumView', {
          albumId: item.track.album.id,
        });
    }

    return props;
  };

  render() {
    return (
      <View style={globalStyles.container}>
        <ScrollView>
          <Text bold size={34} style={{textAlign: 'center'}}>
            Library
          </Text>
          <>
            <View style={styles.item}>
              <TouchableOpacity
                style={{flex: 10}}
                onPress={() =>
                  this.props.navigation.navigate('PaginationView', {
                    next: 'https://api.spotify.com/v1/me/playlists',
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="ios-musical-notes"
                    size={30}
                    color="#fff"
                    style={styles.icon}
                  />
                  <Text numberOfLines={1} style={{flex: 10}}>
                    Playlists
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.item}>
              <TouchableOpacity
                style={{flex: 10}}
                onPress={() =>
                  this.props.navigation.navigate('PaginationView', {
                    next: 'https://api.spotify.com/v1/me/tracks',
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="ios-musical-note"
                    size={30}
                    color="#fff"
                    style={styles.icon}
                  />
                  <Text numberOfLines={1} style={{flex: 10}}>
                    Songs
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.item}>
              <TouchableOpacity
                style={{flex: 10}}
                onPress={() =>
                  this.props.navigation.navigate('PaginationView', {
                    next: 'https://api.spotify.com/v1/me/albums',
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="ios-albums"
                    size={25}
                    color="#fff"
                    style={styles.icon}
                  />
                  <Text numberOfLines={1} style={{flex: 10}}>
                    Albums
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.item}>
              <TouchableOpacity
                style={{flex: 10}}
                onPress={() =>
                  this.props.navigation.navigate('PaginationView', {
                    next: 'https://api.spotify.com/v1/me/following?type=artist',
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="ios-person"
                    size={25}
                    color="#fff"
                    style={styles.icon}
                  />
                  <Text numberOfLines={1} style={{flex: 10}}>
                    Artists
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
          {this.state.recentlyPlayed ? (
            <View>
              <Text size={28} bold style={{textAlign: 'center'}}>
                Recently Played
              </Text>
              <FlatList
                scrollEnabled={false}
                data={this.state.recentlyPlayed}
                contentContainerStyle={{
                  flex: 1,
                }}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({item}) => {
                  console.log('ITEMTOMEOTME', item);
                  return item ? (
                    <Song song={item.track} {...this.getSongProps(item)} />
                  ) : null;
                }}
              />
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 10,
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 10,
    flex: 1,
    textAlign: 'center',
  },
});
