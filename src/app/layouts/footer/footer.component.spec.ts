import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, RouterTestingModule], // Importamos el componente standalone y RouterTestingModule
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar la dirección de contacto', () => {
    const addressElement = fixture.debugElement.query(
      By.css('.bi-geo-alt-fill')
    ).nativeElement;
    expect(addressElement.parentElement.textContent).toContain(
      '123 Calle Principal, Ciudad'
    );
  });

  it('debería mostrar el número de teléfono', () => {
    const phoneElement = fixture.debugElement.query(
      By.css('.bi-telephone-fill')
    ).nativeElement;
    expect(phoneElement.parentElement.textContent).toContain('+123 456 789');
  });

  it('debería mostrar el correo electrónico', () => {
    const emailElement = fixture.debugElement.query(
      By.css('.bi-envelope-fill')
    ).nativeElement;
    expect(emailElement.parentElement.textContent).toContain('infoexample.com');
  });

  it('debería contener enlaces a redes sociales', () => {
    const socialLinks = fixture.debugElement.queryAll(
      By.css('.social-icons a')
    );
    expect(socialLinks.length).toBe(3); // Verificamos que existen 3 enlaces
    expect(socialLinks[0].nativeElement.href).toContain('facebook.com');
    expect(socialLinks[1].nativeElement.href).toContain('twitter.com');
    expect(socialLinks[2].nativeElement.href).toContain('instagram.com');
  });

  it('debería tener un botón para registrarse', () => {
    const registerButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    expect(registerButton.textContent).toContain('Registrarse');
    expect(registerButton.getAttribute('ng-reflect-router-link')).toBe(
      '/iniciar-sesion'
    );
  });
});
