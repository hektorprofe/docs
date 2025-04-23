title: Trabajando con mallas | OpenGL en Python | Hektor Profe
description: Trabajando con mallas en OpenGL con Python

# Trabajando con mallas con OpenGL

Las mallas son conjuntos de primitivas (triángulos o quads) conocidos como caras que permiten modelar formas en el espacio. Cuantas más caras tenga el modelo más nivel de detalle representará:

![]({{cdn}}/opengl/img32.png)

Con el objetivo de optimizar el espacio, como muchas caras comparten vértices, todos estos vértices se definen en un array conocido como **Vertex Array**. A partir de los índices de esos vértices se crea otro array, "Triangle Array** o **Quad Array\*\* dependiendo del tipo de cara, que enumera conjuntos de `3` o `4` vértices para reconstruir las primitivas.

Cada vértice y tambien las propias caras en su centro, tienen un vector llamado **normal**. Este vector se encuentra normalizado en un rango de `-1` a `1` y representa la dirección hacia donde "miran" los vértices y la cara:

![]({{cdn}}/opengl/img33.png)

La normal es muy importante porque permite [descartar el renderizado](/docs/graficos-3d/11-back-face-culling/) de las caras no visibles por la cámara (_back-face culling_), así como añadir efectos de [luz y sombra](/docs/graficos-3d/18-luz-y-sombreado/) a las texturas en función del ángulo formado por la normal y la dirección del foco de luz.

## Estructura de una malla

En esta práctica vamos a implementar nuestra propia clase `Mesh` para almacenar la información de una malla y dibujarla:

```python
from OpenGL.GL import *
from OpenGL.GLU import *

class Mesh:
    def __init__(self, vertices, triangles, drawtype):
        self.vertices = vertices
        self.triangles = triangles
        self.drawtype = drawtype

    def Draw(self):
        # Dibujamos los vértices de tres en tres
        for i in range(0, len(self.triangles), 3):
            glBegin(self.drawtype)
            glVertex3fv(self.vertices[self.triangles[i]])
            glVertex3fv(self.vertices[self.triangles[i + 1]])
            glVertex3fv(self.vertices[self.triangles[i + 2]])
            glEnd()
```

Ahora en un programa base podemos crear una malla pasándole una configuración y la dibujamos en el `Render`:

```python
import sys
sys.path.append('..')
from res.App import App
from res.Mesh import Mesh
from OpenGL.GL import *
from OpenGL.GLU import *

class GLUtils:
    @staticmethod
    def PrepareRender():
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glLoadIdentity()


class OpenGLApp(App):
    def Init(self):
        self.mesh = Mesh(  # 6 vértices, 2 triángulos y modo loop de líneas
            [(0.5, -0.5, 0.5), (-0.5, -0.5, 0.5), (0.5, 0.5, 0.5),
             (-0.5, 0.5, 0.5), (0.5, 0.5, -0.5), (-0.5, 0.5, -0.5)],
            [0, 2, 3, 0, 3, 1], GL_LINE_LOOP)

    def Render(self):
        GLUtils.PrepareRender()
        self.mesh.Draw() # <----

if __name__ == '__main__':
    app = OpenGLApp("OpenGL en Python", 600, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/img34.png)

## Creando una clase cubo

En esta práctica vamos a extender la clase `Mesh` para construir y dibujar un cubo:

```python
class Cube(Mesh):
    def __init__(self, drawtype):
        self.vertices = [(0.5, -0.5, 0.5), (-0.5, -0.5, 0.5), (0.5, 0.5, 0.5), (-0.5, 0.5, 0.5), (0.5, 0.5, -0.5), (-0.5, 0.5, -0.5), (0.5, -0.5, -0.5), (-0.5, -0.5, -0.5), (0.5, 0.5, 0.5), (-0.5, 0.5, 0.5), (0.5, 0.5, -0.5), (-0.5, 0.5, -0.5),
                         (0.5, -0.5, -0.5), (0.5, -0.5, 0.5), (-0.5, -0.5, 0.5), (-0.5, -0.5, -0.5), (-0.5, -0.5, 0.5), (-0.5, 0.5, 0.5), (-0.5, 0.5, -0.5), (-0.5, -0.5, -0.5), (0.5, -0.5, -0.5), (0.5, 0.5, -0.5), (0.5, 0.5, 0.5), (0.5, -0.5, 0.5)]
        self.triangles = [0, 2, 3, 0, 3, 1, 8, 4, 5, 8, 5, 9, 10, 6, 7, 10, 7, 11, 12,
                          13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]
        self.drawtype = drawtype
