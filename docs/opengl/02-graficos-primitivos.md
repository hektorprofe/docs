title: Gráficos primitivos | OpenGL en Python | Hektor Profe
description: Gráficos primitivos con OpenGL en Python

# Gráficos primitivos en OpenGL

## Visualizando funciones

En el siguiente ejemplo vamos a utilizar `numpy` para generar un rango de valores entre dos números que utilizaremos como eje `x` y calcularemos el valor `y` aplicando las funciones seno y coseno:

```python
import sys
import math
import numpy as np
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
    def DrawGraph():
        glPointSize(5)
        glBegin(GL_POINTS)
        for px in np.arange(0, 15, 0.025):
            glColor3f(0, 0, 255)
            glVertex2f(px, math.sin(px))
            glColor3f(0, 255, 0)
            glVertex2f(px, math.cos(px))
        glEnd()


class OpenGLApp(App):

    def Setup(self):
        GLUtils.InitOrtho(0, 600, 400, 0)

    def Render(self):
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()
        GLUtils.DrawGraph()


if __name__ == '__main__':
    app = OpenGLApp("OpenGL en Python", 900, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/img07.png)

El caso es que el seno y el coseno son funciones cuya posición `y` siempre está entre `0` y `1`. Además estamos generando valores para `x` entre `0` y `15`, ajustemos el espacio de visualización para dibujarlo más de cerca:

```python
GLUtils.InitOrtho(0, 15, -1.5, 1.5)
```

![]({{cdn}}/opengl/img08.png)

## Visualizando puntos

En el siguiente ejemplo vamos a capturar la posición del ratón en la pantalla `(x,y)` al hacer clic y en ella vamos a dibujar un punto. Para almacenarlo definiremos una nueva clase `Point`:

```python
class Point:
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y
```

Partiendo del ejemplo de haces un par de lecciones, definiremos un punto a nivel de instancia en el `Setup` cuyo valor asignaremos al detectar el clic del ratón sobrescribiendo el mètodo `Inputs`:

```python
import sys
import math
import pygame as pg
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
    def PrepareRender():
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()

    @staticmethod
    def DrawPoint(point, size):
        glPointSize(size)
        glBegin(GL_POINTS)
        glVertex2f(point.x, point.y)
        glEnd()


class OpenGLApp(App):

    def Init(self):
        # Creamos un punto
        self.point = None

    def Setup(self):
        # Configuramos un espacio ortográfico normalizado
        GLUtils.InitOrtho(0, 600, 400, 0)

    def Inputs(self):
        for event in self.events:
            if event.type == pg.MOUSEBUTTONDOWN:
                # Recuperamos la posición del ratón
                x, y = pg.mouse.get_pos()
                # Creamos un punto con la posición
                self.point = Point(x, y)

    def Render(self):
        GLUtils.PrepareRender()
        # Si hay un punto lo dibujamos
        if self.point is not None:
            GLUtils.DrawPoint(self.point, 5)


if __name__ == '__main__':
    app = OpenGLApp("OpenGL en Python", 900, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/anim02.gif)

Os fijaréis que el punto clicado y el dibujado no concuerdan, evidentemente el problema está en que el tamaño de la ventana de PyGame y el espacio de dibujo de `OpenGL` son distintos, podríamos equipararlos:

```python
GLUtils.InitOrtho(0, 900, 600, 0)
```

Otra cosa que podemos hacer es almacenar varios puntos en una lista y dibujarlos todos de golpe:

```python
class GLUtils:

    @staticmethod
    def DrawPoints(points, size):
        glPointSize(size)
        glBegin(GL_POINTS)
        for point in points:
            glVertex2f(point.x, point.y)
        glEnd()


class OpenGLApp(App):

    def Init(self):
        # Creamos una lista de puntos
        self.points = []

    def Inputs(self):
        for event in self.events:
            if event.type == pg.MOUSEBUTTONDOWN:
                # Recuperamos la posición del ratón
                x, y = pg.mouse.get_pos()
                # Creamos un punto con la posición
                point = Point(x, y)
                # Lo añadimos a la lista de puntos
                self.points.append(point)

    def Render(self):
        GLUtils.PrepareRender()

        # Dibujamos todos los puntos
        GLUtils.DrawPoints(self.points, 5)
```

Es importante separar la función de dibujar un punto y la de dibujar muchos de golpe para optimizar el renderizado.

![]({{cdn}}/opengl/anim03.gif)

## Mapeado de puntos

En el ejemplo anterior hemos visto cómo adaptar el espacio de renderizado a la ventana de PyGame solventaba el problema de dibujar los puntos en el lugar adecuado, sin embargo en el mundo de los gráficos los vectores suelen venir normalizados con valores entre `-1` y `1`.

