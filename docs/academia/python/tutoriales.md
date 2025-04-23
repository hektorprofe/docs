title: Tutoriales | Python | Academia | Hektor Profe
description: Recopilación de tutoriales interesantes sobre este lenguaje.

# Tutoriales sobre Python

## Ejemplo sencillo de Test Driven Development en Python

En este tutorial os voy a hablar un poco sobre el [TDD: el desarrollo guiado por pruebas](https://es.wikipedia.org/wiki/Desarrollo_guiado_por_pruebas).

A diferencia de programar un proyecto y luego añadir pruebas, la idea del TDD es desarrollar el software a partir de las propias pruebas, dejando que éstas nos guíen durante el proceso.

De esta forma cada funcionalidad ya es concebida desde el principio con la idea de superar un test y por tanto está monitorizada para su correcto funcionamiento en el futuro.

Para hacer TDD hay que seguir un orden estricto:

1. **Escribir una prueba**, que recoja los requisitos de la funcionalidad que vamos a implementar.
2. **Ejecutar la prueba y comprobar que falla**, ya que todavía no habremos implementado la funcionalidad.
3. **Implementar la funcionalidad**, con el código mínimo necesario.
4. **Volver a ejecutar la prueba**, que en esta ocasión debería pasar correctamente, y si no es así corregir el código hasta que la pase.
5. **Refactorizar el código**, borrando redundancias e incongruencias, siempre comprobando que los tests siguen validando bien.
6. **Volver a empezar**, para implementar el siguiente requisito.

Crear una calculadora simple es el ejemplo más fácil e ilustrativo del procedimiento, basado en crear una clase calculadora con métodos para diferentes operaciones (suma, resta, división…).

Lo primero que vamos a hacer es crear un fichero llamado **test_calculator.py** en un directorio. Es importante que empiece con **test_** si queremos aprovechar la opción de autodescubrimiento de Python:

`test_calculator.py`
```python
# Cargamos el módulo unittest
import unittest  

# Creamos una clase heredando de TestCase
class TestMyCalculator(unittest.TestCase):  

    # Creamos una prueba para probar un valor inicial
    def test_initial_value(self):
        calc = Calculator()
        self.assertEqual(0, calc.value)
```

Como véis es un simple test para comprobar que el valor inicial de nuestra supuesta calculadora es 0 (es el valor que muestran por defecto todas las calculadoras).

Por cierto, los tests también deben empezar con **test_**.

Ahora, desde el directorio que contiene el fichero ejecutamos los tests de autodescubrimiento:

```
C:\python-tdd-example>python -m unittest discover
E
====================================================================
ERROR: test_initial_value (test_calculator.TestMyCalculator)
--------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\python-tdd-example\test_calculator.py", line 9, in test_initial_value
    calc = Calculator()
NameError: name 'Calculator' is not defined
--------------------------------------------------------------------
Ran 1 test in 0.001s
FAILED (errors=1)
```

Como era obvio se encontrará un test, se ejecutará y fallará.

Para seguir correctamente la filosofía del TDD es esencial no implementar todo el código de golpe, sino simplemente resolver los errores de uno en uno para hacer que la prueba pase, **de eso se trata que nos guíen las pruebas**.

El error que tenemos ahora nos dice:

```
NameError: name 'Calculator' is not defined
```

Para solucionarlo creamos la clase **Calculator** con el mínimo código:

`calculator.py`
```python
class Calculator:
    pass
```

Y hacemos uso de ella en nuestros módulo de pruebas:

`test_calculator.py`
```python
import unittest  

# Importamos la clase calculadora
from calculator import Calculator

class TestMyCalculator(unittest.TestCase):  

    def test_initial_value(self):
        calc = Calculator()
        self.assertEqual(0, calc.value)
```

Se supone que hemos resuelto el fallo, así que vamos a probar:

```
C:\python-tdd-example>python -m unittest discover
E
====================================================================
ERROR: test_initial_value (test_calculator.TestMyCalculator)
--------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\python-tdd-example\test_calculator.py", line 11, in test_initial_value
    self.assertEqual(0, calc.value)
AttributeError: 'Calculator' object has no attribute 'value'
--------------------------------------------------------------------
Ran 1 test in 0.001s
FAILED (errors=1)
```

¡Vaya qué sorpresa! Hemos arreglado un error y a aparecido otro diciéndonos que no tenemos el atributo value:

```
AttributeError: 'Calculator' object has no attribute 'value'
```

Pues nada, tendremos que arreglarlo y añadir este atributo en el constructor de nuestra clase:

`calculator.py`
```python
class Calculator:
  
    def __init__(self):
        self.value = 0
```

Ejecutamos de nuevo:

```
C:\python-tdd-example>python -m unittest discover
.
--------------------------------------------------------------------
Ran 1 test in 0.000s
OK
```

Nuestro código es muy sencillo, pero podemos mejorar un poco el test unitario añadiendo un método setUp() que se encargue de crear la instancia automáticamente:

`test_calculator.py`
```python
import unittest  
from calculator import Calculator

class TestMyCalculator(unittest.TestCase):  
  
    def setUp(self):
        self.calc = Calculator()

    def test_initial_value(self):
        self.assertEqual(0, self.calc.value)
```

Después de refactorizar volveremos a comprobar que el código pasa los tests, no vaya a ser que la hayamos liado:

```
C:\python-tdd-example>python -m unittest discover
.
--------------------------------------------------------------------
Ran 1 test in 0.001s
OK
```

¡Perfecto! Ya hemos desarrollado nuestro primer requisito guiándonos de las pruebas mientras hemos resuelto 2 errores.

Una calculadora sin operaciones no es una calculadora, así que vamos a añadirle por lo menos un método para sumar dos valores y guardar el resultado en el atributo value.

Recordemos sin embargo que estamos haciendo TDD, así que no podemos escribir el método directamente, primero tendremos que hacer un test que falle:

`test_calculator.py`
```python
import unittest  
from calculator import Calculator

class TestMyCalculator(unittest.TestCase):  
  
    def setUp(self):
        self.calc = Calculator()

    def test_initial_value(self):
        self.assertEqual(0, self.calc.value)
    
    # Creamos un nuevo test para comprobar una suma
    def test_add_method(self):
        # Ejecutamos el método
        self.calc.add(1, 3)  
        # Comprobamos si el valor es el que esperamos
        self.assertEqual(4, self.calc.value)
```

Ejecutamos el test que fallará:

```
C:\python-tdd-example>python -m unittest discover
E.
====================================================================
ERROR: test_add_method (test_calculator.TestMyCalculator)
--------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\python-tdd-example\test_calculator.py", line 15, in test_add_method
    self.calc.add(1, 3)
AttributeError: 'Calculator' object has no attribute 'add'
--------------------------------------------------------------------
Ran 2 tests in 0.001s
FAILED (errors=1)
```

Implementamos el método **add**:

`calculator.py`
```python
class Calculator:
  
    def __init__(self):
        self.value = 0

    def add(self, a, b):
        self.value = a + b
```

Probamos de nuevo el test:

```
C:\python-tdd-example>python -m unittest discover
..
--------------------------------------------------------------------
Ran 2 tests in 0.000s
OK
```

¡Perfecto, ya tenemos implementada nuestra suma! Ahora sería cuestión de ir añadiendo la resta, el producto, la división, etc.

## Generar ejecutables utilizando auto-py-to-exe

Esta aplicación permite generar archivos .exe de tus proyectos, ya sea un archivo .py o varios. Tiene una interfaz gráfica de usuario que se se ve así:

<div class="img-content">
    <img src="{{cdn}}/tutoriales/autopytoexe/01.png"/>
</div>

**1) Instalación y ejecución**

