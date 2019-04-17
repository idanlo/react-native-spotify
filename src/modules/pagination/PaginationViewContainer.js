import { compose } from 'recompose';
import { connect } from 'react-redux';
import { showModal } from '../modal/ModalState';
import PaginationScreen from './PaginationView';

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
)(PaginationScreen);
