import { compose } from 'recompose';
import { connect } from 'react-redux';
import { showModal } from '../modal/ModalState';
import PlayerScreen from './PlayerView';

export default compose(
    connect(
        null,
        dispatch => ({
            showModal: (options, actions) =>
                dispatch(showModal(options, actions)),
        }),
    ),
)(PlayerScreen);
