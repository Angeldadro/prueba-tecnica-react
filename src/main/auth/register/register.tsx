import './register.css'
import { useState } from 'react'
import { RegistrationData } from './interfaces/IRegister'
// components
import { Step1 } from './steps/Step1'
import { Step2 } from './steps/Step2'
import Button from '../../shared/components/common/Button/Button'

export default function Register() {
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [formData, setFormData] = useState<RegistrationData>({
        email: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value,
        }));
      };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!formData.email || !formData.password || !formData.confirmPassword) {
                alert("Por favor completa todos los campos requeridos.");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }
        }
        setCurrentStep(prevStep => prevStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
      };

  const handleSubmit = () => {
    console.log("Enviando datos de registro:", formData);
    alert("¡Registro (simulado) completado!");
  };

   const startRegistration = () => {
       setCurrentStep(1);
   }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
            <div className='register-title-form'>
                <h1>Get Started</h1>
                <p>Press the button to get started!</p>
                <Button onClick={startRegistration}>Register</Button>
            </div>
        );
      case 1:
        return <Step1 data={formData} handleChange={handleChange} nextStep={nextStep} />;
      case 2:
        return <Step2 data={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
      case 3: 
        return (
          <div>
            <h2>Paso 3: Resumen y Confirmar</h2>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Nombre:</strong> {formData.firstName || 'N/A'}</p>
            <p><strong>Apellido:</strong> {formData.lastName || 'N/A'}</p>
            <p>Por favor, revisa tus datos antes de registrarte.</p>
            <div className="step-navigation">
              <Button onClick={prevStep} theme="primary">Anterior</Button>
              <Button onClick={handleSubmit}>Confirmar Registro</Button>
            </div>
          </div>
        );
      default:
        return (
            <div className='register-title-form'>
                 <h1>¡Registro Completado!</h1>
                 <Button onClick={() => setCurrentStep(0)}>Inicio</Button>
            </div>
        );
    }
  };

  return (
    <section className='register-container'>
      <div className='register-content'>
         {currentStep > 0 && currentStep <= 3 && (
             <div className='step-indicator'>
                 Paso {currentStep} de 3
             </div>
         )}

        {renderStep()}
      </div>
    </section>
  );
}