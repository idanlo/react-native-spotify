import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import Spotify from 'rn-spotify-sdk';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from '../../components/Text';
import {commonStyles as globalStyles, colors} from '../../styles';
import Song from '../../components/Song';

class AlbumView extends React.Component {
  state = {
    data: null,
    loading: true,
  };

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
    let albumId;
    // sometimes react-navigation gives a 'context' object which contains the route params
    if (ctx) {
      // eslint-disable-next-line prefer-destructuring
      albumId = ctx.state.params.albumId;
    } else {
      albumId = this.props.navigation.getParam('albumId');
    }
    // if all data has been loaded and the previous album id is the same as the current one -
    // there is no need to fetch the data again, display the old data
    if (this.state.data && this.state.data.id === albumId) {
      this.setState({loading: false});
      return;
    }

    // fetch album
    Spotify.getAlbum(albumId)
      .then((res) => {
        console.log(res);
        this.setState({data: res, loading: false});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <View
        style={[
          globalStyles.container,
          {paddingTop: StatusBar.currentHeight + 50},
        ]}>
        {this.state.data && !this.state.loading ? (
          <View>
            <View style={styles.header}>
              <TouchableOpacity
                style={{width: '50%'}}
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="ios-arrow-back" size={30} color="#fff" />
              </TouchableOpacity>
              <View
                style={{
                  width: '50%',
                }}>
                <TouchableOpacity
                  style={{paddingLeft: '95%'}}
                  onPress={() => {
                    this.props.showModal(
                      {
                        image: this.state.data.images[1].url,
                        primaryText: this.state.data.name,
                        secondaryText: this.state.data.artists
                          .map((artist) => artist.name)
                          .join(', '),
                      },

                      [
                        {
                          text: 'Add To Queue',
                          click: () => Spotify.queueURI(this.state.data.uri),
                        },
                        {
                          text: 'View Artist',
                          click: () =>
                            this.props.navigation.navigate('ArtistView', {
                              artistId: this.state.data.artists[0].id,
                            }),
                        },
                      ],
                    );
                  }}>
                  <Icon name="ios-ellipsis-horizontal" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView overScrollMode="never">
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
                      uri: this.state.data.images[1].url,
                    }}
                    style={{
                      width: 150,
                      height: 150,
                    }}
                  />
                  <Text
                    bold
                    size={24}
                    style={{
                      textAlign: 'center',
                    }}>
                    {this.state.data.name}
                  </Text>
                  <Text
                    size={14}
                    style={{
                      textAlign: 'center',
                    }}
                    color="grey">
                    Album by{' '}
                    {this.state.data.artists
                      .map((artist) => artist.name)
                      .join(', ')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Spotify.playURI(this.state.data.uri, 0, 0)}>
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
                        bold
                        size={28}
                        style={{
                          textAlign: 'center',
                        }}>
                        Play
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <FlatList
                  contentContainerStyle={{
                    zIndex: 1000,
                    flex: 1,
                    marginHorizontal: 10,
                  }}
                  scrollEnabled={false}
                  data={this.state.data.tracks.items}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({item, index}) => (
                    <Song
                      onPress={() =>
                        Spotify.playURI(this.state.data.uri, index, 0)
                      }
                      color={
                        this.props.currentTrack &&
                        this.props.currentTrack.uri === item.uri &&
                        this.props.currentTrack.contextUri ===
                          this.state.data.uri
                          ? colors.primaryLight
                          : null
                      }
                      song={item}
                      artists={this.state.data.artists}
                      onOpenModal={() => {
                        this.props.showModal(
                          {
                            image: this.state.data.images[1].url,
                            primaryText: this.state.data.name,
                            secondaryText: item.name,
                          },

                          [
                            {
                              text: 'Add To Queue',
                              click: () => Spotify.queueURI(item.uri),
                            },
                            {
                              text: 'View Artist',
                              click: () =>
                                this.props.navigation.navigate('ArtistView', {
                                  artistId: item.artists[0].id,
                                }),
                            },
                          ],
                        );
                      }}
                    />
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
});

export default AlbumView;
