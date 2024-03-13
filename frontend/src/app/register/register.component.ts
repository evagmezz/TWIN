import { Component, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { HttpClientModule } from '@angular/common/http'
import { AuthService } from '../services/auth.service'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [animate('0.5s')]),
    ]),
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
  ],
  providers: [HttpClientModule],
})
export class RegisterComponent implements OnInit {
  registerForm = this.fb.group({
    name: [
      '',
      [Validators.minLength(2), Validators.maxLength(20), Validators.required],
    ],
    lastname: [
      '',
      [Validators.minLength(2), Validators.maxLength(20), Validators.required],
    ],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]*$/),
      ],
    ],
    password: [
      '',
      [Validators.minLength(8), Validators.maxLength(20), Validators.required],
    ],
    email: ['', [Validators.email, Validators.required]],
  })
  repeatPwd = [
    '',
    [Validators.minLength(8), Validators.maxLength(20), Validators.required],
  ]

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      const name = this.registerForm.controls.name.value || ''
      const lastname = this.registerForm.controls.lastname.value || ''
      const username = this.registerForm.controls.username.value || ''
      const password = this.registerForm.controls.password.value || ''
      const email = this.registerForm.controls.email.value || ''
      const repeatPwd = this.repeatPwd[0] || ''
      this.authService
        .register({ name, lastname, username, password, email })
        .subscribe(
          (res) => {
            console.log(res)
          },
          (err) => {
            console.log(err)
          },
        )
    }
  }
}