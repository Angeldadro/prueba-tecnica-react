import { ButtonType } from "./interfaces/ButtonType";
import './Button.css'

export default function Button({ children, onClick, type, className, disabled, theme  }: ButtonType) {
    const buttonThemes = {
        primary: "button-primary",
        secondary: "button-secondary",
        tertiary: "button-tertiary",
        danger: "button-danger",
        success: "button-success",
    };
    const themeClass = theme ? buttonThemes[theme] : buttonThemes.primary;

    return (
        <button
        type={type || "button"}
            className={`${themeClass} ${className}`}
            onClick={disabled ? () => {} : onClick}
            disabled={disabled}
            style={disabled ? { cursor: "not-allowed" } : {}}
        >
            {children}
        </button>
    );
}