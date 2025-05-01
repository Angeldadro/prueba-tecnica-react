import Button from "../../../shared/components/common/Button/Button";
import { Step2Props } from "../interfaces/IRegister";

export const Step2: React.FC<Step2Props> = ({ data, handleChange, nextStep, prevStep }) => {
    return (
      <div>
        <h2>Paso 2: Datos Personales</h2>
        <div className="register-form-field">
          <label htmlFor="firstName">Nombre</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Tu Nombre"
            value={data.firstName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="register-form-field">
          <label htmlFor="lastName">Apellido</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Tu Apellido"
            value={data.lastName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="step-navigation">
          <Button onClick={prevStep} theme="primary">Anterior</Button>
          <Button onClick={nextStep}>Siguiente</Button>
        </div>
      </div>
    );
  };