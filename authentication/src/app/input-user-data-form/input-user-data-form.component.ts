import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import * as formHelper from "../forms_helpers/user.form.helper";
import { CommonModule } from '@angular/common';
import { UserService } from '../services/userService';

@Component({
	selector: 'input-user-data-form',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
	templateUrl: './input-user-data-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./input-user-data-form.component.scss']
})

export class InputUserDataFormComponent implements OnInit {
	registered = false;
	submitted = false;
	userForm!: FormGroup;
	serviceErrors: any = {};
	inputs = {};
	authorisationError = '';
	API_URL = `http://${process.env['REACT_APP_AUTH_SERVER']}/users/`;
	inputsExtras: [{ [key: string]: string }] | Object = {};
	modes = formHelper.modes
	private _mode: formHelper.Mode = this.modes.login
	userService: UserService;

	constructor(private cd: ChangeDetectorRef, private formBuilder: FormBuilder) {
		this.userService = inject(UserService)
	}
	set mode(value) {
		this._mode = value;
		this.serviceErrors = {};
		this.submitted = false;
		this.generateLayout();
	}
	checkInputs() {
		this.cd.detectChanges();
	}
	get mode() {
		return this._mode
	}
	invalidInput = (_inputId: string) => {
		return (this.submitted && (this.serviceErrors[_inputId] != null || this.userForm.controls[_inputId].errors != null))
	};
	onSecondaryButtonClick(mode?: formHelper.Mode) {
		if (mode) {
			this.mode = mode;
			return;
		}
		if (this.mode.id === this.modes.login.id) {
			this.mode = this.modes.register;
			return
		}
		this.mode = this.modes.login;
	}
	generateFormInputs = (inputs: any, result = {}) => {
		return Object.keys(inputs).reduceRight((acc: any, cur: string) => {
			let res = acc || {}
			res[cur as keyof typeof res] = inputs[cur as keyof typeof inputs].blueprint
			this.inputsExtras[cur as keyof typeof this.inputsExtras] = inputs[cur as keyof typeof inputs].extra
			return res;
		}, result)
	}
	generateLayout() {
		this.inputsExtras = {}
		this.userForm = this.formBuilder.group({
			...this.generateFormInputs(this._mode.inputs)
		});
		this.userForm.addValidators(formHelper.customValidatorForm(this.userForm))
		this.cd.detectChanges();
	}
	ngOnInit() {
		this.mode = this.modes.login
	}
	getForm = () => Object.keys(this.inputsExtras);
	getFormAtribute = (control: string, atribute: string) => {
		const result = this.inputsExtras[control as keyof typeof this.inputsExtras];
		return result[atribute as keyof typeof result];
	};
	getError = (control: string) => {
		const errors = this.userForm.controls[control].errors
		if (errors) {
			return Object.keys(errors).map(err => formHelper.getVerboseError(err, errors))
		}
		return null
	}
	onSubmit() {
		this.submitted = true;
		this.cd.detectChanges();
		this.authorisationError = '';
		if (this.userForm.invalid == true) {
			return;
		}

		else {
			if (this.mode.id === this.modes.login.id) {
				this.userService.logInUser(
					this.userForm.controls['user_name'].value,
					this.userForm.controls['password'].value
				).subscribe({
					next: data => {
						const event = new CustomEvent('mangor::authentication', { detail: data, bubbles: false });
						window.dispatchEvent(event);
					},
					error: (e) => {
						this.authorisationError = e.error;
						console.log(e);
						this.cd.detectChanges();
					}
				})
			} else if (this.mode.id === this.modes.register.id) {

				this.userService.signupUser(
					this.userForm.controls['user_name'].value,
					this.userForm.controls['first_name'].value,
					this.userForm.controls['last_name'].value,
					this.userForm.controls['email'].value,
					this.userForm.controls['password'].value
				).subscribe({
					next: data => {
						const event = new CustomEvent('mangor::authentication', { detail: data });
						window.dispatchEvent(event);
					},
					error: (e) => {
						console.log(e);
					}
				})
			}
		}
	}
};