import React from 'react';
import { connect } from 'react-redux';
import { View, PanResponder, Animated } from 'react-native';
import Spotify from 'rn-spotify-sdk';

// width - number
// renderItem - function({item})

class Carousel extends React.Component {
    static defaultProps = {
        includeTouchables: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            pan: new Animated.Value(0), // FIXME:
        };

        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (_, state) =>
                // only if touch input was dragged more than 25 it counts as a slide, below 25 is a touchable press
                // only do this calculation if there are touchables inside the panresponder (received with prop - includeTouchables)
                !this.props.includeTouchables ||
                Math.abs(state.dx) > 15 ||
                Math.abs(state.dy) > 15,
            onPanResponderMove: (evt, gestureState) => {
                // console.log('PanResponder', evt, gestureState);
                this.state.pan.setValue(gestureState.dx);
                // console.log('Moved', gestureState.dx);
            },
            onPanResponderRelease: (_, state) => {
                // the width * 0.7 is the width of the text-area in the player component.
                // so half of that is the amount to scroll in order to skip a song
                const width = this.props.width / 2;
                if (state.dx > width) {
                    // user scrolled to the right (dx is positive) -> previous track
                    Spotify.skipToPrevious();
                    console.log('previous track!');
                    Animated.timing(this.state.pan, {
                        toValue: width * 2,
                        useNativeDriver: true,
                        duration: 200,
                    }).start();
                } else if (state.dx < -width) {
                    // user scrolled to the left (dx is negative) -> next track
                    Spotify.skipToNext();
                    console.log('next track!');
                    Animated.timing(this.state.pan, {
                        toValue: -width * 2,
                        useNativeDriver: true,
                        duration: 200,
                    }).start();
                } else {
                    Animated.timing(this.state.pan, {
                        toValue: 0,
                        useNativeDriver: true,
                        duration: 200,
                    }).start();
                }
            },
        });
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.currentTrack &&
            prevProps.currentTrack &&
            this.props.currentTrack.uri !== prevProps.currentTrack.uri
        ) {
            this.state.pan.setValue(0);
        }
    }

    render() {
        return (
            <Animated.View
                style={{
                    width: this.props.width,
                    height: this.props.height,
                    flexDirection: 'row',
                    alignItems: 'center',
                    transform: [{ translateX: this.state.pan }],
                }}
            >
                {/* TODO: ADD previous track */}
                {/* {this.props.prevTrack ? (
                    this.props.renderItem({ item: this.props.prevTrac })
                ) : null} */}
                {this.props.currentTrack ? (
                    <View
                        style={{
                            width: '100%',
                            height: this.props.height,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        {...this.panResponder.panHandlers}
                    >
                        {this.props.renderItem({
                            item: this.props.currentTrack,
                        })}
                    </View>
                ) : null}
                {this.props.nextTrack ? (
                    <Animated.View
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: this.state.pan.interpolate({
                                inputRange: [-this.props.width / 2, 0],
                                outputRange: [1, 0],
                            }),
                        }}
                        {...this.panResponder.panHandlers}
                    >
                        {this.props.renderItem({ item: this.props.nextTrack })}
                    </Animated.View>
                ) : null}
            </Animated.View>
        );
    }
}

const mapStateToProps = state => ({
    currentTrack: state.player.currentTrack,
    nextTrack: state.player.nextTrack,
    prevTrack: state.player.prevTrack,
});

export default connect(mapStateToProps)(Carousel);
