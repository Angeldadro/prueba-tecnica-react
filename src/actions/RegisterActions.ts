import AppDispatcher from '../dispatcher/AppDispatcher';
import { REGISTER_ATTEMPT, REGISTER_SUCCESS, REGISTER_FAILURE } from '../constants/RegisterConstants'
import { IUserData } from '../types/types';

// service
import { AuthService } from '../services/Auth/AuthService';

const RegisterActions = {
  async attemptRegister(email: string, password: string): Promise<void> {
    AppDispatcher.dispatch({
      type: REGISTER_ATTEMPT,
    });

    const response = await AuthService.register(email, password)
    if (response?.data) this.registerSuccess(response.data)
    if (response?.error) this.registerFailure(response.error) 
  },

  registerSuccess(userData: IUserData): void {
    AppDispatcher.dispatch({
      type: REGISTER_SUCCESS,
      payload: userData,
    });
  },

  registerFailure(errorMessage: string): void {
    AppDispatcher.dispatch({
      type: REGISTER_FAILURE,
      payload: errorMessage,
    });
  },
};

export default RegisterActions;