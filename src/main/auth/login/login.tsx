import "./login.css"
// Hooks
import { useState, useEffect } from "react";
// Components
import Button from "../../shared/components/common/Button/Button";
// Stores
import LoginStore from "../../../stores/LoginStores";
// Actions
import LoginActions from "../../../actions/LoginActions";
// interfaces
import { IUserData } from "../../../types/types";

export default function Login() {

    const [authData, setAuthData] = useState<{ email: string, password: string }>({ email: '', password: '' });

    const [isLoading, setIsLoading] = useState<boolean>(LoginStore.isLoading());
    const [error, setError] = useState<string | null>(LoginStore.getError());
    const [userData, setUserData] = useState<IUserData | null>(LoginStore.getUserData());

    const _onLoginStateChange = (): void => {
        setIsLoading(LoginStore.isLoading());
        setError(LoginStore.getError());
        setUserData(LoginStore.getUserData());
    };

    useEffect(() => {
        LoginStore.addChangeListener(_onLoginStateChange);
        return () => {
            LoginStore.removeChangeListener(_onLoginStateChange);
        };
    }, []);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setAuthData({ ...authData, email: e.target.value })
        if (error) setError(null);
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setAuthData({ ...authData, password: e.target.value })
        if (error) setError(null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        LoginActions.attemptLogin(authData.email, authData.password);
    };

    return (
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="decorate-login-lines"></div>

                    <div className="login-form-content">

                        <h1>Sign In</h1>

                        <div className="login-form-fields">
                            <div className="login-form-field">
                                <label htmlFor="email">Email</label>
                                <input type="text" name="email" id="email"
                                placeholder="email@example.com"
                                value={authData.email}
                                required
                                onChange={handleEmailChange}
                                disabled={isLoading}
                                />
                            </div>

                            <div className="login-form-field">
                                <label htmlFor="username">Password</label>
                                <input type="text" name="password" id="password"
                                value={authData.password}
                                placeholder="**********"
                                required
                                onChange={handlePasswordChange}
                                disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="register-account">
                                    You don't have an account? <a href="/register">Register</a>
                                </label>
                            </div>
                        </div>

                        <div>
                            <Button type="submit" disabled={isLoading}>Sign In</Button>
                        </div>
                    </div>

                    <div className="decorate-login-lines-bottom"></div>
                </form>
            </div>
    )
}