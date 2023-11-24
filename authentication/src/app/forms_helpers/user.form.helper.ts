import { AbstractControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
const passwordBlueprint = ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]];
export const customValidatorForm = (form: FormGroup) => {
  return () => {
    const pass = form.get('password')
    const _pass = form.get('_password')
    if (!pass || !_pass) {
      _pass?.setErrors(null);
      return null
    }
    const passwordMismatch = pass?.value != _pass?.value ? { 'passwordMismatch': "Entered value isn't match" } : null;
    let errors = { ..._pass?.errors }
    console.log(passwordMismatch, 'passwordMismatch')
    if (passwordMismatch) {
      errors = { ...errors, passwordMismatch }
    } else {
      delete errors["passwordMismatch"]
    }
    if (Object.keys(errors).length > 0) {

      return null
    }

    return passwordMismatch;
  };
}
const textBlueprint = ['', [Validators.required, Validators.maxLength(50)]];

const password = { blueprint: passwordBlueprint, extra: { label: "Password", key: 'password', type: 'password' } }
const _password = { blueprint: passwordBlueprint, extra: { label: "Repeat Password", key: '_password', type: 'password' } }
const user_name = { blueprint: textBlueprint, extra: { label: "User Name", key: 'user_name' } }
const email = { blueprint: ['', [Validators.required, Validators.email, Validators.maxLength(75)]], extra: { label: "email", key: 'email' } }
const last_name = { blueprint: textBlueprint, extra: { label: "last Name", key: 'last_name' } }
const first_name = { blueprint: textBlueprint, extra: { label: "First Name", key: 'first_name' } }
export const registrationInputs = {
  last_name,
  first_name,
  _password,
  password,
  email,
  user_name,
}
export const loginInputs = {
  password,
  user_name
}
export const forgotInputs = {
  email
}

export const getVerboseError = (err: string, errors: { [x: string]: string; }) => {
  const errorMapper = {
    required: () => err,
    pattern: () => (errors[err]['requiredPattern' as keyof typeof err]),
    minlength: () => (`${err}: ${errors[err]['requiredLength' as keyof typeof err]}`),
    maxlength: () => `${err}: ${errors[err]['requiredLength' as keyof typeof err]}`,
    email: () => err,
    passwordMismatch: () => `${err}: ${errors[err]['passwordMismatch' as keyof typeof err]}`
  }
  if (!Object.keys(errorMapper).includes(err)) {
    return `Unknown error: ${err}`
  }
  return errorMapper[err as keyof typeof errorMapper]()
}


export interface Mode {
  label: string;
  id: string;
  inputs: {
    [x: string]: {
      blueprint: (string | ((control: AbstractControl<any, any>) => ValidationErrors | null)[])[];
      extra: { label: string; key: string; type?: string; };
    };

  }
  secondaryButton: { label: string; };
  primaryButton: { label: string; };
}

export const modes = {
  login: { label: "Log in", id: 'login', inputs: loginInputs, secondaryButton: { label: "Register new user" }, primaryButton: { label: "Log in" } },
  register: { label: "New user registration", id: 'register', inputs: registrationInputs, secondaryButton: { label: "Cancel" }, primaryButton: { label: "Register" } },
  forgot: { label: "Forgot Password", id: 'forgot', inputs: forgotInputs, secondaryButton: { label: "Cancel" }, primaryButton: { label: "Send reset link" } },

}
