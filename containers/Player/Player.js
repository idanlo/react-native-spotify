import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import { Text } from '../../UI';
import Icon from 'react-native-vector-icons/Ionicons';
import PlayerBase from './PlayerBase';

class Player extends PlayerBase {
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
                                <Text color="#A9A9A9">
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
