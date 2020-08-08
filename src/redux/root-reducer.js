import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import UserReducer from './user/user.reducer';
import MessageReducer from './message/message.reducers';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [''],
};

const rootReducer = combineReducers({
  user: UserReducer,
  message: MessageReducer,
});

export default persistReducer(persistConfig, rootReducer);
