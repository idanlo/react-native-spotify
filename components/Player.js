import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function Player() {
    const [timeline, setTimeline] = React.useState(75);
    return (
        <View style={playerStyles.player}>
            <View
                style={{
                    width: `${timeline}%`,
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
                    <Text style={playerStyles.songName}>Song Name</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center'
                    }}
                >
                    <Icon name="ios-pause" size={30} color="#fff" />
                </View>
            </View>
        </View>
    );
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
