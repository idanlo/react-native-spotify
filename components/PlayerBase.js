import React from 'react';
import Spotify from 'rn-spotify-sdk';

export default class PlayerBase extends React.Component {
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
    componentWillUnmount() {
        clearInterval(this.interval);
        Spotify.removeListener('play', this.stateChangedHandler);
        Spotify.removeListener('pause', this.stateChangedHandler);
        Spotify.removeListener('metadataChange', this.stateChangedHandler);
        Spotify.removeListener('trackChange', this.trackChange);
    }
}
