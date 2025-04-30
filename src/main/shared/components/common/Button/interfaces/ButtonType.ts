export interface ButtonType {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    theme?: "primary" | "secondary" | "tertiary" | "danger" | "success" | undefined;
    disabled?: boolean;
}