En este ejemplo vamos a mapear los valores del clic del ratón para dibujar sobre un espacio normalizado entre `0` y `1`, así que tomando el ejemplo anterior podemos establecer ese espacio:

```python
# Configuramos un espacio ortográfico normalizado
GLUtils.InitOrtho(0, 1, 1, 0)
```

Ahora voy a crear un método para mapear el punto, es decir, adaptarlo en un rango específo. Por ejemplo, si la posición el ratón se encuentra en `(300, 200)`, justo en mitad de la ventana, la función de mapeado entre `0` y `1` deberá devolver `(0.5, 0.5)`. Lo conseguiremos multiplicando el valor por el factor de redimensión (la relación entre los tamaños de los ejes):

```python
@staticmethod
def MapValue(currentMin, currentMax, newMin, newMax, value):
    mapFactor = (newMax - newMin) / (currentMax - currentMin)
    return value * mapFactor
```

Después de capturar el punto lo mapeamos para adaptarlo al espacio:

```python
def Inputs(self):
    for event in self.events:
        if event.type == pg.MOUSEBUTTONDOWN:
            # Recuperamos la posición del ratón
            x, y = pg.mouse.get_pos()
            # Creamos un punto con la posición mapeada
            point = Point(GLUtils.MapValue(0, 600, 0, 1, x),
                          GLUtils.MapValue(0, 400, 0, 1, y))
            # Lo añadimos a la lista de puntos
            self.points.append(point)
```

![]({{cdn}}/opengl/anim04.gif)

Sería muy útil almacenar el tamaño del espacio ortográfico en la clase para añadir flexibilidad al código. Podemos hacerlo sobreescribiendo el `Init` que se llama antes del `Setup` y está pensado como lugar para inicializar valores:

```python
class OpenGLApp(App):

    def Init(self):
        self.ortoWidth, self.ortoHeight = 1, 1

    def Setup(self):
        GLUtils.InitOrtho(0, self.ortoWidth, self.ortoHeight, 0)
```

Así al llamar las funciones de mapeado podemos pasar estos valores dinámicamente

```python
point = Point(GLUtils.MapValue(0, self.screenWidth, 0, self.ortoWidth, x),
              GLUtils.MapValue(0, self.screenHeight, 0, self.ortoHeight, y))
```

## Dibujado de líneas

Continuando con el ejemplo anterior vamos a añadir un nuevo método exactamente igual que `DrawPoints` pero llamado `DrawLines` donde cambiaremos el tipo de renderizado de `GL_POINTS` a `GL_LINES`:

```python
@staticmethod
def DrawLines(points, size):
    glPointSize(size)
    glBegin(GL_LINES)
    # Antes de dibujar el punto mapeamos su posición
    for point in points:
        glVertex2f(point.x, point.y)
    glEnd()
```

Si lo llamamos justo después de `DrawPonts` OpenGL trazará una línea cada dos puntos:

```python
def Render(self):
    GLUtils.PrepareRender()
    GLUtils.DrawPoints(self.points, 5)
    GLUtils.DrawLines(self.points, 1)
```

![]({{cdn}}/opengl/anim05.gif)

Sin embargo, si cambiamos el modo a `GL_LINE_LOOP` trazará líneas contínuas entre cada nuevo vértice y el anterior:

```python
glBegin(GL_LINE_LOOP)
```

![]({{cdn}}/opengl/anim06.gif)

Siempre unirá el último vértice con el primero para intentar crear una especie de polígono, pero eso podemos evitarlo cambiando el modo a `GL_LINE_STRIP`:

```python
glBegin(GL_LINE_STRIP)
```

![]({{cdn}}/opengl/anim07.gif)

Con algo de ingenio, detectando cuando estamos presionando un botón del ratón con `MOUSEBUTTONDOWN` y `MOUSEBUTTONUP` más el evento `MOUSEMOTION` para detectar el movimiento, podemos crear una pequeña aplicación para dibujar:

```python
class OpenGLApp(App):

    def Init(self):
        self.mouseDown = False

    def Inputs(self):
        for event in self.events:
            # Detectamos cando presionamos el ratón
            if event.type == pg.MOUSEBUTTONDOWN:
                self.mouseDown = True
            # Detectamos cando dehamos de presionarlo
            elif event.type == pg.MOUSEBUTTONUP:
                self.mouseDown = False
            # Si se mueve y estamos presionando guardamos los puntos
            elif event.type == pg.MOUSEMOTION and self.mouseDown:
                x, y = pg.mouse.get_pos()
                point = Point(GLUtils.MapValue(0, self.screenWidth, 0, self.ortoWidth, x),
                              GLUtils.MapValue(0, self.screenHeight, 0, self.ortoHeight, y))
                self.points.append(point)
```