Instalación usando PyPI:

```bash
pip install auto-py-to-exe
```

Para abrir la aplicación:

```bash
auto-py-to-exe
```

**2) Conversión**

Hay algunas opciones principales:

* Seleccionar el archivo principal .py
* Seleccionar la opción "Un directorio" o "Un archivo"
* Seleccionar los archivos adicionales

2.1) Seleccionar el archivo principal .py

Si tiene varios archivos, seleccionar el que inicie el programa.

2.2) "One Directory"

<div class="img-content">
    <img src="{{cdn}}/tutoriales/autopytoexe/02.JPG"/>
</div>

Al elegir la opción <strong>"Un directorio",</strong> Auto PY to EXE colocará todas las dependencias en una carpeta. Puede elegir el directorio de salida en el menú "Avanzado". Si tiene archivos multimedia como iconos y fondos, no debería tener problemas para usarlos dentro de su .exe si coloca archivos / carpetas multimedia en el directorio de salida.

2.3) "One File"

<div class="img-content">
    <img src="{{cdn}}/tutoriales/autopytoexe/04.JPG"/>
</div>

Al elegir la opción <strong>"Un archivo",</strong> Auto PY to EXE creará un archivo .exe que contiene todas las dependencias, pero <strong>NO LOS ARCHIVOS DE MEDIOS</strong>. Si tu programa solo tiene la interfaz gráfica de usuario predeterminada de Windows sin iconos, fondos, archivos multimedia o si prefieres colocar la carpeta con los recursos multimedia adjunta al archivo .exe omite la siguiente explicación. Para aquellos que quieran empaquetar archivos multimedia en el archivo .exe, continua con el paso 2.4.

