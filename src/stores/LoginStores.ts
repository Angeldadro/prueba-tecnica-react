import AppDispatcher from '../dispatcher/AppDispatcher';
import { LOGIN_ATTEMPT, LOGIN_SUCCESS, LOGIN_FAILURE } from '../constants/LoginConstants';
import { IUserData, AppAction } from '../types/types';

// @ts-ignore
const CHANGE_EVENT = 'change';
let _isLoading: boolean = false;
let _error: string | null = null;
let _userData: IUserData | null = null;

type ChangeListenerCallback = () => void;
let _listeners: ChangeListenerCallback[] = [];


type TypesLoginStore = { 
    isLoading(): boolean; 
    getError(): string | null; 
    getUserData(): IUserData | null;
    emitChange(): void;
    addChangeListener(callback: ChangeListenerCallback): void;
    removeChangeListener(callback: ChangeListenerCallback): void;
    _handleActions(action: AppAction): void;
    dispatchToken?: string;
}

const LoginStore: TypesLoginStore = {
  isLoading(): boolean {
    return _isLoading;
  },
  getError(): string | null {
    return _error;
  },
  getUserData(): IUserData | null {
      return _userData;
  },
  emitChange(): void {
    _listeners.forEach(callback => callback());
  },
  addChangeListener(callback: ChangeListenerCallback): void {
    _listeners.push(callback);
  },
  removeChangeListener(callback: ChangeListenerCallback): void {
    _listeners = _listeners.filter(listener => listener !== callback);
  },

  _handleActions(action: AppAction): void {
    switch (action.type) {
      case LOGIN_ATTEMPT:
        _isLoading = true;
        _error = null;
        _userData = null;
        this.emitChange();
        break;
      case LOGIN_SUCCESS:
        _isLoading = false;
        _error = null;
        _userData = action.payload as IUserData;
        console.log('LoginStore: State changed to Success', _userData);
        this.emitChange();
        break;
      case LOGIN_FAILURE:
        _isLoading = false;
        _error = action.payload as string;
        _userData = null;
        console.log('LoginStore: State changed to Failure', _error);
        this.emitChange();
        break;
      default:
    }
  },
};

LoginStore.dispatchToken = AppDispatcher.register(LoginStore._handleActions.bind(LoginStore));

export default LoginStore;