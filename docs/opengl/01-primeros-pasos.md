title: Primeros pasos | OpenGL en Python | Hektor Profe
description: Primeros pasos con OpenGL en Python

# Primeros pasos en OpenGL

Lo primero es preparar el entorno, necesitamos `PyGame` y `PyOpenGL`:

```bash
pip install PyGame PyOpenGL PyOpenGL_accelerate
```

En este proyecto tendré ficheros de recursos comunes en el directorio `res`, para cargar un módulo desde ahí necesitaré añadir el directorio anterior al path del sistema de esta forma:

```python
sys.path.append('..')
from res.Cube import wireCube
```

Es importante tenerlo en cuenta porque editores como _VSC_ formatean al guardar los ficheros y modifican el orden de las importaciones. Esto se puede evitar con un par de clásulas:

```json
"python.formatting.autopep8Args": ["--ignore","E402"],
"python.linting.pycodestyleArgs": ["--disable=E402"],
```

## Hola mundo cúbico

Empecemos con una prueba, en lugar de hacer un _Hola mundo_ voy a importar un cubo cuyos vértices y triángulos se han definido en el fichero `Cube.py`:

```python
from OpenGL.GL import *

vertices = [(0.5, -0.5, 0.5), (-0.5, -0.5, 0.5), (0.5, 0.5, 0.5), (-0.5, 0.5, 0.5), (0.5, 0.5, -0.5), (-0.5, 0.5, -0.5), (0.5, -0.5, -0.5), (-0.5, -0.5, -0.5), (0.5, 0.5, 0.5), (-0.5, 0.5, 0.5), (0.5, 0.5, -0.5), (-0.5, 0.5, -0.5),
            (0.5, -0.5, -0.5), (0.5, -0.5, 0.5), (-0.5, -0.5, 0.5), (-0.5, -0.5, -0.5), (-0.5, -0.5, 0.5), (-0.5, 0.5, 0.5), (-0.5, 0.5, -0.5), (-0.5, -0.5, -0.5), (0.5, -0.5, -0.5), (0.5, 0.5, -0.5), (0.5, 0.5, 0.5), (0.5, -0.5, 0.5)]
triangles = [0, 2, 3, 0, 3, 1, 8, 4, 5, 8, 5, 9, 10, 6, 7, 10, 7, 11, 12,
             13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]


def wireCube():
    for t in range(len(triangles) - 3):
        glBegin(GL_LINES)
        glVertex3fv(vertices[triangles[t]])
        glVertex3fv(vertices[triangles[t + 1]])
        glVertex3fv(vertices[triangles[t + 2]])
        glEnd()
        t += 3
```

Esto lo importaré en mi primer script de ejemplo en el directorio `src`:

```python
import sys
import pygame
from pygame.locals import *
from OpenGL.GLU import *
from OpenGL.GL import *
sys.path.append('..')
from res.Cube import wireCube

pygame.init()

# Project settings
screen_width = 900
screen_height = 600
background_color = (0, 0, 0, 1)
drawing_color = (1, 1, 1, 1)

screen = pygame.display.set_mode(
    (screen_width, screen_height), DOUBLEBUF | OPENGL)

clock = pygame.time.Clock()


def initialise():
    glClearColor(background_color[0], background_color[1],
                 background_color[2], background_color[3])
    glColor(drawing_color)

    # Projection
    glMatrixMode(GL_PROJECTION)
    glLoadIdentity()
    gluPerspective(60, (screen_width / screen_height), 0.1, 100.0)

    # Model View
    glMatrixMode(GL_MODELVIEW)
    glTranslate(0, 0, -5)
    glLoadIdentity()
    glViewport(0, 0, screen.get_width(), screen.get_height())
    glEnable(GL_DEPTH_TEST)
    glTranslate(0, 0, -2)


def display():
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    glRotatef(1, 10, 0, 1)
    glPushMatrix()
    wireCube()
    glPopMatrix()


done = False
initialise()
while not done:
    clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
    display()
    pygame.display.flip()
    pygame.display.set_caption(f"{clock.get_fps():.0f} fps")
pygame.quit()
```

![]({{cdn}}/opengl/anim01.gif)

