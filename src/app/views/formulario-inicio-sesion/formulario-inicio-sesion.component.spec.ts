import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioInicioSesionComponent } from './formulario-inicio-sesion.component';
import { LoginComponent } from '../login/login.component';
import { RegistrarComponent } from '../registrar/registrar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FormularioInicioSesionComponent', () => {
  let component: FormularioInicioSesionComponent;
  let fixture: ComponentFixture<FormularioInicioSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormularioInicioSesionComponent, // Componente standalone
        HttpClientTestingModule, // Para HttpClient
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}), // Simula la emisión de parámetros de consulta
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioInicioSesionComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería contener el componente LoginComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginElement = compiled.querySelector('app-login');
    expect(loginElement).not.toBeNull();
  });

  it('debería contener el componente RegistrarComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const registrarElement = compiled.querySelector('app-registrar');
    expect(registrarElement).not.toBeNull();
  });
});
