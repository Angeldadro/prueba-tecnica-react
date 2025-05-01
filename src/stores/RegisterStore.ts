import AppDispatcher from '../dispatcher/AppDispatcher';
import { REGISTER_ATTEMPT, REGISTER_FAILURE, REGISTER_SUCCESS } from '../constants/RegisterConstants';
import { IUserData, AppAction } from '../types/types';

// @ts-ignore
const CHANGE_EVENT = 'change';
let _isLoading: boolean = false;
let _error: string | null = null;
let _userData: IUserData | null = null;

type ChangeListenerCallback = () => void;
let _listeners: ChangeListenerCallback[] = [];

type TypesRegisterStore = { 
    isLoading(): boolean; 
    getError(): string | null; 
    getUserData(): IUserData | null;
    emitChange(): void;
    addChangeListener(callback: ChangeListenerCallback): void;
    removeChangeListener(callback: ChangeListenerCallback): void;
    _handleActions(action: AppAction): void;
    dispatchToken?: string;
}

const RegisterStore: TypesRegisterStore = {
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
      case REGISTER_ATTEMPT:
        _isLoading = true;
        _error = null;
        _userData = null;
        this.emitChange();
        break;
      case REGISTER_SUCCESS:
        _isLoading = false;
        _error = null;
        _userData = action.payload as IUserData;
        console.log('RegisterStore: State changed to Success', _userData);
        this.emitChange();
        break;
      case REGISTER_FAILURE:
        _isLoading = false;
        _error = action.payload as string;
        _userData = null;
        console.log('RegisterStore: State changed to Failure', _error);
        this.emitChange();
        break;
      default:
    }
  },
};

RegisterStore.dispatchToken = AppDispatcher.register(RegisterStore._handleActions.bind(RegisterStore));

export default RegisterStore;