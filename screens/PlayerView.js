import React from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Slider
} from 'react-native';
import Spotify from 'rn-spotify-sdk/src/Spotify';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../styles';
import { Text } from '../UI';
import PlayerBase from '../components/PlayerBase';

const { width } = Dimensions.get('window');

export default class PlayerView extends PlayerBase {
    seek = async val => {
        await Spotify.seek(val);
        this.stateChangedHandler();
    };
    render() {
        return this.state.currentTrack && this.state.state ? (
            <View style={globalStyles.container}>
                <View style={[styles.header]}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Icon name="ios-arrow-back" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon name="md-more" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    <Image
                        source={{
                            uri: `https:${this.state.currentTrack.albumCoverArtURL.substring(
                                7
                            )}`
                        }}
                        style={styles.albumImage}
                    />
                    <View style={styles.songDetails}>
                        <Text style={[styles.txt, styles.songName]}>
                            {this.state.currentTrack.name}
                        </Text>
                        <Text style={styles.txt} color="grey">
                            {this.state.currentTrack.albumName}
                        </Text>
                    </View>
                    <View style={styles.slider}>
                        <Slider
                            maximumValue={this.state.currentTrack.duration}
                            minimumValue={0}
                            value={this.state.timeline}
                            style={{
                                width: width - 100
                            }}
                            onSlidingComplete={this.seek}
                        />
                    </View>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={() =>
                                Spotify.setShuffling(
                                    !this.state.state.shuffling
                                )
                            }
                            style={styles.sideBtn}
                        >
                            <Icon
                                name="ios-shuffle"
                                color={
                                    this.state.state.shuffling
                                        ? '#1DB954'
                                        : '#fff'
                                }
                                size={25}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => Spotify.skipToPrevious()}
                            disabled={!this.state.prevTrack}
                            style={styles.btn}
                        >
                            <Icon
                                name="ios-skip-backward"
                                color={this.state.prevTrack ? '#fff' : 'grey'}
                                size={40}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.playPauseHandler}
                            style={styles.btn}
                        >
                            {this.state.state.playing ? (
                                <Icon name="ios-pause" size={55} color="#fff" />
                            ) : (
                                <Icon name="ios-play" size={55} color="#fff" />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => Spotify.skipToNext()}
                            disabled={!this.state.nextTrack}
                            style={styles.btn}
                        >
                            <Icon
                                name="ios-skip-forward"
                                color={this.state.nextTrack ? '#fff' : 'grey'}
                                size={40}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                Spotify.setRepeating(
                                    !this.state.state.repeating
                                )
                            }
                            style={styles.sideBtn}
                        >
                            <Icon
                                name="ios-repeat"
                                color={
                                    this.state.state.repeating
                                        ? '#1DB954'
                                        : '#fff'
                                }
                                size={25}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ) : (
            <View
                style={[
                    globalStyles.container,
                    {
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                ]}
            >
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#191414',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: 25,
        height: 35
    },
    body: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    albumImage: {
        width: 300,
        height: 300,
        marginBottom: 40
    },
    songDetails: {
        marginBottom: 40
    },
    txt: {
        textAlign: 'center'
    },
    songName: {
        fontSize: 34
    },
    slider: {
        marginBottom: 40
    },
    buttons: {
        flexDirection: 'row',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        width: width - 100
    },
    btn: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sideBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
