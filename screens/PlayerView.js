import React from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    StyleSheet,
    Dimensions
} from 'react-native';
import { TouchableOpacity, Slider } from 'react-native-gesture-handler';
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
        return this.state.currentTrack ? (
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
                        style={{ width: 300, height: 300 }}
                    />
                    <View>
                        <Text style={[styles.txt, styles.songName]}>
                            {this.state.currentTrack.name}
                        </Text>
                        <Text style={styles.txt} color="grey">
                            {this.state.currentTrack.albumName}
                        </Text>
                    </View>
                    <View>
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
                            onPress={() => Spotify.skipToPrevious()}
                        >
                            <Icon
                                name="ios-skip-backward"
                                color="#fff"
                                size={40}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.playPauseHandler}>
                            {this.state.state && this.state.state.playing ? (
                                <Icon name="ios-pause" size={55} color="#fff" />
                            ) : (
                                <Icon name="ios-play" size={55} color="#fff" />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Spotify.skipToNext()}>
                            <Icon
                                name="ios-skip-forward"
                                color="#fff"
                                size={40}
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
    txt: {
        textAlign: 'center'
    },
    songName: {
        fontSize: 34
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: width - 100
    }
});
