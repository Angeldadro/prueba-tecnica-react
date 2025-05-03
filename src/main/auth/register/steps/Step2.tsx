import Button from "../../../shared/components/common/Button/Button";
import { Step2Props } from "../interfaces/IRegister";

export const Step2: React.FC<Step2Props> = ({ data, handleChange, nextStep, prevStep }) => {
    return (
      <div className="r-form-step">
        <h2>Step Two</h2>
        <div className="register-form-field">
          <label htmlFor="firstName">Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Name..."
            value={data.firstName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="register-form-field">
          <label htmlFor="lastName">Lastname</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="LastName..."
            value={data.lastName || ''}
            onChange={handleChange}
          />
        </div>

        <div className="step-navigation">
          <Button onClick={prevStep} theme="primary">Previous</Button>
          <Button onClick={nextStep}>Next</Button>
        </div>

      </div>
    );
  };