import "./login.css"
// Hooks
import { useState, useEffect } from "react";
// Components
import Button from "../../shared/components/common/Button/Button";
import { Link, useNavigate } from "react-router-dom";
// Stores
import LoginStore from "../../../stores/LoginStores";
// Actions
import LoginActions from "../../../actions/LoginActions";
import { AppDispatch } from "../../../stores";
import { useDispatch } from "react-redux";
import { addNotificationWithTimeout } from "../../../stores/NotificationSlice";
// interfaces
// actiosn redux

export default function Login() {
    const [authData, setAuthData] = useState<{ email: string, password: string }>({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState<boolean>(LoginStore.isLoading());
    const [error, setError] = useState<string | null>(LoginStore.getError());

    // navigation
    const navigate = useNavigate()
    const dispatcher: AppDispatch = useDispatch()
 
    const _onLoginStateChange = (): void => {
        setIsLoading(LoginStore.isLoading());
        setError(LoginStore.getError());
    };

    useEffect(() => {
        LoginStore.addChangeListener(_onLoginStateChange);
        return () => {
            LoginStore.removeChangeListener(_onLoginStateChange);
        };
    }, [LoginActions.attemptLogin, error]);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setAuthData({ ...authData, email: e.target.value })
        if (error) setError(null);
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setAuthData({ ...authData, password: e.target.value })
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        await LoginActions.attemptLogin(authData.email, authData.password, navigate);

        if (error) {
            dispatcher(addNotificationWithTimeout({
                message: error,
                type: 'error'
            }))
        }
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
                                <input type="password" name="password" id="password"
                                value={authData.password}
                                placeholder="**********"
                                required
                                onChange={handlePasswordChange}
                                disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="register-account">
                                    You don't have an account? <Link to="/register">Register</Link>
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