import React from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Spotify from 'rn-spotify-sdk/src/Spotify';
import Carousel from '../carousel/Carousel';
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

    renderItem = ({ item }) =>
        item ? (
            <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('PlayerView')}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        height: 52,
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Text numberOfLines={1} style={{ textAlign: 'center' }}>
                        <Text bold>{item.name}</Text>
                        <Text color="#A9A9A9"> ● {item.artistName}</Text>
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        ) : null;

    render() {
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
                        <Carousel
                            width={Dimensions.get('screen').width * 0.7}
                            height={52}
                            onPress={() =>
                                this.props.navigation.navigate('PlayerView')
                            }
                            navigation={this.props.navigation}
                            renderItem={this.renderItem}
                            includeTouchables
                        />
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
