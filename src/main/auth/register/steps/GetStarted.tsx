import Button from "../../../shared/components/common/Button/Button";

export const GetStarted = ({ startRegistration }: { startRegistration: () => void }) => {
  return (
    <div className="register-title-form">
      <div>
        <h1>Get Started</h1>
        <p>Press the button to get started!</p>
      </div>
      <Button onClick={startRegistration}>Register</Button>
    </div>
  );
};
