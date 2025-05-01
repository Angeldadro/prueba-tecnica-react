
import AppDispatcher from '../dispatcher/AppDispatcher';
import { LOGIN_ATTEMPT, LOGIN_SUCCESS, LOGIN_FAILURE } from '../constants/LoginConstants';
import { IUserData } from '../types/types';

// service
import { AuthService } from '../services/Auth/AuthService';

const LoginActions = {
  async attemptLogin(email: string, password: string): Promise<void> {
    AppDispatcher.dispatch({
      type: LOGIN_ATTEMPT,
    });

    const response = await AuthService.login(email, password)
    if (response?.data) this.loginSuccess(response.data)
    if (response?.error) this.loginFailure(response.error)
  },

  loginSuccess(userData: IUserData): void {
    AppDispatcher.dispatch({
      type: LOGIN_SUCCESS,
      payload: userData,
    });
  },

  loginFailure(errorMessage: string): void {
    AppDispatcher.dispatch({
      type: LOGIN_FAILURE,
      payload: errorMessage,
    });
  },
};

export default LoginActions;