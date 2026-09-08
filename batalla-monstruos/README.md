# Batalla de Monstruos

Aplicacion web para crear, editar y eliminar monstruos, y simular batallas por
turnos entre dos monstruos seleccionados.

## Funcionalidades

- Agregar monstruos con nombre, vida, ataque, defensa, velocidad e imagen.
- Editar monstruos existentes.
- Eliminar monstruos.
- Crear batallas entre dos monstruos.
- Calcular turnos automaticamente segun velocidad, ataque y defensa.
- Mostrar ganador, perdedor y detalle de cada turno.
- Ver y eliminar batallas anteriores.
- Persistencia local con `localStorage`.

## Reglas de batalla

1. Ataca primero el monstruo con mayor velocidad.
2. Si ambos tienen la misma velocidad, ataca primero el de mayor ataque.
3. El daño se calcula como `ataque - defensa`.
4. Si la defensa es mayor o igual al ataque, el daño minimo es `1`.
5. La batalla termina cuando la vida de un monstruo llega a `0`.

## Uso

Abre `index.html` directamente en el navegador o levanta un servidor local:

```bash
python3 -m http.server 5173
```

Luego visita:

```text
http://127.0.0.1:5173/batalla-monstruos/
```