Confirmamos que todo funciona y podemos pasar a lo siguiente.

## Ventana básica con PyGame

Todo lo que se voy a implementar durante las siguientes prácticas sobre OpenGL utiliza el entorno gráfico de PyGame como base. Tengo unos [apuntes geniales sobre esta biblioteca](/pygame/) así que no profundizaré mucho a parte de algunos comentarios de código:

```python
# Importamos la biblioteca gráfica
import pygame
# Importamos las definiciones locales
from pygame.locals import *

# Iniciamos PyGame
pygame.init()

# Configuramos el tamaño de la pantalal (ventana mejor dicho)
screen_width = 900
screen_height = 600

# Iniciamos La pantalla con los tamaños, doble buffer y opengl
screen = pygame.display.set_mode((screen_width, screen_height), DOUBLEBUF | OPENGL)

# Poedmos cambiar el título
pygame.display.set_caption("OpenGL en Python")

# Variable de control del bucle gráfico
done = False
while not done:
    # Procesamiento de las entradas
    for event in pygame.event.get():
        # El botón de salir finaliza el bucle
        if event.type == pygame.QUIT:
            done = True

    # Copiamos el contenido renderizado al segundo buffer
    pygame.display.flip()
    # Esperamos unos milisegundos para no saturar el procesador
    pygame.time.wait(100)

# Finalmente salimos de PyGame
pygame.quit()
```

![]({{cdn}}/opengl/img01.png)

## Conceptos básicos de OpenGL

OpenGL es una API gráfica para utilizar la GPU con el objetivo de realizar cálculos de renderizado en tiempo real y devolverlos al buffer de la memoria de vídeo de la máquina.

Las llamadas ocurren a bajo nivel y se pueden utilizar para programar sistemas gráficos y motores de videojuegos.

Si comparamos el código para dibujar un simple rectángulo con PyGame:

```python
pygame.draw.rect(screen, blue, 0, 0, 100, 50)
```

Con las llamadas para hacer el mismo rectángulo con OpenGL:

```python
glColor3f(color)
glBegin(GL_POLYGON)
    glVertex2x(0, 0)
    glVertex2x(0, 50)
    glVertex2x(100, 50)
    glVertex2x(100, 0)
glEnd()
```

Pues ya vemos que el proceso es mucho más largo, requiere establecer el color, definir un tipo de dibujado y cada vértice del objeto uno por uno.

Evidentemente es más difícil de aprender pero tiene la ventaja de que el programador tiene total control sobre lo que quiere dibujar. Conocer cómo funciona el renderizado a bajo nivel abre las puertas a todo tipo de posibilidades, introduciendo construcciones matemáticas que constituyen los fundamentos de todos los motores gráficos y los programas de modelado.

Lo bueno de la **estructura de las instrucciones** de OpenGL es que sus nombres son autoexplicativos. Solo con leer `glVertex2i` podemos determinar la librería `gl` (hay otras como `glu`), el comando `Vertex` para crear un vértice, el número `2` hace referencia a la cantidad de argumentos de la función y por último `i` es el tipo del argumento (en este caso enteros _integer_). Como vemos la utilización viene en cierta forma explicada en el propio nombre.

En cuanto a la **estructura de un programa** que utiliza OpenGL, el proceso se gestiona en serie y el bucle gráfico sería:

1. Manejar las entradas.
2. Limpiar la pantalla.
3. Establecer los colores.
4. Dibujar los objetos.
5. Intercambiar los buffers.

Lo interesante aquí es acerca de esos "buffers", recordemos que el programa de PyGame se establece con doble buffer. Un buffer contiene los pixels resultantes del renderizado, mientras éste se muestra por pantalla, el siguiente ciclo se renderiza en el otro buffer y cuando está listo se intercambia por el primer buffer, lo cual permite devolver una salida constante.

En cualquier caso vamos a importar las bibliotecas de OpenGL y a dibujar alguna cosa en 2D. Este dibujado se realiza con una perspectiva ortográfica, una forma de renderizar donde la brecha de perspectiva no se tiene en cuenta:

