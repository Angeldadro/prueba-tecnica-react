import AuthenticatedLayout from "../../shared/components/AuthenticatedLayout";
import "./login.css"

// Components
import Button from "../../shared/components/common/Button/Button";

export default function Login() {
    return (
            <div className="login-container">
                <form className="login-form">
                    <div>
                        <h1>Login</h1>

                        <div className="login-form-fields">
                            <div className="login-form-field">
                                <label htmlFor="email">Email</label>
                                <input type="text" name="email" id="email"
                                placeholder="email@example.com"
                                />
                            </div>

                            <div className="login-form-field">
                                <label htmlFor="username">Password</label>
                                <input type="text" name="password" id="password"
                                placeholder="**********"
                                />
                            </div>

                            <div>
                                <label htmlFor="register-account">
                                    You don't have an account? <a href="/register">Register</a>
                                </label>
                            </div>
                        </div>

                        <div>
                            <Button>Sign In</Button>
                        </div>
                    </div>
                </form>
            </div>
    )
}