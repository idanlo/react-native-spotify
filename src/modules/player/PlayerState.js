import Spotify from 'rn-spotify-sdk';

// ACTION TYPES
const INIT = 'PlayerState/INIT';
const SET_TIMELINE_INTERVAL = 'PlayerState/SET_TIMELINE_INTERVAL';
const CLEAR_TIMELINE_INTERVAL = 'PlayerState/CLEAR_TIMELINE_INTERVAL';
const SET_TIMELINE = 'PlayerState/SET_TIMELINE';
const SET_PLAYBACK_STATE = 'PlayerState/SET_PLAYBACK_STATE';
const SET_PLAYBACK_METADATA = 'PlayerState/SET_PLAYBACK_METADATA';
const SET_TRACK_CHANGED = 'PlayerState/SET_TRACK_CHANGED';
const SEEK = 'PlayerState/SEEK';

// an action creator that gets called when playback metadata changes (new song etc)
function metadataChangedActionCreator(data) {
    if (data) {
        return {
            type: SET_PLAYBACK_METADATA,
            currentTrack: data.currentTrack,
            nextTrack: data.nextTrack,
            prevTrack: data.prevTrack,
        };
    }
    return null;
}

// an action creator that gets called when playback state changes (position, pause/play etc)
function stateChangedActionCreator(state) {
    if (state) {
        console.log('SETTING TIMELINE TO...... ', state.position);
        return {
            type: SET_PLAYBACK_STATE,
            timeline: state.position,
            state,
        };
    }
    return null;
}

// an action-creator that gets called when a track changes
function trackChangedActionCreator(metadata, state) {
    if (metadata && state) {
        return {
            type: SET_TRACK_CHANGED,
            currentTrack: metadata.currentTrack,
            nextTrack: metadata.nextTrack,
            prevTrack: metadata.prevTrack,
            timeline: state.position,
            state,
        };
    }
    return null;
}

// a thunk action-creator to update the timeline every second (add 1 to previous timeline)
function timelineUpdater() {
    return (dispatch, getState) =>
        dispatch({
            type: SET_TIMELINE,
            timeline: getState().player.timeline + 1,
        });
}

// a thunk action-creator to create an interval for updating the timeline
// dispatches 'SET_TIMELINE_INTERVAL' on init and 'SET_TIMELINE' every second
function setTimelineInterval() {
    return dispatch => {
        const interval = setInterval(() => {
            dispatch(timelineUpdater());
        }, 1000);
        dispatch({
            type: SET_TIMELINE_INTERVAL,
            interval,
        });
    };
}

// a thunk action-creator to clear the timeline interval (if exists)
function clearTimelineInterval() {
    return (dispatch, getState) => {
        if (getState().player.interval) {
            clearInterval(getState().player.interval);
            return dispatch({ type: CLEAR_TIMELINE_INTERVAL });
        }
    };
}

// a function to set the timeline because there is no Spotify event for that (timeline updates only happen on playback state change)
// so i created my own action
export function seek(timeline) {
    return {
        type: SEEK,
        timeline,
    };
}

// a function to init all event listeners to the Spotify SDK events (called once)
export function InitPlayer() {
    return dispatch => {
        // set up listeners
        dispatch({ type: INIT });
        // wrapper-functions that dispatch the actual action-creators
        // 2 functions is more efficient than 4 arrow functions
        function stateChangedHandlerDispatcher() {
            return dispatch(stateChangedHandler());
        }

        function trackChangedHandlerDispatcher() {
            return dispatch(trackChangedHandler());
        }

        // add all spotify listeners
        Spotify.addListener('play', stateChangedHandlerDispatcher);
        Spotify.addListener('pause', stateChangedHandlerDispatcher);
        Spotify.addListener('metadataChange', stateChangedHandlerDispatcher);
        Spotify.addListener('trackChange', trackChangedHandlerDispatcher);

        // get initial data
        Spotify.getPlaybackMetadataAsync().then(data => {
            console.log('Received initial metadata: ', data);
            // if data exists (there is a playing song)
            if (data) {
                dispatch(metadataChangedActionCreator(data));
                // if there is playback metadata then there is playback state, so fetch that
                Spotify.getPlaybackStateAsync().then(playbackState => {
                    console.log(
                        'Received initial playback state: ',
                        playbackState,
                    );
                    // just to make sure it exists
                    if (playbackState) {
                        dispatch(stateChangedActionCreator(playbackState));
                    }
                });
            }
        });
    };
}

// a thunk action-creator that gets called when playback state changes (position, pause/play etc)
function stateChangedHandler() {
    return (dispatch, getState) =>
        // get state (position, shuffling, repeating)
        Spotify.getPlaybackStateAsync().then(state => {
            if (state) {
                if (state.playing && !getState().player.interval) {
                    dispatch(setTimelineInterval());
                } else if (!state.playing && getState().player.interval) {
                    dispatch(clearTimelineInterval());
                }
                return dispatch(stateChangedActionCreator(state));
            }
        });
}

// a thunk action-creator that gets called when a track changes
function trackChangedHandler() {
    return (dispatch, getState) =>
        // get metadata (currentTrack, prevTrack, nextTrack) and state (position, shuffling, repeating)
        Spotify.getPlaybackMetadataAsync().then(metadata =>
            Spotify.getPlaybackStateAsync().then(state => {
                if (state && metadata) {
                    if (state.playing && !getState().player.interval) {
                        dispatch(setTimelineInterval());
                    }
                    return dispatch(trackChangedActionCreator(metadata, state));
                }
            }),
        );
}

const initialState = {
    currentTrack: null,
    nextTrack: null,
    prevTrack: null,
    timeline: 0,
    state: null,
    interval: null,
    initialized: false,
};

export default function PlayerStateReducer(state = initialState, action) {
    switch (action.type) {
        case INIT:
            return { ...state, initialized: true };
        case SET_TRACK_CHANGED:
            return {
                ...state,
                timeline: action.timeline,
                state: action.state,
                currentTrack: action.currentTrack,
                nextTrack: action.nextTrack,
                prevTrack: action.prevTrack,
            };
        case SET_TIMELINE:
            return { ...state, timeline: action.timeline };
        case SET_PLAYBACK_STATE:
            return {
                ...state,
                state: action.state,
                timeline: action.state.position,
            };
        case SEEK:
            return { ...state, timeline: action.timeline };
        case SET_PLAYBACK_METADATA:
            return {
                ...state,
                currentTrack: action.currentTrack,
                nextTrack: action.nextTrack,
                prevTrack: action.prevTrack,
            };
        case SET_TIMELINE_INTERVAL:
            return { ...state, interval: action.interval };
        case CLEAR_TIMELINE_INTERVAL:
            return { ...state, interval: null };
        default:
            return { ...state };
    }
}
