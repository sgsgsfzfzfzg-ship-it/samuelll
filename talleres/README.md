# Talleres de programación – Desarrollo del Pensamiento Analítico y Sistémico

Soluciones en C++ de los tres talleres (I.E. La Candelaria, prof. César Ovidio Montoya Sánchez).

| Taller | Programas |
|---|---|
| `taller1-mientras/` | practica9204, practica9209, practica308 |
| `taller2-hacer-mientras/` | practica801, practica802, practica803, practica804, practica805 |
| `taller3-para/` | practica301, practica302, practica303, practica304, practica9201 |

En `documentos/` están los talleres originales con la solución de cada ejercicio
agregada: pseudocódigo (donde no venía), prueba de escritorio, código en C++ y
una ejecución de ejemplo.

## Compilar y ejecutar

```bash
g++ taller3-para/practica301.cpp -o practica301
./practica301
```

También funcionan en Dev-C++ o Code::Blocks. Los mensajes de los programas van
sin tildes ni ñ para que se vean bien en la consola de Windows.

## Observaciones sobre los algoritmos del taller

- **practica804**: `nota` debe ser Real (no Entero) y la condición del ciclo
  estaba al revés: debe repetirse mientras la nota esté *fuera* del rango,
  `Mientras que (nota < 0 o nota > 5)`.
- **practica804 / practica805**: a los `Si` les faltaba un paréntesis.
- **practica9209**: `sum` debe empezar en 0 y se imprime cada término, como pide el enunciado.
- **practica308**: se usa $500.000 como dice el enunciado (el ejemplo del
  procedimiento usaba 500 para que la prueba fuera corta).
- **practica304**: desde el término 94 Fibonacci no cabe en ningún entero de
  C++, así que los términos se suman como texto, dígito por dígito.
