import { StepProps } from "../interfaces/IRegister";
import Button from "../../../shared/components/common/Button/Button";

export const Step1: React.FC<StepProps> = ({ data, handleChange, nextStep }) => {
    return (
      <div className="r-form-step">
        <h2>Step One</h2>

        <div className="register-form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="tu@email.com"
            value={data.email || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-form-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="********"
            value={data.password || ''}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

         <div className="register-form-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="********"
              value={data.confirmPassword || ''}
              onChange={handleChange}
              required
            />
        </div>
        
        <div className="cont-button-next">
          <Button onClick={nextStep}>Next</Button>
        </div>
      </div>
    );
};