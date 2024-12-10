import { SliceGroupsPipe } from './slice-groups.pipe';

describe('SliceGroupsPipe', () => {
  let pipe: SliceGroupsPipe;

  beforeEach(() => {
    pipe = new SliceGroupsPipe();
  });

  it('crea una instancia del pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('divide un array en grupos del tamaño indicado', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const size = 2;
    const output = pipe.transform(input, size);
    expect(output).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('maneja arrays cuyo tamaño no es múltiplo del grupo', () => {
    const input = [1, 2, 3, 4, 5];
    const size = 2;
    const output = pipe.transform(input, size);
    expect(output).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('retorna un array vacío si el array de entrada está vacío', () => {
    const input: any[] = [];
    const size = 3;
    const output = pipe.transform(input, size);
    expect(output).toEqual([]);
  });

  it('retorna un array con un único grupo si el tamaño es mayor que el array', () => {
    const input = [1, 2, 3];
    const size = 5;
    const output = pipe.transform(input, size);
    expect(output).toEqual([[1, 2, 3]]);
  });

  it('arroja un error si el tamaño es menor o igual a 0', () => {
    const input = [1, 2, 3];
    const size = 0;
    expect(() => pipe.transform(input, size)).toThrowError(
      'El tamaño del grupo debe ser mayor a 0'
    );
  });
});
