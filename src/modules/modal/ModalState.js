const MODAL_SHOW = 'ModalState/MODAL_SHOW';
const MODAL_HIDE = 'ModalState/MODAL_HIDE';

export function showModal(options, actions) {
    return {
        type: MODAL_SHOW,
        options,
        actions,
    };
}

export function hideModal() {
    return {
        type: MODAL_HIDE,
    };
}

const initialState = {
    isOpen: false,
    options: null,
    actions: null,
};

export default function ModalStateReducer(state = initialState, action) {
    switch (action.type) {
        case MODAL_SHOW:
            return {
                isOpen: true,
                options: action.options,
                actions: action.actions,
            };
        case MODAL_HIDE:
            return { isOpen: false, options: null, actions: null };
        default:
            return { ...state };
    }
}
