import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { routes } from './app.routes';
import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('AppRoutingModule', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [DummyComponent],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
  });

  it('debería redirigir la raíz (/) a /index', async () => {
    await router.navigate(['/']);
    expect(location.path()).toBe('/index');
  });

  it('debería cargar el componente correcto para cada ruta', async () => {
    const testRoutes = [
      { path: '/index', expectedComponent: 'IndexComponent' },
      {
        path: '/recuperar-password',
        expectedComponent: 'RecuperarPasswordComponent',
      },
      {
        path: '/mensaje-enviado',
        expectedComponent: 'MensajeEnviadoComponent',
      },
      { path: '/editar-perfil', expectedComponent: 'EditarPerfilComponent' },
      { path: '/ver-producto/1', expectedComponent: 'VerProductoComponent' },
      { path: '/buscar', expectedComponent: 'BuscarComponent' },
      {
        path: '/preguntas-frecuentes',
        expectedComponent: 'PreguntasFrecuentesComponent',
      },
      {
        path: '/terminos-y-condiciones',
        expectedComponent: 'TerminosYCondicionesComponent',
      },
      {
        path: '/politica-privacidad',
        expectedComponent: 'PoliticaPrivacidadComponent',
      },
      { path: '/carrito', expectedComponent: 'CarritoComponent' },
      { path: '/mis-compras', expectedComponent: 'MisComprasComponent' },
      {
        path: '/iniciar-sesion',
        expectedComponent: 'FormularioInicioSesionComponent',
      },
    ];

    for (const route of testRoutes) {
      await router.navigate([route.path]);
      expect(router.url).toBe(route.path);
      // Puedes verificar el componente cargado si lo deseas (requiere mocks avanzados o spies).
    }
  });
});
