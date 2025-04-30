import AuthenticatedLayout from "../../shared/components/AuthenticatedLayout";
import "./login.css"

// Components
import Button from "../../shared/components/common/Button/Button";

export default function Login() {
    return (
        <AuthenticatedLayout>
            <div className="login-container">
                <form>
                    <h1>Login</h1>

                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username"/>
                    </div>

                    <div>
                        <label htmlFor="username">Password</label>
                        <input type="text" name="password" id="password"/>
                    </div>

                    <div>
                        <Button>Sign In</Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    )
}