import React from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Slider,
} from 'react-native';
import Spotify from 'rn-spotify-sdk/src/Spotify';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { commonStyles as globalStyles } from '../../styles';
import Text from '../../components/Text';

const { width } = Dimensions.get('window');

export default class PlayerView extends React.Component {
    seek = val => {
        // seek the song
        Spotify.seek(val);
        // seek the redux store (the spotify seek event only happens when the music context changes)
        this.props.seek(val);
    };

    playPauseHandler = () => {
        Spotify.setPlaying(!this.props.state.playing);
    };

    render() {
        return this.props.currentTrack && this.props.state ? (
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
                                {this.props.currentTrack.albumName}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{ width: 40, alignItems: 'flex-end' }}
                        >
                            <Icon name="ios-list" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        {this.props.prevTrack ? (
                            <Image
                                source={{
                                    uri: `https:${this.props.prevTrack.albumCoverArtURL.substring(
                                        7,
                                    )}`,
                                }}
                                style={{
                                    position: 'absolute',
                                    left: -250,
                                    top: 10,
                                    opacity: 0.7,
                                    width: 280,
                                    height: 280,
                                }}
                            />
                        ) : null}
                        {/* FIXME: view needs backgroundColor to display shadow */}
                        <View
                            style={[
                                styles.albumImage,
                                {
                                    backgroundColor: 'green',
                                    outlineProvider: 'bounds',
                                    elevation: 20,
                                },
                            ]}
                        >
                            <Image
                                source={{
                                    uri: `https:${this.props.currentTrack.albumCoverArtURL.substring(
                                        7,
                                    )}`,
                                }}
                                style={styles.albumImage}
                            />
                        </View>

                        {this.props.nextTrack ? (
                            <Image
                                source={{
                                    uri: `https:${this.props.nextTrack.albumCoverArtURL.substring(
                                        7,
                                    )}`,
                                }}
                                style={{
                                    position: 'absolute',
                                    right: -250,
                                    top: 10,
                                    opacity: 0.7,
                                    width: 280,
                                    height: 280,
                                }}
                            />
                        ) : null}
                        <View style={styles.songDetails}>
                            <View style={{ width: '80%' }}>
                                <Text
                                    bold
                                    size={24}
                                    numberOfLines={1}
                                    style={{ textAlign: 'left', width: '100%' }}
                                >
                                    {this.props.currentTrack.name}
                                </Text>
                                <Text
                                    size={18}
                                    color="grey"
                                    numberOfLines={1}
                                    style={{ textAlign: 'left', width: '100%' }}
                                >
                                    {this.props.currentTrack.artistName}
                                </Text>
                            </View>
                            <View
                                style={{
                                    width: '20%',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                }}
                            >
                                <TouchableOpacity>
                                    <Icon
                                        name="ios-heart"
                                        color="#1DB954"
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.slider}>
                            <Slider
                                maximumValue={this.props.currentTrack.duration}
                                minimumValue={0}
                                minimumTrackTintColor="#fff"
                                maximumTrackTintColor="grey"
                                thumbTintColor="#fff"
                                value={this.props.timeline}
                                style={{
                                    width: '100%',
                                }}
                                onSlidingComplete={this.seek}
                            />
                        </View>
                        <View style={styles.buttons}>
                            <TouchableOpacity
                                onPress={() =>
                                    Spotify.setShuffling(
                                        !this.props.state.shuffling,
                                    )
                                }
                                style={styles.sideBtn}
                            >
                                <Icon
                                    name="ios-shuffle"
                                    color={
                                        this.props.state.shuffling
                                            ? '#1DB954'
                                            : '#fff'
                                    }
                                    size={25}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Spotify.skipToPrevious()}
                                disabled={!this.props.prevTrack}
                                style={styles.btn}
                            >
                                <Icon
                                    name="ios-skip-backward"
                                    color={
                                        this.props.prevTrack ? '#fff' : 'grey'
                                    }
                                    size={40}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.playPauseHandler}
                                style={styles.btn}
                            >
                                {this.props.state.playing ? (
                                    <Icon
                                        name="ios-pause"
                                        size={70}
                                        color="#fff"
                                    />
                                ) : (
                                    <Icon
                                        name="ios-play"
                                        size={70}
                                        color="#fff"
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Spotify.skipToNext()}
                                disabled={!this.props.nextTrack}
                                style={styles.btn}
                            >
                                <Icon
                                    name="ios-skip-forward"
                                    color={
                                        this.props.nextTrack ? '#fff' : 'grey'
                                    }
                                    size={40}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    Spotify.setRepeating(
                                        !this.props.state.repeating,
                                    )
                                }
                                style={styles.sideBtn}
                            >
                                <Icon
                                    name="ios-repeat"
                                    color={
                                        this.props.state.repeating
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
                        alignItems: 'center',
                    },
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
        height: 45,
        marginBottom: 50,
    },
    body: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    albumImage: {
        width: 300,
        height: 300,
        marginBottom: 75,
    },
    songDetails: {
        width: width - 55,
        flexDirection: 'row',
        marginBottom: 10,
    },
    txt: {
        textAlign: 'center',
    },
    songName: {
        fontSize: 34,
    },
    slider: {
        width: width - 30,
        marginBottom: 40,
    },
    buttons: {
        flexDirection: 'row',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        width: width - 100,
    },
    btn: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sideBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});