import React from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Spotify from 'rn-spotify-sdk';
import {commonStyles as globalStyles, colors} from '../../styles';
import Text from '../../components/Text';
import Album from '../album/Album';
import Song from '../../components/Song';

const {width} = Dimensions.get('window');

class ArtistView extends React.Component {
  state = {
    artist: null,
    artistTopTracks: null,
    artistAlbums: null,
    artistRelated: null,
    loading: true,
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
    // cancel route subscription when the component unmounts (if the subscription exists)
    if (this.routeSubscription) {
      this.routeSubscription.remove();
    }
  }

  fetchData = (ctx) => {
    this.setState({loading: true});
    let artistId;
    // sometimes react-navigation gives a 'context' object which contains the route params
    if (ctx) {
      // eslint-disable-next-line prefer-destructuring
      artistId = ctx.state.params.artistId;
    } else {
      artistId = this.props.navigation.getParam('artistId');
    }

    // if all data has been loaded and the previous artist id is the same as the current one -
    // there is no need to fetch the data again, display the old data
    if (
      this.state.artist &&
      this.state.artistTopTracks &&
      this.state.artistAlbums &&
      this.state.artistRelated &&
      this.state.artist.id === artistId
    ) {
      this.setState({loading: false});
      return;
    }

    // fetch artist
    Spotify.getArtist(artistId)
      .then((res) => {
        this.setState({artist: res, loading: false});
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // fetch artist top tracks
    Spotify.getArtistTopTracks(artistId, 'from_token')
      .then((res) => {
        this.setState({artistTopTracks: res.tracks, loading: false});
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // fetch artist albums
    Spotify.getArtistAlbums(artistId, {limit: 4})
      .then((res) => {
        this.setState({artistAlbums: res, loading: false});
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // fetch artist related artists
    Spotify.getArtistRelatedArtists(artistId, {limit: 10})
      .then((res) => {
        this.setState({artistRelated: res.artists, loading: false});
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <View style={globalStyles.container}>
        {this.state.artist &&
        this.state.artistTopTracks &&
        this.state.artistAlbums &&
        this.state.artistRelated &&
        !this.state.loading ? (
          <View>
            <View style={styles.header}>
              <TouchableOpacity
                style={{width: '50%'}}
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="ios-arrow-back" size={30} color="#fff" />
              </TouchableOpacity>
              <View style={{width: '50%'}}>
                <TouchableOpacity
                  style={{paddingLeft: '95%'}}
                  onPress={() => {
                    this.props.showModal(
                      {
                        image: this.state.artist.images[1].url,
                        primaryText: this.state.artist.name,
                        type: 'artist',
                      },
                      [
                        {
                          text: 'Add To Queue',
                          click: () => Spotify.queueURI(this.state.artist.uri),
                        },
                        {
                          text: 'Follow',
                          click: () =>
                            Spotify.sendRequest(
                              `v1/me/following?type=artist&ids=${this.state.artist.id}`,
                              'PUT',
                              {},
                              false,
                            ),
                        },
                      ],
                    );
                  }}>
                  <Icon name="ios-ellipsis-horizontal" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView>
              <View
                style={[
                  globalStyles.container,
                  {
                    paddingTop: 0,
                    paddingBottom: StatusBar.currentHeight + 35,
                  },
                ]}>
                <View style={{alignItems: 'center'}}>
                  <Image
                    source={{
                      uri: this.state.artist.images[1].url,
                    }}
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 75,
                    }}
                  />
                  <Text
                    bold
                    size={24}
                    style={{
                      textAlign: 'center',
                    }}>
                    {this.state.artist.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Spotify.playURI(this.state.artist.uri, 0, 0)
                    }>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 150,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: '#1DB954',
                        marginTop: 10,
                        marginBottom: 10,
                      }}>
                      <Text
                        size={28}
                        bold
                        style={{
                          textAlign: 'center',
                        }}>
                        Play
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <Text bold size={18} style={{textAlign: 'center'}}>
                  Popular
                </Text>
                {/* Popular songs list (top 5). this is not in the topTracks View because it
                                    then makes the Song component not full width for some reason */}
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                  }}>
                  <FlatList
                    scrollEnabled={false}
                    data={this.state.artistTopTracks.slice(0, 5)}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({item, index}) => (
                      <Song
                        onPress={() =>
                          Spotify.playURI(this.state.artist.uri, index, 0)
                        }
                        song={item}
                        artists={item.artists}
                        color={
                          this.props.currentTrack &&
                          this.props.currentTrack.uri === item.uri &&
                          this.props.currentTrack.contextUri ===
                            this.state.artist.uri
                            ? colors.primaryLight
                            : null
                        }
                        onOpenModal={() => {
                          this.props.showModal(
                            {
                              image: this.state.artist.images[1].url,
                              primaryText: this.state.artist.name,
                              secondaryText: item.name,
                              type: 'artist',
                            },

                            [
                              {
                                text: 'Add To Queue',
                                click: () => Spotify.queueURI(item.uri),
                              },
                              {
                                text: 'View Album',
                                click: () =>
                                  this.props.navigation.navigate('AlbumView', {
                                    albumId: item.album.id,
                                  }),
                              },
                            ],
                          );
                        }}
                      />
                    )}
                  />
                </View>

                <Text
                  bold
                  size={18}
                  style={{
                    textAlign: 'center',
                    marginBottom: 15,
                  }}>
                  Albums
                </Text>
                <FlatList
                  contentContainerStyle={{
                    flex: 1,
                    marginHorizontal: 10,
                  }}
                  numColumns={2}
                  scrollEnabled={false}
                  data={this.state.artistAlbums.items}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({item}) => (
                    <Album
                      onPress={() =>
                        this.props.navigation.navigate('AlbumView', {
                          albumId: item.id,
                        })
                      }
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        paddingBottom: 10,
                      }}
                      image={item.images[1].url}
                      imageStyle={{
                        height: width / 2 - 30,
                        width: width / 2 - 30,
                      }}
                      primaryText={item.name}
                      secondaryText={`${
                        item.total_tracks
                      } Songs ● ${item.release_date.substring(0, 4)}`}
                    />
                  )}
                />
                <View
                  style={{
                    flex: 1,
                    height: 50,
                    marginHorizontal: 20,
                    marginTop: 8,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('PaginationView', {
                        next: this.state.artistAlbums.href,
                      })
                    }>
                    <View>
                      <Text bold>See All Albums</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <Text
                  bold
                  size={18}
                  style={{
                    textAlign: 'center',
                    marginBottom: 15,
                  }}>
                  Related Artists
                </Text>

                <FlatList
                  contentContainerStyle={{
                    justifyContent: 'center',
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={this.state.artistRelated}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({item}) => (
                    <View
                      style={{
                        height: 180,
                        width: 170,
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          // navigate to ArtistView
                          this.props.navigation.navigate('ArtistView', {
                            artistId: item.id,
                          });
                          this.fetchData();
                        }}>
                        <View>
                          <Image
                            source={{
                              uri: item.images[1].url,
                            }}
                            style={{
                              width: 150,
                              height: 150,
                              borderRadius: 75,
                            }}
                          />
                          <Text
                            bold
                            style={{
                              textAlign: 'center',
                            }}>
                            {item.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </ScrollView>
          </View>
        ) : (
          <View
            style={[
              globalStyles.container,
              {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <ActivityIndicator size="large" color="#1DB954" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#191414',
    flexDirection: 'row',
    marginHorizontal: 25,
    marginTop: StatusBar.currentHeight,
    height: 35,
  },
  topTracks: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ArtistView;
