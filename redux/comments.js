import * as ActionTypes from './ActionTypes';


export const comments = (state = {
    errMess: null,
    comments: []
}, action) => {
    switch(action.type) {
        case ActionTypes.ADD_COMMENT:
            var comment = action.payload;
            var commentId = state.comments.length;
            comment = {...comment, id: commentId};
            return {...state, comments: state.comments.concat(comment)};
        
        case ActionTypes.ADD_COMMENTS:
            return {...state, isLoading: false, errMess: null, comments: action.payload};

        case ActionTypes.COMMENTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, comments: []};
        default:
            return state;
    }
}