import { compose } from 'recompose';
import { connect } from 'react-redux';
import { hideModal } from './ModalState';
import Modal from './ModalView';

export default compose(
    connect(
        state => ({
            isOpen: state.modal.isOpen,
            options: state.modal.options,
            actions: state.modal.actions,
        }),
        dispatch => ({
            hideModal: () => dispatch(hideModal()),
        }),
    ),
)(Modal);
