import React from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Spotify from 'rn-spotify-sdk/src/Spotify';
import Text from '../../components/Text';
import { InitPlayer } from './PlayerState';

class Player extends React.Component {
    componentDidMount() {
        if (!this.props.initialized) {
            this.props.initPlayer();
        }
    }

    playPauseHandler = () => {
        Spotify.setPlaying(!this.props.state.playing);
    };

    render() {
        if (this.props.currentTrack) {
            console.log(
                this.props.timeline,
                this.props.currentTrack.duration,
                (this.props.timeline / this.props.currentTrack.duration) * 100,
            );
        }
        return this.props.initialized && this.props.currentTrack ? (
            <View style={playerStyles.player}>
                <View
                    style={{
                        width: this.props.currentTrack
                            ? `${(this.props.timeline /
                                  this.props.currentTrack.duration) *
                                  100}%`
                            : '100%',
                        height: 1,
                        backgroundColor: '#fff',
                    }}
                />
                <View style={playerStyles.nowPlaying}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
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
                            alignItems: 'center',
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() =>
                                this.props.navigation.navigate('PlayerView')
                            }
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text numberOfLines={1}>
                                    <Text bold>
                                        {this.props.currentTrack.name}
                                    </Text>
                                    <Text color="#A9A9A9">
                                        {' '}
                                        ● {this.props.currentTrack.artistName}
                                    </Text>
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity onPress={this.playPauseHandler}>
                            {this.props.state && this.props.state.playing ? (
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
        textAlign: 'center',
    },
    timeline: {
        height: 1,
        backgroundColor: '#fff',
    },
    nowPlaying: {
        height: 51,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    songName: {
        fontWeight: 'bold',
    },
});

const mapStateToProps = state => ({
    currentTrack: state.player.currentTrack,
    nextTrack: state.player.nextTrack,
    prevTrack: state.player.prevTrack,
    timeline: state.player.timeline,
    state: state.player.state,
    interval: state.player.interval,
    initialized: state.player.initialized,
});

const mapDispatchToProps = dispatch => ({
    initPlayer: () => dispatch(InitPlayer()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Player);
