import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Spotify from 'rn-spotify-sdk';
import Text from '../../components/Text';
import SearchResults from './SearchResults';
// import { commonStyles as globalStyles } from '../../styles';

const { width } = Dimensions.get('screen');

class Search extends React.Component {
    state = {
        genres: null,
    };

    routeSubscription = null;

    componentDidMount() {
        // fetch 10 categories from spotify API
        Spotify.sendRequest('v1/browse/categories', 'GET', { limit: 16 }, false)
            .then(res => {
                // extract categories object from 'res' (object destructuring)
                const { categories } = res;
                this.setState({ genres: categories });
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentWillUnmount() {
        this.routeSubscription.remove();
    }

    render() {
        console.log(this.state);
        return (
            <View style={{ backgroundColor: '#191414' }}>
                <ScrollView>
                    <LinearGradient
                        colors={['#fff', '#191414']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 3, y: 3 }}
                        locations={[0, 0.1]}
                    >
                        <View style={{ marginTop: 50 }}>
                            <Text bold size={34} style={styles.header}>
                                Search
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'SearchResults',
                                    )
                                }
                                style={{
                                    width: '75%',
                                    height: 40,
                                    alignSelf: 'center',
                                    backgroundColor: '#F7F7F7',
                                    textAlign: 'center',
                                    borderRadius: 7,
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: 'center',
                                        height: 40,
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text bold color="#363636">
                                        Artists, song or playlists
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 30 }}>
                            <Text
                                bold
                                size={20}
                                style={{ marginBottom: 15, marginLeft: 15 }}
                            >
                                Your top genres
                            </Text>
                            {this.state.genres ? (
                                <FlatList
                                    data={this.state.genres.items}
                                    numColumns={2}
                                    scrollEnabled={false}
                                    keyExtractor={(_, i) => i.toString()}
                                    contentContainerStyle={{
                                        marginHorizontal: 10,
                                    }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.props.navigation.navigate(
                                                    'PaginationView',
                                                    {
                                                        next: `${
                                                            item.href
                                                        }/playlists`,
                                                    },
                                                )
                                            }
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                paddingBottom: 20,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: width / 2 - 30,
                                                    height:
                                                        (width / 2 - 30) / 2,
                                                    borderRadius: 6,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Image
                                                    source={{
                                                        uri: item.icons[0].url,
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        position: 'absolute',
                                                        resizeMode: 'cover',
                                                    }}
                                                />
                                                <Text
                                                    bold
                                                    size={16}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 3,
                                                        left: 15,
                                                    }}
                                                >
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            ) : (
                                <FlatList
                                    data={Array(16).fill(0)}
                                    numColumns={2}
                                    scrollEnabled={false}
                                    keyExtractor={(_, i) => i.toString()}
                                    contentContainerStyle={{
                                        marginHorizontal: 10,
                                    }}
                                    renderItem={() => (
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                paddingBottom: 20,
                                                position: 'relative',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: width / 2 - 30,
                                                    height:
                                                        (width / 2 - 30) / 2,
                                                    backgroundColor: 'black',
                                                    borderRadius: 6,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <ActivityIndicator
                                                    color="#1DB954"
                                                    size={20}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                        </View>
                    </LinearGradient>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        textAlign: 'center',
        marginBottom: 10,
    },
});

const stackNavigator = createStackNavigator(
    {
        Search: {
            screen: Search,
        },
        SearchResults: {
            screen: SearchResults,
        },
    },
    {
        initialRouteName: 'Search',
        headerMode: 'none',
    },
);

export default createAppContainer(stackNavigator);
