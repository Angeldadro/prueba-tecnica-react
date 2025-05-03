import { JSX } from "react";
import Button from "../../../shared/components/common/Button/Button";
import { RegistrationData } from "../interfaces/IRegister";

interface Step3Props {
    prevStep: () => void;
    handleSubmit: () => void;
    formData: RegistrationData
    isLoading: boolean;
}

export const Step3 = ({ prevStep, handleSubmit, formData, isLoading }: Step3Props): JSX.Element => {
  return (
    <div className="r-form-step">
      <h2>Step Three</h2>
      <p>
        <strong>Email</strong> {formData.email}
      </p>
      <p>
        <strong>Name</strong> {formData.firstName || "N/A"}
      </p>
      <p>
        <strong>Lastname</strong> {formData.lastName || "N/A"}
      </p>
      <p>Please, check your personal information before register.</p>
      <div className="step-navigation">
        <Button onClick={prevStep} theme="primary"
        disabled={isLoading}>
          Previous
        </Button>
        <Button onClick={handleSubmit}
        disabled={isLoading}
        >{isLoading ? 'Loading...' : 'Confirm'}</Button>
      </div>
    </div>
  );
};
