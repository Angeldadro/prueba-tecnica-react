export interface IUserData {
    username: string;
    password: string;
}
  
export interface AppAction {
    type: string;
    payload?: any;
}