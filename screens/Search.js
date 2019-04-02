import React from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    ScrollView,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    TextInput
} from 'react-native';
import { Text } from '../UI';
import Spotify from 'rn-spotify-sdk';
import { colorsFromUrl } from 'react-native-vibrant-color';
import LinearGradient from 'react-native-linear-gradient';
import globalStyles from '../styles';

const { width } = Dimensions.get('screen');

export default class Search extends React.Component {
    state = {
        genres: null
    };

    componentDidMount() {
        // fetch 10 categories from spotify API
        Spotify.sendRequest('v1/browse/categories', 'GET', { limit: 16 }, false)
            .then(async res => {
                // extract categories object from 'res' (object destructuring)
                const { categories } = res;
                // using `await Promise.all()` to wait for all promises inside `Array.map()` to resolve (get dominant colors)
                categories.items = await Promise.all(
                    categories.items.map(async category => {
                        // re-create the category object, now with a `color` key
                        const newCategory = { ...category };
                        // get dominant colors from `react-native-dominant-color`
                        // for some reason using 'await' alone does not work, the function doesn't return a value when using await
                        await colorsFromUrl(category.icons[0].url)
                            .then(colors => {
                                // check if dominant/vibrant color exists
                                if (colors) {
                                    if (colors.vibrantColor !== '#CCCCCC') {
                                        newCategory.color = colors.vibrantColor;
                                    } else if (
                                        colors.dominantColor !== '#CCCCCC'
                                    ) {
                                        newCategory.color =
                                            colors.dominantColor;
                                    } else {
                                        newCategory.color = '#CCCCCC';
                                    }
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });

                        // return the "new" category object with the `color` key
                        return { ...newCategory };
                    })
                );
                this.setState({ genres: categories });
            })
            .catch(err => {
                console.log(err);
            });
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
                        <StatusBar
                            translucent={true}
                            backgroundColor={'transparent'}
                        />
                        <View style={{ marginTop: 50 }}>
                            <Text bold size={34} style={styles.header}>
                                Search
                            </Text>
                            <TextInput
                                onEndEditing={e =>
                                    console.log(e.nativeEvent.text)
                                }
                                placeholder="Artists, song or playlists"
                                placeholderTextColor="#363636"
                                style={{
                                    width: '75%',
                                    alignSelf: 'center',
                                    backgroundColor: '#F7F7F7',
                                    textAlign: 'center',
                                    borderRadius: 7
                                }}
                            />
                        </View>
                        <View style={{ marginTop: 30 }}>
                            <Text
                                bold
                                size={20}
                                style={{ marginBottom: 15, marginLeft: 10 }}
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
                                        marginHorizontal: 10
                                    }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                paddingBottom: 20,
                                                position: 'relative'
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: width / 2 - 30,
                                                    height:
                                                        (width / 2 - 30) / 2,
                                                    backgroundColor: item.color,
                                                    borderRadius: 6,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <Image
                                                    source={{
                                                        uri: item.icons[0].url
                                                    }}
                                                    style={{
                                                        width: 65,
                                                        height: 65,
                                                        position: 'absolute',
                                                        top:
                                                            (width / 2 - 30) /
                                                                4 -
                                                            25,
                                                        right: -15,
                                                        resizeMode: 'cover',
                                                        transform: [
                                                            { rotateZ: '40deg' }
                                                        ]
                                                    }}
                                                />
                                                <Text
                                                    bold
                                                    size={16}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 12,
                                                        left: 15
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
                                        marginHorizontal: 10
                                    }}
                                    renderItem={() => (
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                paddingBottom: 20,
                                                position: 'relative'
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
                                                    alignItems: 'center'
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
        marginBottom: 10
    }
});
