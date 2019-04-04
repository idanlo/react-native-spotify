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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../../UI/styles';
import { Text } from '../../UI';
import PlayerBase from './PlayerBase';

const { width, height } = Dimensions.get('window');

export default class PlayerView extends PlayerBase {
    seek = async val => {
        await Spotify.seek(val);
        this.stateChangedHandler();
    };
    render() {
        return this.state.currentTrack && this.state.state ? (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#3A5B5F', '#191414']}
                style={globalStyles.container}
            >
                <View>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={{ width: 40, alignItems: 'flex-start' }}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Icon
                                name="ios-arrow-down"
                                size={30}
                                color="#fff"
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text
                                numberOfLines={1}
                                bold
                                style={{ textAlign: 'center' }}
                            >
                                {this.state.currentTrack.albumName}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{ width: 40, alignItems: 'flex-end' }}
                        >
                            <Icon name="ios-list" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        {this.state.prevTrack ? (
                            <Image
                                source={{
                                    uri: `https:${this.state.prevTrack.albumCoverArtURL.substring(
                                        7
                                    )}`
                                }}
                                style={{
                                    position: 'absolute',
                                    left: -250,
                                    top: 10,
                                    opacity: 0.7,
                                    width: 280,
                                    height: 280
                                }}
                            />
                        ) : null}

                        <Image
                            source={{
                                uri: `https:${this.state.currentTrack.albumCoverArtURL.substring(
                                    7
                                )}`
                            }}
                            style={styles.albumImage}
                        />

                        {this.state.nextTrack ? (
                            <Image
                                source={{
                                    uri: `https:${this.state.nextTrack.albumCoverArtURL.substring(
                                        7
                                    )}`
                                }}
                                style={{
                                    position: 'absolute',
                                    right: -250,
                                    top: 10,
                                    opacity: 0.7,
                                    width: 280,
                                    height: 280
                                }}
                            />
                        ) : null}
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
                                minimumTrackTintColor="#fff"
                                maximumTrackTintColor="grey"
                                thumbTintColor="#fff"
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
                                    color={
                                        this.state.prevTrack ? '#fff' : 'grey'
                                    }
                                    size={40}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.playPauseHandler}
                                style={styles.btn}
                            >
                                {this.state.state.playing ? (
                                    <Icon
                                        name="ios-pause"
                                        size={55}
                                        color="#fff"
                                    />
                                ) : (
                                    <Icon
                                        name="ios-play"
                                        size={55}
                                        color="#fff"
                                    />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => Spotify.skipToNext()}
                                disabled={!this.state.nextTrack}
                                style={styles.btn}
                            >
                                <Icon
                                    name="ios-skip-forward"
                                    color={
                                        this.state.nextTrack ? '#fff' : 'grey'
                                    }
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
            </LinearGradient>
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
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'stretch',
        flexDirection: 'row',
        marginHorizontal: 25,
        height: 55
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