![]({{cdn}}/opengl/anim08.gif)

El problema que al dejar de presionar y volver a hacerlo el último punto y el nuevo también se unen. ¿Cómo podríamos evitar que se unan? Pues podríamos crear un nuevo tipo llamado `Line` formado por una lista independiente con puntos:

```python
class Line:
    def __init__(self):
        self.points = []
```

Si en lugar de almacenar los puntos en una lista común lo hacemos en una línea que empieza y acaba al presionar y dejar de presionar el ratón, entonces tendremos diferentes trazos:

```python
def Init(self):
    self.currentLine = None
    self.lines = []

def Inputs(self):
    for event in self.events:
        if event.type == pg.MOUSEBUTTONDOWN:
            self.mouseDown = True
            # Creamos una línea y la añadimos a la lista
            self.currentLine = Line()
            self.lines.append(self.currentLine)
        elif event.type == pg.MOUSEBUTTONUP:
            self.mouseDown = False
        elif event.type == pg.MOUSEMOTION and self.mouseDown:
            x, y = pg.mouse.get_pos()
            point = Point(GLUtils.MapValue(0, self.screenWidth, 0, self.ortoWidth, x),
                          GLUtils.MapValue(0, self.screenHeight, 0, self.ortoHeight, y))
            # Almacenamos el punto en la línea actual
            self.currentLine.points.append(point)
```

Le pasamos todas las líneas a la función `DrawLines`:

```python
def Render(self):
    GLUtils.PrepareRender()
    GLUtils.DrawLines(self.lines, 1)
```

Y las procesamos por separado:

```python
@staticmethod
def DrawLines(lines, size):
    glPointSize(size)
    for line in lines:
        glBegin(GL_LINE_STRIP)
        for point in line.points:
            glVertex2f(point.x, point.y)
        glEnd()
```

![]({{cdn}}/opengl/anim09.gif)

## Guardado y carga en un fichero

En esta práctica vamos a extender el código anterior para guardar y cargar el dibujo en un fichero siguiendo una estructura específica.

Hay mil y una formas de escribir y leer datos, yo me voy a decantar por guardar la información en un fichero `json`:

```python
import json

def WriteFile(self):
    data = []
    # Creamos la estructura json sin objetos
    for line in self.lines:
        points = []
        for point in line.points:
            points.append([point.x, point.y])
        data.append(points)
    # Escribimos la estructura en el fichero
    with open("lines.json", "w") as file:
        json.dump(data, file)
    print("Fichero guardado correctamente")
```

Ejecutamos el método al presionar la tecla `G`:

```python
if event.type == pg.KEYDOWN:
    if event.key == pg.K_g:
        self.WriteFile()
```

Crearemos otro método que lea el contenido al presionar la tecla `C`:

```python
elif event.key == pg.K_c:
    self.ReadFile()
```

Se trata del proceso inverso, recuperar la información estructurada en formato `json` y recrear la lista de líneas en `self.lines` con sus respectivos puntos `Point`:

```python
def ReadFile(self):
    # Leemos el fichero con las líneas
    with open("lines.json") as file:
        # Cargamos los datos en formato json
        data = json.load(file)
        # Recorremos las lineas cargadas
        for dataLine in data:
            # Creamos una línea vacía
            line = Line()
            # Para cada linea leída del fichero
            for point in dataLine:
                # Añadimos un nuevo punto
                line.points.append(Point(point[0], point[1]))
            # Vamos añadiendo las líneas con todos sus puntos
            self.lines.append(line)
    print("Fichero cargado correctamente")
```

Solo nos resta añadir una función para vaciar la lista de líneas al presionar por ejemplo la tecla espacio:

```python
elif event.key == pg.K_SPACE:
    self.lines.clear()
```

Ya tendremos una aplicación para dibujar, guardar y recuperar el dibujo:

![]({{cdn}}/opengl/anim10.gif)

## Polígonos, triángulos y quads

Retomando el anterior ejemplo del dibujado de líneas, vamos a aprovecharlo para introducir el dibujado de polígonos.

De hecho ya vimos que si activamos el modo `GL_LINE_LOOP` OpenGL cierra siempre el espacio entre el último vértice y el primero.

Si creamos un método `DrawPolygon` para dibujar puntos y activamos el modo `GL_POLYGON`, OpenGL rellenará el espacio entre los vértices:

