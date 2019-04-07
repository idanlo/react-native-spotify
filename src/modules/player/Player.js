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
import Carousel from 'react-native-snap-carousel';
import Text from '../../components/Text';
import { InitPlayer } from './PlayerState';

class Player extends React.Component {
    componentDidMount() {
        if (!this.props.initialized) {
            this.props.initPlayer();
        }
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.currentTrack &&
            prevProps.currentTrack &&
            this.props.currentTrack.uri !== prevProps.currentTrack.uri
        ) {
            this._carousel.snapToItem(1, false, false);
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
                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                    <Text numberOfLines={1}>
                        <Text bold>{item.name}</Text>
                        <Text color="#A9A9A9"> ● {item.artistName}</Text>
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        ) : null;

    itemSnapHandler = index => {
        if (index === 2) {
            Spotify.skipToNext();
        } else if (index === 0) {
            Spotify.skipToPrevious();
        }
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
                        <Carousel
                            ref={c => {
                                this._carousel = c;
                            }}
                            contentContainerCustomStyle={{
                                alignItems: 'center',
                            }}
                            data={[
                                this.props.prevTrack,
                                this.props.currentTrack,
                                this.props.nextTrack,
                            ]}
                            renderItem={this.renderItem}
                            itemWidth={Dimensions.get('screen').width * 0.7}
                            sliderWidth={Dimensions.get('screen').width * 0.7}
                            onSnapToItem={this.itemSnapHandler}
                            firstItem={1}
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
