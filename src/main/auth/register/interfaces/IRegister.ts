export interface RegistrationData {
    // Fase 1
    email: string;
    password?: string;
    confirmPassword?: string;
    // Fase 2
    firstName?: string;
    lastName?: string;
    // Fase 3
    phone?: string;
}

export interface StepProps {
    data: RegistrationData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    nextStep: () => void; 
}

export interface Step2Props {
    data: RegistrationData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    nextStep: () => void;
    prevStep: () => void;
}