```python
class GLUtils:

    # ...

    @staticmethod
    def DrawPolygon(points, size):
        glPointSize(size)
        glBegin(GL_POLYGON)
        for point in points:
            glVertex2f(point.x, point.y)
        glEnd()

class OpenGLApp(App):

    def Init(self):
        self.points = []

    def Inputs(self):
        for event in self.events:
            if event.type == pg.KEYDOWN:
                if event.key == pg.K_SPACE:
                    self.points.clear()
            if event.type == pg.MOUSEBUTTONDOWN:
                x, y = pg.mouse.get_pos()
                point = Point(GLUtils.MapValue(0, self.screenWidth, 0, self.ortoWidth, x),
                              GLUtils.MapValue(0, self.screenHeight, 0, self.ortoHeight, y))
                self.points.append(point)
    def Render(self):
        GLUtils.PrepareRender()
        GLUtils.DrawPolygon(self.points, 1)
```

![]({{cdn}}/opengl/anim11.gif)

Podríamos dibujar el polígono, los puntos y las líneas con otros colores:

```python
@staticmethod
def DrawPoints(points, size):
    glColor(1, 0, 0, 1) # rojo
    glPointSize(size)
    glBegin(GL_POINTS)
    for point in points:
        glVertex2f(point.x, point.y)
    glEnd()

@staticmethod
def DrawLine(points, size):
    glColor(1, 1, 1, 1) # blanco
    glPointSize(size)
    glBegin(GL_LINE_LOOP)
    for point in points:
        glVertex2f(point.x, point.y)
    glEnd()

@staticmethod
def DrawPolygon(points, size):
    glColor(0.2, 0.2, 0.2, 1) # gris
    glPointSize(size)
    glBegin(GL_POLYGON)
    for point in points:
        glVertex2f(point.x, point.y)
    glEnd()
    GLUtils.DrawLine(points, 3)
    GLUtils.DrawPoints(points, 5)
```

![]({{cdn}}/opengl/anim12.gif)

Es interesante observar ese efecto que se genera al no poder "encerrar" el polígono.

La verdad es que en lugar de un polígono podríamos decirle a OpenGL que intente dibujar primitivas como triángulos y cuadrados:

- `GL_TRIANGLES`
- `GL_TRIANGLES_STRIP`
- `GL_TRIANGLES_FAN`
- `GL_QUADS`
- `GL_QUADS_STRIP`

Si probamos con `GL_TRIANGLES`:

![]({{cdn}}/opengl/anim13.gif)

OpenGL supone que cada tres vértices se forma un triángulo, pero estos triángulos son independientes y como las líneas se dibujan en un bucle unas tras otras no se ajustan a ellos.

Lo podemos resolver dibujando las líneas en subconjuntos de tres vértices generados con `numpy`:

```python
@staticmethod
def DrawPolygon(points, size):
    glColor(0.2, 0.2, 0.2, 1)  # gris
    glPointSize(size)
    glBegin(GL_TRIANGLES)
    for point in points:
        glVertex2f(point.x, point.y)
    glEnd()
    # Dibujamos las líneas de tres en tres vértices
    for i in np.arange(0, len(points) - 2, 3):
        GLUtils.DrawLine([points[i], points[i + 1], points[i + 2]], 3)
    GLUtils.DrawPoints(points, 5)
```

![]({{cdn}}/opengl/anim14.gif)

Otro modo interesante es `GL_TRIANGLE_FAN`, éste intentará generar triángulos en forma de aspas de ventilador. No hace falta que dibujemos las líneas, solo observemos el resultado:

```python
@staticmethod
def DrawPolygon(points, size):
    glColor(0.2, 0.2, 0.2, 1) # gris
    glPointSize(size)
    glBegin(GL_TRIANGLE_FAN)
    for point in points:
        glVertex2f(point.x, point.y)
    glEnd()
    GLUtils.DrawPoints(points, 5)
```

![]({{cdn}}/opengl/anim15.gif)

De forma similar funciona el renderizado de cuadrados `GL_QUADS`, en estos deberíamos dibujar las líneas en subconjuntos de 4 vértices:

```python
@staticmethod
def DrawPolygon(points, size):
    glColor(0.2, 0.2, 0.2, 1)  # gris
    glPointSize(size)
    glBegin(GL_QUADS)
    for point in points:
        glVertex2f(point.x, point.y)
    glEnd()
    # Dibujamos las líneas de cuatro en cuatro vértices
    for i in np.arange(0, len(points) - 3, 4):
        GLUtils.DrawLine(
            [points[i], points[i + 1], points[i + 2], points[i + 3]], 3)
    GLUtils.DrawPoints(points, 5)
```

![]({{cdn}}/opengl/anim16.gif)

Los triángulos y los cuadrados son las primitivas básicas para el dibujado de mallas y constituyen la parte más esencial del renderizado de modelos tridimensionales.

---

<small class="edited"><i>Última edición: 12 de Junio de 2022</i></small>
