import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Spotify from 'rn-spotify-sdk';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
        // Spotify.playURI('spotify:track:3n69hLUdIsSa1WlRmjMZlW', 0, 0);
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
        Spotify.removeListener('play');
        Spotify.removeListener('pause');
        Spotify.removeListener('metadataChange');
        Spotify.removeListener('trackChange');
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
        return (
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
                        <Icon name="ios-arrow-up" size={30} color="#fff" />
                    </View>
                    <View
                        style={{
                            flex: 5,
                            alignItems: 'center'
                        }}
                    >
                        <Text style={playerStyles.songName}>
                            {this.state.currentTrack
                                ? this.state.currentTrack.name +
                                  ' - ' +
                                  this.state.currentTrack.artistName
                                : null}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center'
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={this.playPauseHandler}
                        >
                            {this.state.state && this.state.state.playing ? (
                                <Icon name="ios-pause" size={30} color="#fff" />
                            ) : (
                                <Icon name="ios-play" size={30} color="#fff" />
                            )}
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
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
        color: '#fff'
    }
});

export default Player;