```python
import pygame
from pygame.locals import *

# Cargamos las bibliotecas de OpenGL
from OpenGL.GL import *
from OpenGL.GLU import *

pygame.init()

screen_width = 900
screen_height = 600

screen = pygame.display.set_mode(
    (screen_width, screen_height), DOUBLEBUF | OPENGL)
pygame.display.set_caption("OpenGL en Python")

# https://docs.microsoft.com/es-es/windows/win32/opengl/glmatrixmode
glMatrixMode(GL_PROJECTION)
# https://docs.microsoft.com/es-es/windows/win32/opengl/glloadidentity
glLoadIdentity()
# https://docs.microsoft.com/es-es/windows/win32/opengl/gluortho2d
gluOrtho2D(0, 600, 0, 400)

done = False
while not done:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True

    # https://docs.microsoft.com/es-es/windows/win32/opengl/glclear
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    glMatrixMode(GL_MODELVIEW)
    glLoadIdentity()

    # https://docs.microsoft.com/es-es/windows/win32/opengl/glpointsize
    glPointSize(10)
    # https://docs.microsoft.com/es-es/windows/win32/opengl/glbegin
    glBegin(GL_POINTS)
    # https://docs.microsoft.com/es-es/windows/win32/opengl/glvertex2i
    glVertex2i(10, 10)
    glVertex2i(590, 390)
    # https://docs.microsoft.com/es-es/windows/win32/opengl/glend
    glEnd()

    pygame.display.flip()
    pygame.time.wait(100)

pygame.quit()
```

![]({{cdn}}/opengl/img02.png)

Puntos importantes a comentar, antes de iniciar el bucle creamos una configuración del espacio de dibujo:

- Establecemos el modo matriz a `GL_PROJECTION`, eso hará que las posteriores operaciones de matriz se apliquen como proyecciones en el espacio de imagen (2D).
- Establecemos la matriz de identidad, que pese a no ser necesario es una buena práctica. Recordemos que las transformaciones se realizan multiplicando matrices, establecer inicialmente la matriz de identidad equivale a establecer el número `1`.
- Finalmente configuramos el espacio ortográfico 2D con un tamaño de 600x400 píxeles.

Durante el bucle gráfico, en cada iteración:

- Reiniciamos el buffer de color y el de profundidad. Por ahora no es estrictamente necesario pero es importante. El primero maneja los píxeles a dibujar en la pantalla (como un lienzo), el segundo la profundidad de cada vértice para poder realizar la brecha de perspectiva.
- Luego cargamos el modo matriz `GL_MODELVIEW` para aplicar las posteriores operaciones de matrices en la vista de modelo, es decir, que afecten al espacio tridimensional.
- Reiniciamos de nuevo a la matriz de identidad, aunque no es necesario.
- Preparamos el tamaño del radio de un punto en píxeles.
- Empezamos el ciclo de dibujado de los puntos, los dibujamos y lo finalizamos.

Es importando comentar también como el OpenGL maneja las coordenadas. Éstas empiezan con el punto `(0,0)` en la esquina inferior izquierda y crecen en diagonal hasta la esquina superior derecha. Además el tamaño del espacio de dibujo se escala al de la ventana de PyGame, razón por la cuál los puntos se encuentran en ambas esquinas.

## Aplicación reutilizable con clases

Como hemos visto un programa con OpenGL escala de tamaño muy rápido, por eso he decidido implementar una estructura de aplicación reutilizable donde podamos centrarnos en la implementación de la lógica y abstraer todo el tema de gestionar la ventana de PyGame. Es algo que muestro en [mis apuntes](/pygame) así que me limitaré a facilit el cascarón y explicar su uso:

La clase `App` contiene la información de la aplicación, su objeto es servir como clase base o interfaz sobre la que crear nuestra aplicación gráfica:

```python
import sys
import pygame as pg
from pygame.locals import *


class App:
    def __init__(self, title, width, height, maxFps):
        pg.init()
        self.title, self.maxFps = title, maxFps
        self.screenWidth, self.screenHeight = width, height
        self.display = pg.display.set_mode((width, height), DOUBLEBUF | OPENGL)
        self.clock = pg.time.Clock()

    def Run(self):

        self.Init()   # initial members
        self.Setup()  # initial configs

        while 1:
            self.events = pg.event.get()
            for event in self.events:
                if event.type == pg.QUIT:
                    sys.exit()

            self.deltaTime = self.clock.tick(self.maxFps) / 1000

            self.Inputs()  # frame inputs
            self.Update()  # frame logic
            self.Render()  # frame drawing

            pg.display.flip()
            pg.display.set_caption(
                f"{self.title} ({self.clock.get_fps():.2f} fps)")

    def Init(self):
        pass

    def Setup(self):
        pass

    def Inputs(self):
        pass

    def Update(self):
        pass

    def Render(self):
        pass
```