2.4) Elegir archivos adicionales

Hay un menú en <strong>Auto PY to EXE </strong>llamado "Archivos adicionales" que permite agregar archivos. Sin embargo, hay un problema. "Auto PY to EXE" usa pyinstaller que descomprime los datos en una carpeta temporal y almacena esta ruta de directorio en la variable de entorno _MEIPASS. El proyecto no encontrará los archivos necesarios porque la ruta cambió y no verá la nueva. En otras palabras, si se eliges la opción "Un archivo", los archivos seleccionados en el menú "Archivos adicionales" no se agregarán al archivo .exe.

Para solucionar este problema, debes utilizar este código proporcionado por el desarrollador de Auto PY to EXE:

```python
def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)</pre>
```

Para usar este código en su proyecto, reemplaza los enlaces al archivo multimedia que tienes ahora. Por ejemplo:

```python
setWindowIcon(QIcon('media\icons\logo.png'))
```

Lo cambiaríamos por:

```python
setWindowIcon(QIcon(resource_path('logo.png'))
```

Ahora se hará referencia al enlace correctamente y los archivos elegidos se empaquetarán correctamente en un archivo .exe.

A modo de comparación, como quedaría antes:

```
"C:\Users\User\Project\media\icons\logo.png"
```

Y después de usar la función **resource_path()**:

```
"C:\Users\User\AppData\Local\Temp\\_MEI34121\logo.png"
```

Ahora presiona <strong>CONVERT .PY TO .EXE</strong></p>

<div class="img-content">
    <img src="{{cdn}}/tutoriales/autopytoexe/05.png"/>
</div>

Espera:

<div class="img-content">
    <img src="{{cdn}}/tutoriales/autopytoexe/06.png"/>
</div>

**3) Ejecuta el programa**

¡Ya está! Prueba el ejecutable y asegúrate de que todo funcione bien.</p>

* Si creaste el ejecutable en un directorio cada archivo que necesita debe estar en un <strong>único directorio</strong>.
* Si creaste el ejecutable en un fichero deberías tener un solo archivo .exe. No necesitarás ningún archivo ni carpeta multimedia junto al ejecutable .exe para que se ejecute correctamente.


## Introducción a los dibujos gráficos con Turtle

<!--<br>
<div class="contenedor_youtube">
  <iframe width="838" height="470" src="https://www.youtube.com/embed/f0Y--fvUfs8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>-->

**Repositorio**: <a href="https://github.com/hektorprofe/curso-python-turtle" target="_blank">https://github.com/hektorprofe/curso-python-turtle</a>

<hr />

**¿Qué es Turtle?**

El módulo de la tortuga es la herramienta educativa perfecta para aprender programación de forma visual dibujando sobre un lienzo.

Se introdujo en el lenguaje Logo en 1966, sí, hace más de medio siglo, y si bien no es tan visual como programar con Scratch, permite trabajar directamente en un lenguaje como Python que la incorporó hace ya varios años.

En cierto modo se puede considerar una introducción a la programación de videojuegos, así que si te interesa el tema quédate hasta el final porque podrías aprender algunas cosas muy interesantes.

**Estructura base**

Normalmente partiremos de una estructura básica, con la importación de la librería, la creación de un espacio de dibujo y al final las rutinas de cierre:

