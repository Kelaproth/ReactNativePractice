import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { createForms } from 'react-redux-form';
import { dishes } from './dishes';
import { comments } from './comments';
import { promotions } from './promotions';
import { leaders } from './leaders';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { favorites } from './favorites';

// import { InitialFeedback } from './forms';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dishes,
            comments,
            promotions,
            leaders,
            favorites
            // ...createForms({
            //     feedback: InitialFeedback
            // })
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}