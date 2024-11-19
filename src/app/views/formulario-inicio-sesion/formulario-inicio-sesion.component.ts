import { Component } from '@angular/core';

import { LoginComponent } from '../login/login.component';
import { RegistrarComponent } from '../registrar/registrar.component';

@Component({
  selector: 'app-formulario-inicio-sesion',
  standalone: true,
  imports: [RegistrarComponent, LoginComponent],
  templateUrl: './formulario-inicio-sesion.component.html',
  styleUrl: './formulario-inicio-sesion.component.css',
})
export class FormularioInicioSesionComponent {}