```python
import turtle            # Cargamos el módulo de la tortuga

turtle.setup(500,500)    # Configuramos un espacio de dibujo

                         # El código iría aquí

turtle.done()            # Igualmente debemos poner abajo del todo
turtle.bye()             # Un done-bye para cerrar las rutinas
```

Para no tener que utilizar siempre el nombre turtle podemos importar el módulo como t:

```python
import turtle as t       # Si le damos el nombre t será más fácil

t.setup(500,500)

t.done()
t.bye()
```

Ahora podemos añadir forma y color a la tortuga para que aparezca en nuestro espacio:

```python
t.shape("turtle")        # Le damos la forma de una tortuga
t.color("green")         # Y un bonito color verde
```

Perfecto.

**Primer dibujo**

El lienzo sobre el que trabajará nuestra tortuga es un espacio de 500x500 píxeles. ¿En qué punto se encuentra la tortuga?

```python
print(t.pos())
```

Por defecto se encuentra en el punto o coordenada (0, 0). Este punto se conoce como el origen, y es un concepto clave para aprender a crear videojuegos.
Si el punto de origen está en el centro, ¿qué valdrán las coordenadas de las esquinas de nuestro lienzo?
Bueno, si tenemos en cuenta que el ancho es 500 píxeles, la mitad es 250. Así que si le decimos a la tortuga que se mueva hacia adelante 250 píxeles, debería posicionarse justo en el margen derecho.
Para decirle que vaya adelante, llamaremos a su método forward:

```python
t.forward(250)
print(t.pos())
```

Como veréis la tortuga recorrerá los 250 píxeles dibujando una bonita línea verde, y nos dirá que se encuentra en el punto (250, 0).

Ahora si le decimos que avance hacia arriba 250 píxeles más deberíamos ser capaces de llegar a la esquina superior derecha del lienzo. Para ello le diremos que gire 90 grados a la izquierda antes de ir adelante de nuevo:

```python
t.forward(250)
t.left(90)
t.forward(250)
print(t.pos())
```

Como véis la tortuga llega a la esquina superior derecha, cuyo punto es (250, 250).

Ahora os planteo el ejercicio de encontrar los puntos de las otras tres esquinas e ir mostrándolos en la terminal con print, pausad el vídeo y cuando las tengáis continuad para ver la solución.

```python
print("Origen", t.pos())
t.forward(250)
t.left(90)
t.forward(250)
print("Esquina superior derecha", t.pos())
t.left(90)
t.forward(500)
print("Esquina superior izquierda", t.pos())
t.left(90)
t.forward(500)
print("Esquina inferior izquierda", t.pos())
t.left(90)
t.forward(500)
print("Esquina inferior derecha", t.pos())
```

<div class="img-content">
    <img src="{{cdn}}/turtle/img01.jpg"/>
</div>

**Segundo dibujo**

Ya hemos visto cómo ir hacia adelante con forward() y rotar a la izquierda con left(), pues también podemos ir hacia atrás con backward() y rotar a la derecha con right().

Además la tortuga puede o no dejar el rastro subiendo o bajando el lápiz que lleva. Con penup() lo levantamos para no dibujar, y con pendown() lo bajamos para seguir dibujando.

Sabiendo estas nuevas instrucciones os reto a dibujar un rectángulo de 400 píxeles de ancho por 300 de alto centrado en el lienzo de 500x500, es decir, deberéis levantar y bajar el lápiz cuando sea necesario para no mostrar el rastro.

```python
t.penup()
t.forward(200)  # nos posicionamos a la derecha
t.pendown()
t.left(90)
t.forward(150)  # dibujamos la mitad hacia arriba
t.left(90)
t.forward(400)
t.left(90)
t.forward(300)
t.left(90)
t.forward(400)
t.left(90)
t.forward(150)  # última mitad hacia arriba
```

<div class="img-content">
    <img src="{{cdn}}/turtle/img02.jpg"/>
</div>

**Tercer dibujo**

A partir de ahora el tema se pone interesante de verdad, vamos a incorporar algo de programación estructurada a nuestros dibujos para hacer cosas sorprendentes.

Empecemos por una función.

Crear un cuadrado o un rectángulo es algo bastante común, así que podemos crear una función rectangulo() con las instrucciones básicas a partir de una anchura, una altura y una coordenada para su centro.