```

En nuestro programa importaremos la clase, construimos el cubo y le indicamos el modo de dibujado:

```python
import sys
sys.path.append('..')
from res.App import App
from res.Mesh import *
from OpenGL.GL import *
from OpenGL.GLU import *

class GLUtils:
    @staticmethod
    def PrepareRender():
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glLoadIdentity()

class OpenGLApp(App):
    def Init(self):
        self.cube = Cube(GL_LINE_LOOP)

    def Render(self):
        GLUtils.PrepareRender()
        self.cube.Draw()


if __name__ == '__main__':
    app = OpenGLApp("OpenGL en Python", 600, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/img35.png)

A diferencia de antes ahora el cubo lo cruza otra línea diagonal. Claro, debemos tener en cuenta que este cubo ahora son tres dimensiones, necesitaremos rotarlo un poco para visualizar su perspectiva. Por ejemplo 15 grados en `x` e `y`:

```python
@staticmethod
def PrepareRender():
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    glLoadIdentity()
    # https://docs.microsoft.com/es-es/windows/win32/opengl/glRotatef
    glRotatef(15, 1, 1, 0)
```

![]({{cdn}}/opengl/img36.png)

Ahora ya podemos percibir la profundidad, pero... ¿No parece un poco raro? El tamaño de las caras del fondo es igual que las de adelante. Esto es debido a que no estamos aplicando una [brecha de perspectiva](/docs/graficos-3d/04-proyeccion-de-puntos/#proyeccion-perspectiva), es lo que se conoce como [proyección paralela oblícua](https://en.wikipedia.org/wiki/Oblique_projection):

![]({{cdn}}/opengl/img36b.png)

Lo que nosotros buscamos es establecer una proyección de perspectiva para simular esa profundidad en base a varios factores: un ángulo de punto de vista (_fov_), una relación de aspecto (_aspect ratio_) y las distancias del visor desde el [plano cercano del frustum](/docs/graficos-3d/27-clipping/#planos-del-frustum) (_znear_) hasta el plano alejado (_zfar_).

Es **muy importante** que configuremos la proyección antes de rotar el cubo:

```python
@staticmethod
    def PrepareRender():
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glLoadIdentity()
        # https://docs.microsoft.com/es-es/windows/win32/opengl/gluperspective
        gluPerspective(60, (600 / 600), 0.1, 100)
        glRotatef(15, 1, 1, 0)
```

![]({{cdn}}/opengl/img37.png)

Al aplicar la proyección en perspectiva inevitablemente tendremos en cuenta la profundidad de los elementos. Como OpenGL está dibujando el cubo en el origen del espacio `(0,0,0)` lo que estamos viendo es solo su cara trasera después de rotarlo ligeramente.

Si **después de rotarlo** trasladamos los vértices al fondo restando algo de profundidad y los centramos un poco deberíamos percibirlo proyectado con perspectiva:

```python
@staticmethod
    def PrepareRender():
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glLoadIdentity()
        gluPerspective(60, (600 / 600), 0.1, 100)
        glRotatef(15, 1, 1, 0)
        # https://docs.microsoft.com/es-es/windows/win32/opengl/glTranslate
        glTranslate(0.33, -0.33, -2)
```

![]({{cdn}}/opengl/img38.png)

La verdad es que tampoco necesitamos configurar la perspectiva, la rotación y la traslación en cada fotograma, podemos establecerlas una sola vez en la inicialización. Eso sí, no necesitamos cargar la matriz de identidad en cada fotograma porque al hacerlo reiniciaremos las transformaciones:

```python
class GLUtils:
    @staticmethod
    def InitRender():
        glLoadIdentity()
        # https://docs.microsoft.com/es-es/windows/win32/opengl/gluperspective
        gluPerspective(60, (600 / 600), 0.1, 100)
        # https://docs.microsoft.com/es-es/windows/win32/opengl/glRotatef
        glRotatef(15, 1, 1, 0)
        # https://docs.microsoft.com/es-es/windows/win32/opengl/glTranslate
        glTranslate(0.33, -0.33, -2)

    @staticmethod
    def PrepareRender():
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)


class OpenGLApp(App):
    def Init(self):
        GLUtils.InitRender()
        self.cube = Cube(GL_LINE_LOOP)

    def Render(self):
        GLUtils.PrepareRender()
        self.cube.Draw() # <----
```

Si ahora le decimos a OpenGL que rote los vértices antes de dibujarlos con un ángulo menor, rectificándolo por `deltaTime`, obtendremos la animación del cubo rotando:

```python
class OpenGLApp(App):
    def Render(self):
        GLUtils.PrepareRender()
        glRotatef(15 * self.deltaTime, 1, 1, 0)  # <----
        self.cube.Draw()
```

![]({{cdn}}/opengl/anim19.gif)

Y cambiando el modo a `GL_POLYGON` podremos dibujar el relleno del cubo de un color sólido:

```python
class OpenGLApp(App):
    def Init(self):
        GLUtils.InitRender()
        self.cube = Cube(GL_POLYGON)
```

![]({{cdn}}/opengl/anim20.gif)

Si añadimos un método `Debug` a nuestra clase Mesh podríamos dibujar unas líneas para visualizar las caras:

```python
class Mesh:
    def Debug(self):
        # Dibujamos los vértices de tres en tres
        glColor(0, 0, 0, 1)
        for i in range(0, len(self.triangles), 3):
            glBegin(GL_LINE_LOOP)
            glVertex3fv(self.vertices[self.triangles[i]])
            glVertex3fv(self.vertices[self.triangles[i + 1]])
            glVertex3fv(self.vertices[self.triangles[i + 2]])
            glEnd()
        glColor(1, 1, 1, 1)
```

Solo tendremos que llamar al método después del `Draw`:

```python
class OpenGLApp(App):
    def Render(self):
        GLUtils.PrepareRender()
        glRotatef(15 * self.deltaTime, 1, 1, 0)
        self.cube.Draw()
        self.cube.Debug()
```

![]({{cdn}}/opengl/anim21.gif)

Fijaros que se dibujan también los vértices traseros, eso es porque no hay un buffer de profundidad activado por defecto. Podemos activar el de pruebas mediante `glEnable(GL_DEPTH_TEST)`:

```python
class GLUtils:
    @staticmethod
    def InitRender():
        # https://docs.microsoft.com/es-es/windows/win32/opengl/glenable
        glEnable(GL_DEPTH_TEST)
```

![]({{cdn}}/opengl/anim21b.gif)

## Cargando mallas desde ficheros

El siguiente paso lógico es cargar un modelo desde un fichero externo. En mis apuntes sobre gráficos 3D [explico a fondo](/docs/graficos-3d/09-ficheros-con-modelos-obj/) el formato Wavefront OBJ, cómo se organiza y cómo hacer un parser para extraer la información. Así que me voy a ahorrar los detalles e iré directamente a la implementación.

Si pasamos un primer argumento con la ruta a un fichero durante la creación del `mesh` significa que hay que cargarlo a partir de sus datos en lugar de crearlo en crudo:

```python
class Mesh:
    def __init__(self, objPath=None, vertices=[], triangles=[], drawtype=GL_LINE_LOOP):
        self.vertices = vertices
        self.triangles = triangles
        self.drawtype = drawtype

        if objPath is not None:
            self.LoadMesh(objPath)

    def LoadMesh(self, objPath):
        pass
```

Del fichero vamos a leer cada línea y extraeremos los vértices y los índices de los triángulos. La línea de los vértices empieza con una `v` y los vértices vienen separados por espacios. Los triángulos, o mejor dicho las caras (_faces_) empiezan con una `f` y tienen diferente información.

Una cara puede contener los vértices (_vertex index_), sus coordenadas UV para aplicar la textura (_vertex texture coordinate index_) y el vértice normalizado (_vertex normal index_), estos valores se encuentran separados por barras:

```
f v1/vt1/vn3 v1/vt3/vn3 v3/vt3/vn3
```

Nostros solo queremos el primer elemento de cada grupo (`v1`, `v2`, `v2`), que es el que indica el índice del vértice, eso `sí`, como los índices empiezan a partir de `1` debemos restar `1` antes de guardarlos:

```python
def LoadMesh(self, objPath):
    with open(objPath) as objFile:
        lines = objFile.readlines()
        for line in lines:
            # Si la línea es un vértice
            if line[:2] == "v ":
                vx, vy, vz = [float(value) for value in line[2:].split()]
                # Añadimos el vértice a la lista
                self.vertices.append((vx, vy, vz))
            # Si la línea es una cara
            if line[:2] == "f ":
                # Recuperamos toda la información de cada cara
                for vertex in [face for face in line[2:].split()]:
                    # Guardamos los índices de los vértices menos 1
                    self.triangles.append(int(vertex.split('/')[0]) - 1)
    print(f"Mesh {objPath} cargado en la memoria")
```

En este punto tengo varios modelos en formato _obj_ en el directorio [res](./res), voy a ver si funciona la carga por ejemplo del `cube.obj`:

```python
import sys
sys.path.append('..')
from res.App import App
from res.Mesh import *
from OpenGL.GL import *
from OpenGL.GLU import *


class GLUtils:
    @staticmethod
    def InitRender():
        glLoadIdentity()
        gluPerspective(60, (600 / 600), 0.1, 100)
        glRotatef(15, 1, 1, 0)
        glTranslate(0.33, -0.33, -2)
        glEnable(GL_DEPTH_TEST)

    @staticmethod
    def PrepareRender():
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)


class OpenGLApp(App):
    def Init(self):
        GLUtils.InitRender()
        self.mesh = Mesh("../res/models/cube.obj")

    def Render(self):
        GLUtils.PrepareRender()
        glRotatef(15 * self.deltaTime, 1, 1, 0)
        self.mesh.Draw()


if __name__ == '__main__':
    app = OpenGLApp("OpenGL en Python", 600, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/anim22.gif)

Vamos a probar otros modelos, quizá tenemos que hacer algunos ajustes a la traslación.

Por ejemplo el `donut.obj`:

```python
class GLUtils:
    @staticmethod
    def InitRender():
        glTranslate(0.66, -0.5, -3.5)

class OpenGLApp(App):
    def Init(self):
        GLUtils.InitRender()
        self.mesh = Mesh("../res/models/donut.obj")

    def Render(self):
        GLUtils.PrepareRender()
        glRotatef(15 * self.deltaTime, 1, 1, 0)
        self.mesh.Draw()
```

![]({{cdn}}/opengl/anim23.gif)

Teniendo en cuenta que el proceso no esta optimizado y Python tampoco es la panacea en cuanto a velocidad, 60 FPS para un modelo de 1000 triángulos no me parece mal.

Veamos un par más de modelos y pasemos a otra cosa:

```python
class GLUtils:
    @staticmethod
    def InitRender():
        glTranslate(1, -0.5, -3.5)

class OpenGLApp(App):
    def Init(self):
        GLUtils.InitRender()
        self.mesh = Mesh("../res/models/f117.obj")

    def Render(self):
        GLUtils.PrepareRender()
        glRotatef(15 * self.deltaTime, 1, 1, 0)
        self.mesh.Draw()
```

![]({{cdn}}/opengl/anim25.gif)

```python
class GLUtils:
    @staticmethod
    def InitRender():
        glTranslate(0.66, -0.25, -3.5)

class OpenGLApp(App):
    def Init(self):
        GLUtils.InitRender()
        self.mesh = Mesh("../res/models/crab.obj")

    def Render(self):
        GLUtils.PrepareRender()
        glRotatef(15 * self.deltaTime, 1, 1, 0)
        self.mesh.Draw()
```

![]({{cdn}}/opengl/anim24.gif)

---

<small class="edited"><i>Última edición: 12 de Junio de 2022</i></small>
