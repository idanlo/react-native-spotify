import { compose } from 'recompose';
import { connect } from 'react-redux';
import { showModal } from '../modal/ModalState';
import { InitPlayer, seek } from './PlayerState';
import PlayerScreen from './PlayerView';

export default compose(
    connect(
        state => ({
            currentTrack: state.player.currentTrack,
            nextTrack: state.player.nextTrack,
            prevTrack: state.player.prevTrack,
            timeline: state.player.timeline,
            state: state.player.state,
            interval: state.player.interval,
            initialized: state.player.initialized,
        }),
        dispatch => ({
            showModal: (options, actions) =>
                dispatch(showModal(options, actions)),
            initPlayer: () => dispatch(InitPlayer()),
            seek: val => dispatch(seek(val)),
        }),
    ),
)(PlayerScreen);