Para utilizarla solo debemos importarla y sobreescribirla con nuestra propia estructura de forma similar a esta:

```python
import sys
sys.path.append('..')
from res.App import App
from OpenGL.GL import *
from OpenGL.GLU import *

class GLApp(App):
    pass

if __name__ == '__main__':
    app = GLApp("OpenGL en Python", 900, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/img03.png)

En los métodos `Setup`, `Update` y `Render` podemos programar toda la lógica de los ejemplos, además podemos establecer la configuración de la ventana, el título, el tamaño y un límite de FPS que se controlara internamenta y mostrará los FPS medios al lado del título. También contaremos con la variable `self.deltaTime` para saber en cualquier momento el tiempo en milisegundos que pasa entre cada fotograma, lo cual nos permitirá trabajar en función del tiempo.

El ejemplo que veníamos haciendo de los puntos quedará de la siguiente forma:

```python
import sys
sys.path.append('..')
from res.App import App
from OpenGL.GL import *
from OpenGL.GLU import *


class GLApp(App):

    def Setup(self):
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        gluOrtho2D(0, 600, 0, 400)

    def Render(self):
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()
        glPointSize(10)
        glBegin(GL_POINTS)
        glVertex2i(10, 10)
        glVertex2i(590, 390)
        glEnd()


if __name__ == '__main__':
    app = GLApp("OpenGL en Python", 900, 600, 60)
    app.Run()
```

Lo mejor es que podemos empezar a juguetear con OpenGL y crear diferentes métodos o funciones externas (depende de lo que prefiramos) para implementar funcionalidades reutilizables, por ejemplo iniciar el modo ortogonal o dibujar un punto en un lugar:

```python
import sys
sys.path.append('..')
from res.App import App
from OpenGL.GL import *
from OpenGL.GLU import *


class GLUtils:

    @staticmethod
    def InitOrtho(left, right, top, bottom):
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        gluOrtho2D(left, right, top, bottom)

    @staticmethod
    def DrawPoint(x, y, size):
        glPointSize(size)
        glBegin(GL_POINTS)
        glVertex2i(x, y)
        glEnd()


class GLApp(App):

    def Setup(self):
        GLUtils.InitOrtho(0, 600, 0, 400)

    def Render(self):
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()
        GLUtils.DrawPoint(150, 200, 5)
        GLUtils.DrawPoint(300, 100, 15)
        GLUtils.DrawPoint(450, 300, 10)


if __name__ == '__main__':
    app = GLApp("OpenGL en Python", 900, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/img04.png)

¿Véis por donde va la idea? Podemos ajustar el código de OpenGL para ejecutarlo de la manera que nos convenga.

Por cierto, ¿recordáis que el espacio se dibuja de la esquina inferior izquierda hacia la esquina superior derecha? Eso es porque hemos configurado el modo ortográfico de esa forma. Si en lugar de `GLUtils.InitOrtho(0, 600, 0, 400)` establecemos `GLUtils.InitOrtho(600, 0, 400, 0)` obtendremos el resultado inverso verticalmente, pues se renderiza partiendo de la esquina superior derecha hasta la esquina inferior izquierda:

![]({{cdn}}/opengl/img05.png)

Incluso podríamos voltear solo uno de los ejes, por ejemplo el horizontal para empezar en la esquina superior izquierda y crecer en diagonal hasta la esquina inferior derecha GLUtils.`InitOrtho(0, 600, 400, 0)`:

![]({{cdn}}/opengl/img06.png)

Como vemos OpenGL nos permite adaptar el eje de coordenadas de la forma como mejor nos convenga.

---

<small class="edited"><i>Última edición: 12 de Junio de 2022</i></small>
