import { compose } from 'recompose';
import { connect } from 'react-redux';
import AlbumScreen from './AlbumView';
import { showModal } from '../modal/ModalState';

export default compose(
    connect(
        state => ({
            currentTrack: state.player.currentTrack,
        }),
        dispatch => ({
            showModal: (options, actions) =>
                dispatch(showModal(options, actions)),
        }),
    ),
)(AlbumScreen);
