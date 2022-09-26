# Challenge - Express/Sequelize

Este challenge es primariamente para ayudarnos entender como venís absorbiendo los conceptos. No te estreses, vamos a usar este challenge solo para entender como te podemos ayudar mejor.

Para este fin - y por ahí es innecesario aclararlo - te pedimos que no se ayuden entre ustedes o hagan trampa.

## Recursos

Los siguientes recursos **no** están permitidos:

* Código existente que ya hayas escrito.
* Soluciones de ejercicios anteriores.

Los siguientes recursos **estan permitidos**:

* Cualquier nota que hayas tomado.
* Los slides que usamos en clase.
* Documentación online - pero no copy pastes código.

## Que queremos evaluar

* Estructura de Apps de Express
* Express Routing y métodos de Ruta
* Configuración de modelo de Sequelize

## Comenzando

1. **Forkeá** este repo en tu propio github
* Clona tu fork a tu propia maquina
* Asegurate que tu base de datos de Postgres este corriendo!
* `npm install`
* Podés correr `npm test` el cual va a continuamente correr los tests cuando guardes un archivo.
* Lee a través de la estructura del proyecto. Vas a **trabajar exclusivamente** en `models/articles.js` y `routes/index.js`, en ese orden.
* Empieza trabajando a través de los tests en la carpeta `test/`. Vas a tener que marcarlos como activos cambiando `xit` a `it`.
* Hace `git commit` a medida que vas pasando tests. 

Estos tests incluyen [supertest](https://github.com/visionmedia/supertest).

## TIPS IMPORTANTES

* **LEE TODOS LOS COMENTARIOS CUIDADOSAMENTE** Los Specs asumen que haz leído los comentarios, y muchos specs pueden tener links a documentación relevante.
* Después de haber definido correctamente el `title` y el `content` del modelo, podés probablemente pasar todos los test que quedan del modelo y ruta en *cualquier orden* (nota, no esta garantizado un 100%). Así que si te quedas atascado, **continuá y trata de pasar otros specs**
* Si estas inseguro de que un spec esta haciendo o pidiendo que hagas, o te quedas trabado, *pedí por ayuda*.
* Por favor no commities `console.log`s u otro código para debuggeo.