Para redondearlo introduciremos el uso de la acción goto(), que le indica a la tortuga que vaya a una coordenada en específico de forma automática, y la acción seth() que le establece una dirección en grados hacia dónde mirar, siendo 0 a la derecha, 90 arriba, 180 a la izquierda y 270 abajo.

```python
def rectangulo(px, py, ancho, alto):

    # Nos posicionamos en la esquina superior derecha
    # del rectángulo que vamos a dibujar sin dejar rastro
    # y miramos hacia la izquierda para empezar siempre igual

    t.penup()
    t.goto(px + ancho / 2, py + alto / 2)
    t.seth(180)
    t.pendown()

    # Dibujamos la estructura

    t.forward(ancho)
    t.left(90)
    t.forward(alto)
    t.left(90)
    t.forward(ancho)
    t.left(90)
    t.forward(alto)
    t.left(90)

rectangulo(0, 0, 400, 300)
rectangulo(0, 0, 300, 200)
rectangulo(0, 0, 150, 100)
rectangulo(0, 0, 100, 50)
```

Fácil, rápido y para toda la família.

*Cuarto dibujo*

¿Sabéis lo que son los poligonos regulares? Son polígonos cuyos lados y ángulos interiores son iguales entre sí. La magia que tienen es que cuantos más lados tienen más se parecen a un círculo, y de hecho dícese que un círculo perfecto sería un polígono de infinitos lados. De ahí que en geometría se trabaje tanto con límites.

Bueno, sea como sea creo que es interesante adaptar nuestra función para que no sólo dibuje cuadrados y rectángulos, sino cualquier tipo de polígono regular.

Para ello le pasaremos un parámetro extra con el número de costados que queremos dibujar, y en lugar de un ancho y una altura simplemente utilizaremos un radio. Ese radio nos servirá para crear la circunferencia circunscrita que será la base del polígono regular, que por cierto, podemos crear utilizando la acción circle de la tortuga, que toma precisamente ese radio. Fijaros:

```python
def poligono_regular(px, py, radio, lados):
    t.penup()
    t.goto(px, py - radio)
    t.pendown()
    t.circle(radio)

poligono_regular(0, 0, 100, 7)
```

<div class="img-content">
    <img src="{{cdn}}/turtle/img04.jpg"/>
</div>

Ahora tenemos que calcular los grados que debemos girar y trazar nuestras líneas. En el caso del cuadrado era muy fácil, pues sabemos que hay que girar 90 grados. ¿Pero cómo lo haremos aquí? Bueno, sabemos que 90º es una cuarta parte de 360, así que extrapolando eso podemos calcular el ángulo dividiendo 360 entre el número de lados del polígono regular:
angulo = 360 / lados
print(angulo)

Sabiendo el ángulo, podemos posicionarnos en el centro de nuestro círculo y trazar líneas hacia fuera con la longitud del radio tantas veces como lados tenemos mientras vamos incrementando el ángulo que hemos conseguido. Fijaros:

```python
angulo = 360 / lados
print(angulo)

for i in range(lados):
    t.penup()           # Nos posicionamos al centro
    t.goto(px, py)
    t.pendown()

    t.seth(angulo*i+1)  # Trazamos radios hacia afuera
    t.forward(radio)
    print( t.pos() )
```

<div class="img-content">
    <img src="{{cdn}}/turtle/img05.jpg"/>
</div>

Woo! Que bonito quesito nos ha quedado eh? Pero lo más importante es que tenemos todas las coordenadas de los vértices de nuestro polígono:

Podríamos almacenarlas en una lista:

```python
vertices = []  # La declaramos

for i in range(lados):
    t.penup()
    t.goto(px, py)
    t.pendown()

    t.seth(angulo*i+1)
    t.forward(radio)
    vertices.append(t.pos())  # Los vamos añadiendo
```

Y ahora viene la magia.
Vamos a hacer que la tortuga trace líneas entre esos vértices yendo de unos a otros utilizando la acción goto:

```python
# Nos posicionamos en la coordenada del último vértice
t.penup()
t.goto(vertices[-1])
t.pendown()

# Y hacemos que la tortuga se mueva a cada uno de ellos
for v in vertices:
    t.goto(v)
```

