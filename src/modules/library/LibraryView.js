import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from '../../components/Text';
import { commonStyles as globalStyles } from '../../styles';

export default class Library extends React.Component {
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

    fetchData = ctx => {
        console.log('TODO');
    };

    render() {
        return (
            <View style={globalStyles.container}>
                <ScrollView
                    contentContainerStyle={{
                        alignItems: 'center',
                    }}
                >
                    <Text bold size={34}>
                        Library
                    </Text>
                    <>
                        <View style={styles.item}>
                            <TouchableOpacity
                                style={{ flex: 10 }}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'PaginationView',
                                        {
                                            next:
                                                'https://api.spotify.com/v1/me/playlists',
                                        },
                                    )
                                }
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Icon
                                        name="ios-musical-notes"
                                        size={30}
                                        color="#fff"
                                        style={styles.icon}
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={{ flex: 10 }}
                                    >
                                        Playlists
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.item}>
                            <TouchableOpacity
                                style={{ flex: 10 }}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'PaginationView',
                                        {
                                            next:
                                                'https://api.spotify.com/v1/me/tracks',
                                        },
                                    )
                                }
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Icon
                                        name="ios-musical-note"
                                        size={30}
                                        color="#fff"
                                        style={styles.icon}
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={{ flex: 10 }}
                                    >
                                        Songs
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.item}>
                            <TouchableOpacity
                                style={{ flex: 10 }}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'PaginationView',
                                        {
                                            next:
                                                'https://api.spotify.com/v1/me/albums',
                                        },
                                    )
                                }
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Icon
                                        name="ios-albums"
                                        size={25}
                                        color="#fff"
                                        style={styles.icon}
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={{ flex: 10 }}
                                    >
                                        Albums
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.item}>
                            <TouchableOpacity
                                style={{ flex: 10 }}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'PaginationView',
                                        {
                                            next:
                                                'https://api.spotify.com/v1/me/following?type=artist',
                                        },
                                    )
                                }
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Icon
                                        name="ios-person"
                                        size={25}
                                        color="#fff"
                                        style={styles.icon}
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={{ flex: 10 }}
                                    >
                                        Artists
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
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
