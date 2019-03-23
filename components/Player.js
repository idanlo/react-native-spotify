import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../UI';
import Spotify from 'rn-spotify-sdk';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native-gesture-handler';

class Player extends React.Component {
    state = {
        timeline: 0,
        currentTrack: null,
        nextTrack: null,
        prevTrack: null,
        state: null
    };
    interval = null;
    componentDidMount() {
        this.mount();
    }

    mount = async () => {
        console.log(Spotify);
        Spotify.addListener('play', this.stateChangedHandler);
        Spotify.addListener('pause', this.stateChangedHandler);
        Spotify.addListener('metadataChange', this.stateChangedHandler);
        Spotify.addListener('trackChange', this.trackChange);
        const initialData = await Spotify.getPlaybackMetadataAsync();
        if (initialData) {
            this.setState({
                currentTrack: initialData.currentTrack,
                prevTrack: initialData.prevTrack,
                nextTrack: initialData.nextTrack
            });
            this.stateChangedHandler();
        }
        // Spotify.playURI('spotify:track:3n69hLUdIsSa1WlRmjMZlW', 0, 0)
        //     .then(res => {
        //         console.warn(res);
        //     })
        //     .catch(err => {
        //         console.warn(err);
        //     });
    };

    stateChangedHandler = async () => {
        let state = await Spotify.getPlaybackStateAsync();
        this.setState({
            state,
            timeline: state.position
        });
        if (state.playing && !this.interval) {
            this.setTimelineInterval();
        } else if (!state.playing && this.interval) {
            clearInterval(this.interval);
            this.interval = false;
        }
    };

    trackChange = async () => {
        let tracks = await Spotify.getPlaybackMetadataAsync();
        let state = await Spotify.getPlaybackStateAsync();

        console.log('STATE', state);
        console.log('track change', tracks);
        this.setState({
            currentTrack: tracks.currentTrack,
            prevTrack: tracks.prevTrack,
            nextTrack: tracks.nextTrack,
            state,
            timeline: state.position
        });
        if (state.playing && !this.interval) {
            this.setTimelineInterval();
        }
    };

    setTimelineInterval = () => {
        this.interval = setInterval(() => {
            this.setState(prevState => {
                return {
                    timeline: prevState.timeline + 1
                };
            });
        }, 1000);
    };

    componentWillUnmount() {
        clearInterval(this.interval);
        Spotify.removeListener('play', this.stateChangedHandler);
        Spotify.removeListener('pause', this.stateChangedHandler);
        Spotify.removeListener('metadataChange', this.stateChangedHandler);
        Spotify.removeListener('trackChange', this.trackChange);
    }

    playPauseHandler = () => {
        console.log('PRESSED');
        console.log(this.state.state.playing);
        Spotify.setPlaying(!this.state.state.playing)
            .then(res => {
                console.log('done', res);
            })
            .catch(err => {
                console.log('eerr', err);
            });
    };

    render() {
        return this.state.currentTrack ? (
            <View style={playerStyles.player}>
                <View
                    style={{
                        width: this.state.currentTrack
                            ? `${(this.state.timeline /
                                  this.state.currentTrack.duration) *
                                  100}%`
                            : '100%',
                        height: 1,
                        backgroundColor: '#fff'
                    }}
                />
                <View style={playerStyles.nowPlaying}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.navigate('PlayerView')
                            }
                        >
                            <Icon name="ios-arrow-up" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 5,
                            alignItems: 'center'
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() =>
                                this.props.navigation.navigate('PlayerView')
                            }
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={playerStyles.songName}>
                                    {this.state.currentTrack.name}
                                </Text>
                                <Text style={{ color: '#A9A9A9' }}>
                                    {' '}
                                    ● {this.state.currentTrack.artistName}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity onPress={this.playPauseHandler}>
                            {this.state.state && this.state.state.playing ? (
                                <Icon name="ios-pause" size={30} color="#fff" />
                            ) : (
                                <Icon name="ios-play" size={30} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ) : null;
    }
}

const playerStyles = StyleSheet.create({
    player: {
        height: 52,
        width: '100%',
        backgroundColor: '#212025',
        borderBottomColor: '#191414',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    timeline: {
        height: 1,
        backgroundColor: '#fff'
    },
    nowPlaying: {
        height: 51,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    songName: {
        fontWeight: 'bold'
    }
});

export default Player;
