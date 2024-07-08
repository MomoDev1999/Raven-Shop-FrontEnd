import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule], // Importamos RouterTestingModule para manejar las rutas
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render contact information', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h5').textContent).toContain(
      'Información de contacto'
    );
    expect(compiled.querySelector('p').textContent).toContain(
      'Dirección: 123 Calle Principal, Ciudad, País'
    );
    expect(compiled.querySelector('p').textContent).toContain(
      'Teléfono: +123 456 789'
    );
  });

  it('should render social media links', () => {
    const compiled = fixture.nativeElement;
    const socialLinks = compiled.querySelectorAll('a[href^="http"]');
    expect(socialLinks.length).toBe(3);
    expect(socialLinks[0].textContent).toContain('Facebook');
    expect(socialLinks[1].textContent).toContain('Twitter');
    expect(socialLinks[2].textContent).toContain('Instagram');
  });

  it('should render useful links', () => {
    const compiled = fixture.nativeElement;
    const usefulLinks = compiled.querySelectorAll('a[routerLink]');
    expect(usefulLinks.length).toBe(3);
    expect(usefulLinks[0].textContent).toContain('Términos y condiciones');
    expect(usefulLinks[1].textContent).toContain('Política de privacidad');
    expect(usefulLinks[2].textContent).toContain('Preguntas frecuentes');
  });
});