<div class="img-content">
    <img src="{{cdn}}/turtle/img07.jpg"/>
</div>

¡Siiii y ahí lo tenemos!

Sólo deberíamos hacer algunos ajustes a nuestro programa para que la tortuga sólo dibuje los costados:

```python
def poligono_regular(px, py, radio, lados):

    # Desactivamos el trazo
    t.penup()

    # Calculamos el ángulo
    angulo = 360 / lados
    print(angulo)

    # Creamos la lista para almacenar los vértices
    vertices = []

    for i in range(lados):
        t.goto(px, py)
        t.seth(angulo*i+1)
        t.forward(radio)
        vertices.append(t.pos())

    # Nos posicionamos en la coordenada del último vértice
    t.goto(vertices[-1])

    # Empezamos a dibujar
    t.pendown()

    # Y hacemos que la tortuga se mueva a cada uno de ellos
    for v in vertices:
        t.goto(v)
```

<div class="img-content">
    <img src="{{cdn}}/turtle/img08.jpg"/>
</div>

¡Genial!

Evidentemente hay otras formas de hacerlo, pero lo interesante es que hemos conseguido que la tortuga trabaje por nosotros y busque todos los vértices para trazar el polígono.

Lo bueno es que podemos juguetear un montón utilizando bucles por ejemplo:

```python
# Hacemos que la tortuga se mueva muy rápido y dibujamos
# los polígonos regulares de 3 a 20 costados
t.speed(200)
for n in range(3, 21):
    poligono_regular(0, 0, n*10, n)
```

<div class="img-content">
    <img src="{{cdn}}/turtle/img09.jpg"/>
</div>

Sin duda nuestra tortuga está hecha toda una artista.

Por cierto, ¿os habéis fijado que cuantos más costados, más se parece a una redonda? Es lo que os decía al principio.

**Quinto dibujo**

Finalmente un último experimento para añadir interactividad en tiempo real. Y es que nosotros podemos capturar por teclado un valor con el método textinput() de la tortuga y hacer que se mueva a nuestra voluntad a partir de varias condiciones:

```python
def ordenar():

    orden = t.textinput("Orden requerida",
                        "Movimientos: a w s d - Salir: e")

    if orden == "d":
        t.seth(0)
    elif orden == "w":
        t.seth(90)
    elif orden == "a":
        t.seth(180)
    elif orden == "s":
        t.seth(270)
    elif orden == "e":
        t.bye()  # cerramos la ventana
    else:
        return   # si no es una opción retornamos

    t.forward(50)


while True:
    ordenar()

t.done()
t.bye()
```

<div class="img-content">
    <img src="{{cdn}}/turtle/img10.jpg"/>
</div>

Al añadir interactividad somos nosotros quienes controlamos a la tortuga en tiempo real, hemos creado un videojuego sin saberlo! ¿Qué os parece?

Ahora imaginad que no tuviéramos que presionar constantemente enter al introducir nuestras órdenes. Para conseguirlo haremos lo siguiente:

```python
import turtle as t

t.setup(500,500)

t.shape("turtle")
t.color("green")

# Creamos funciones para cada acción
def derecha():
    t.seth(0)
    t.forward(20)

def izquierda():
    t.seth(180)
    t.forward(20)

def arriba():
    t.seth(90)
    t.forward(20)

def abajo():
    t.seth(270)
    t.forward(20)

def salir():
    t.bye()

# Enlazamos cada función a una tecla
t.onkey(arriba, "w")
t.onkey(izquierda, "a")
t.onkey(derecha, "d")
t.onkey(abajo, "s")
t.onkey(salir, "e")

# Hacemos que tortuga esté atenta al teclado
t.listen()

t.done()
t.bye()
```

<div class="img-content">
    <img src="{{cdn}}/turtle/img11.jpg"/>
</div>

**Bibliografía**

- [Introducción visual a Python](https://hourofpython.com/una-introduccion-visual-a-python/index.html): Minicurso de Python gráfico 100% en español utilizando Turtle.
- [Documentación oficial](https://docs.python.org/3.6/library/turtle.html): El mejor lugar para aprender todas las funcionalidades de la tortuga.

---

<small class="edited"><i>Última edición: 19 de Marzo de 2021</i></small>
