import './register.css'
import { useEffect, useState } from 'react'
import { RegistrationData } from './interfaces/IRegister'
// components
import { Step1 } from './steps/Step1'
import { Step2 } from './steps/Step2'
import Button from '../../shared/components/common/Button/Button'
import { Step3 } from './steps/Step3'
import { GetStarted } from './steps/GetStarted'
import RegisterStore from '../../../stores/RegisterStore'
import RegisterActions from '../../../actions/RegisterActions'

export default function Register() {
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [formData, setFormData] = useState<RegistrationData>({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [isLoading, setIsLoading] = useState<boolean>(RegisterStore.isLoading)
    const [error, setError] = useState<string | null>(RegisterStore.getError())
 
    const _onRegisterStatechange = () => {
      setIsLoading(RegisterStore.isLoading())
      setError(RegisterStore.getError())
    }

    useEffect(() => {
        RegisterStore.addChangeListener(_onRegisterStatechange)

        return () => {
            RegisterStore.removeChangeListener(_onRegisterStatechange)
        }
    }, [])

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
    RegisterActions.attemptRegister(formData.email, formData.confirmPassword)
  }

   const startRegistration = () => {
       setCurrentStep(1);
   } 

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <GetStarted startRegistration={startRegistration}/>
      case 1:
        return <Step1 data={formData} handleChange={handleChange} nextStep={nextStep} />;
      case 2:
        return <Step2 data={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
      case 3: 
        return <Step3 formData={formData} handleSubmit={handleSubmit} prevStep={prevStep} isLoading={isLoading} />;
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
                 Step {currentStep} of 3
                 <span>
                  {error && error}
                 </span>
             </div>
         )}

        {renderStep()}
      </div>
    </section>
  );
}