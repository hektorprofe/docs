title: Renderizado con shaders | OpenGL en Python | Hektor Profe
description: Renderizado con shaders en OpenGL con Python

# Renderizado con shaders

En este momento, para cada fotograma del escenario, la CPU debe recorrer y procesar individualmente cada uno de los vértices de los modelos.

Mediante el uso de shaders, en OpenGL podemos almacenar esos mismos vértices en la memoria de la tarjera gráfica y procesarlos sacando partido a su potencia, multiplicando exponencialmente la capacidad de renderizado.

## Refactorizando el motor

Voy a crear una nueva versión del motor preparándolo para hacer uso de los shaders.

Un "vertex shader" es una pieza de código que define cómo debe la gráfica renderizar un conjunto de los vértices almacenados en el buffer de su memoria. Pero más allá de la posición en el espacio tridimensional, este "vertex shader" se complementa con un "fragment shader" que trabaja a nivel de píxel en el área de las mallas formadas por los vértices, y especifica entre otras cosas, cómo colorear ese espacio.

Empezaremos con la implementación de la App:

`engine/PyOGLApp.py`

```python
import sys
import pygame as pg
from pygame.locals import *
from OpenGL.GL import *
from OpenGL.GLU import *
from .Camera import *

class PyOGLApp:
    def __init__(self, title, width, height, maxFps):
        pg.init()

        # OpenGL Shaders Configurations
        pg.display.gl_set_attribute(pg.GL_MULTISAMPLEBUFFERS, 1)
        pg.display.gl_set_attribute(pg.GL_MULTISAMPLESAMPLES, 4)
        pg.display.gl_set_attribute(pg.GL_CONTEXT_PROFILE_MASK, pg.GL_CONTEXT_PROFILE_CORE)

        self.title, self.maxFps = title, maxFps
        self.screenWidth, self.screenHeight = width, height
        self.display = pg.display.set_mode((width, height), DOUBLEBUF | OPENGL)
        self.clock = pg.time.Clock()
        self.camera = Camera()

        # Vertex Array Object reference
        self.vao_ref = None
        # Program Id
        self.program_id = None
        # Number of vertex to render
        self.vertex_count = 0

    def Init(self):
        pass

    def Inputs(self):
        for event in self.events:
            if event.type == MOUSEBUTTONDOWN and event.button == 1:
                pg.mouse.set_pos(self.screenWidth / 2, self.screenHeight / 2)
                pg.mouse.set_visible(False)
                pg.event.set_grab(True)
            if event.type == MOUSEBUTTONUP and event.button == 1:
                pg.mouse.set_pos(self.screenWidth / 2, self.screenHeight / 2)
                pg.mouse.set_visible(True)
                pg.event.set_grab(False)

    def Update(self):
        self.CameraInit()

    def Render(self):
        pass

    def Run(self):
        self.Init()   # initial members
        while 1:
            self.events = pg.event.get()
            for event in self.events:
                if event.type == pg.QUIT:
                    sys.exit()
                if event.type == KEYDOWN:
                    if event.key == K_ESCAPE:
                        sys.exit()
            self.deltaTime = self.clock.tick(self.maxFps) / 1000
            self.Inputs()  # frame inputs
            self.Update()  # frame logic
            self.Render()  # frame drawing
            pg.display.flip()
            pg.display.set_caption(
                f"{self.title} ({self.clock.get_fps():.2f} fps)")

    def CameraInit(self):
        pass

    def WorldAxes(self):
        # Dibujamos las líneas para los ejes
        glLineWidth(3)
        glBegin(GL_LINES)
        glColor(1, 0, 0)
        glVertex3d(-100, 0, 0)  # Eje X
        glVertex3d(100, 0, 0)
        glColor(0, 1, 0)
        glVertex3d(0, -100, 0)  # Eje Y
        glVertex3d(0, 100, 0)
        glColor(0, 0, 1)
        glVertex3d(0, 0, -100)  # Eje Z
        glVertex3d(0, 0, 100)
        glEnd()

        # Creamos un objeto cuádrico en OpenGL para una esfera
        # https://docs.microsoft.com/es-es/windows/win32/opengl/glunewquadric
        sphere = gluNewQuadric()
        # Dibujamos una esfera para el eje X
        glColor(1, 0, 0)
        glPushMatrix()
        glTranslated(1, 0, 0)
        gluSphere(sphere, 0.05, 10, 10)
        glPopMatrix()

        # Dibujamos una esfera para el eje Y
        glColor(0, 1, 0)
        glPushMatrix()
        glTranslated(0, 1, 0)
        gluSphere(sphere, 0.05, 10, 10)
        glPopMatrix()

        # Dibujamos una esfera para el eje Z
        glColor(0, 0, 1)
        glPushMatrix()
        glTranslated(0, 0, 1)
        gluSphere(sphere, 0.05, 10, 10)
        glPopMatrix()

        glColor(1, 1, 1)
        glLineWidth(1)
```

Esta tomará la configuración de la clase Camera:

`engine/Camera.py`

```python
import pygame as pg
from OpenGL.GLU import *
from math import *

class Camera:
    def __init__(self):
        # Posición del ojo (origen)
        self.eye = pg.math.Vector3(0, 0, 0)
        # Vectores de dirección Y, X, Z
        self.up = pg.math.Vector3(0, 1, 0)
        self.right = pg.math.Vector3(1, 0, 0)
        self.forward = pg.math.Vector3(0, 0, 1)
        # Dirección hacia donde mira la cámara (adelante)
        self.look = self.eye + self.forward
        # Rotaciones de la cámara a partir del ratón
        self.mouseSensitivity = pg.math.Vector2(10, 15)
        self.lastMouse = pg.math.Vector2(300, 300)
        self.pitch = 0
        self.yaw = -90
        # Valor inicial del vector forward normalizado
        self.forward.x = cos(radians(self.yaw)) * cos(radians(self.pitch))
        self.forward.y = sin(radians(self.pitch))
        self.forward.z = sin(radians(self.yaw)) * cos(radians(self.pitch))
        self.forward = self.forward.normalize()

    def Rotate(self, yaw, pitch):
        # Incrementamos los ángulos de rotación
        self.pitch += pitch
        self.yaw += yaw
        if self.pitch > 89.0:
            self.pitch = 89
        if self.pitch < -89.0:
            self.pitch = -89
        # Aplicamos las rotaciones mediante trigonometría
        self.forward.x = cos(radians(self.yaw)) * cos(radians(self.pitch))
        self.forward.y = sin(radians(self.pitch))
        self.forward.z = sin(radians(self.yaw)) * cos(radians(self.pitch))
        # Normalizamos el vector adelante
        self.forward = self.forward.normalize()
        # Recalculamos el vector derecho haciendo el producto vectorial
        self.right = self.forward.cross(pg.Vector3(0, 1, 0)).normalize()
        # Recalculamos el vector arriba haciendo el producto vectorial
        self.up = self.right.cross(self.forward).normalize()

    def Update(self, deltaTime=1, screenWidth=1, screenHeight=1):
        if not pg.mouse.get_visible():
            # Procesamiento de la dirección
            mouseChange = self.lastMouse - pg.math.Vector2(pg.mouse.get_pos())
            pg.mouse.set_pos(screenWidth / 2, screenHeight / 2)
            self.Rotate(-mouseChange.x * self.mouseSensitivity.x * deltaTime,
                        mouseChange.y * self.mouseSensitivity.y * deltaTime)
            self.lastMouse = pg.mouse.get_pos()
        # Precesamiento del movimiento
        keys = pg.key.get_pressed()
        # Si presionamos la letra W moveremos la cámara adelante
        if keys[pg.K_w]:
            self.eye += self.forward * deltaTime
        # Si presionamos la letra S moveremos la cámara atrás
        if keys[pg.K_s]:
            self.eye -= self.forward * deltaTime
        # Si presionamos la letra D moveremos la cámara a la derecha
        if keys[pg.K_d]:
            self.eye += self.right * deltaTime
        # Si presionamos la letra A moveremos la cámara a la izquierda
        if keys[pg.K_a]:
            self.eye -= self.right * deltaTime
        # Si presionamos el espacio moveremos la cámara hacia arriba
        if keys[pg.K_SPACE]:
            self.eye += self.up * deltaTime
        # Si presionamos el ALT izquierdo moveremos la cámara abajo
        if keys[pg.K_LALT]:
            self.eye -= self.up * deltaTime
        # Actualizamos la dirección a donde mira la cámara
        self.look = self.eye + self.forward
        # Estableceremos la transformación de visualización
        # https://docs.microsoft.com/eu-es/windows/win32/opengl/glulookat
        gluLookAt(self.eye.x, self.eye.y, self.eye.z,
                  self.look.x, self.look.y, self.look.z,
                  self.up.x, self.up.y, self.up.z)
```

Para hacer uso de nuestro motor crearemos una instancia de la aplicación:

`refactortest.py`

```python
import sys
sys.path.append('..')
from res.engine.PyOGLApp import *

class RefactorTest(PyOGLApp):
    def Init(self):
        bgColor = (0, 0, 0, 1)
        drawingColor = (1, 1, 1, 1)
        glClearColor(bgColor[0], bgColor[1], bgColor[2], bgColor[3])
        glColor(drawingColor)
        # Projection
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        gluPerspective(60, (self.screenWidth / self.screenHeight), 0.1, 1000.0)

    def CameraInit(self):
        # Model View
        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()
        glViewport(0, 0, self.screenWidth, self.screenHeight)
        glEnable(GL_DEPTH_TEST)
        # Camera Updating
        self.camera.Update(self.deltaTime, self.screenWidth, self.screenHeight)

    def Render(self):
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        self.WorldAxes()

if __name__ == '__main__':
    app = RefactorTest("OpenGL en Python", 600, 600, 60)
    app.Run()
```

Hasta aquí sin más, tenemos lo mismo que anteriormente.

## Compilador de shaders

Para poder utilizar un shader debemos compilarlo, este proceso podemos programarlo en una función de utilidades:

`engine/Utils.py`

```python
from OpenGL.GL import *

def compile_shader(shader_type, shader_source):
    # Create a shader object
    shader_id = glCreateShader(shader_type)
    # Replace the source code in a shader object
    glShaderSource(shader_id, shader_source)
    # Compile a shader object
    glCompileShader(shader_id)
    # Return a parameter from a shader object
    compile_success = glGetShaderiv(shader_id, GL_COMPILE_STATUS)
    # If anything fails...
    if not compile_success:
        # Return the information log for a shader object
        error_message = "\n" + glGetShaderInfoLog(shader_id)
        # Delete a shader object
        glDeleteShader(shader_id)
        # Invoke an exception with the error
        raise Exception(error_message)
    # Finally return the compiled shader id
    return shader_id
```

Los shaders compilados forman parte del programa que se ejecutará en la gráfica, tenemos que crear uno y asignarle los shaders de vértices y fragmentos:

`engine/Utils.py`

```python
def create_program(vertex_shader_code, fragment_shader_code):
    # Return the compiled vertex shader id
    vertex_shader_id = compile_shader(GL_VERTEX_SHADER, vertex_shader_code)
    # Return the compiled fragment shader id
    frag_shader_id = compile_shader(GL_FRAGMENT_SHADER, fragment_shader_code)
    # Create the program object
    program_id = glCreateProgram()
    # Attach the vertex shader object to the program object
    glAttachShader(program_id, vertex_shader_id)
    # Attach the fragment shader object to the program object
    glAttachShader(program_id, frag_shader_id)
    # Link the program object to process it
    glLinkProgram(program_id)
    # Return a parameter from a program object
    link_success = glGetProgramiv(program_id, GL_LINK_STATUS)
    # If anything fails...
    if not link_success:
        # Return the information log for a program object
        info = glGetProgramInfoLog(program_id)
        # Invoke an exception with the error
        raise RuntimeError(info)
    # If all its fine delete the vertex shader object
    glDeleteShader(vertex_shader_id)
    # And the fragment shader object
    glDeleteShader(frag_shader_id)
    # Finally return the compiled program id
    return program_id
```

## Nuestro primer shader

Ahora que tenemos el motor preparado para procesar shaders veamos como implementarlos. Teniendo en cuenta que un shader es una pieza de código tenemos la posibilidad de crearlos en un fichero de texto o directamente como una variable, por ahora vamos a por la segunda opción.

Empecemos con algo muy simple, dibujar un único vértice con un color en la pantalla:

```python
import sys
from venv import create
import numpy as np
sys.path.append('..')
from res.engine.PyOGLApp import *
from res.engine.Utils import *

vertex_shader = r"""
#version 330 core
void main()
{
    // posición del vértice de prueba
    gl_Position = vec4(0.5, 0, 0, 1);
}
"""

fragment_shader = r"""
#version 330 core
out vec4 frag_color;
void main()
{
    // color del vértice de prueba
    frag_color = vec4(0, 1, 0, 1);
}
"""

class MyApp(PyOGLApp):
    def Init(self):
        # Creamos el programa pasándole ambos shaders
        self.program_id = create_program(vertex_shader, fragment_shader)
        # Generate a Vertex Array Object names
        self.vao_ref = glGenVertexArrays(1)
        # Bind a vertex array object
        glBindVertexArray(self.vao_ref)
        # Specify the diameter of rasterized points
        glPointSize(10)

    def Render(self):
        # Clear buffers to preset values
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        # Install a program object as part of current rendering state
        glUseProgram(self.program_id)
        # Render primitives from array data
        glDrawArrays(GL_POINTS, 0, 1)

if __name__ == '__main__':
    app = MyApp("Primer Shader", 600, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/img77.png)

## Shader con múltiples vértices

Para procesar más de un vértice debemos almacenarlos en el buffer de la gráfica. Almacenar datos significa que necesitamos definirlos y empaquetarlos en variables y para ello haremos uso de nuestra propia clase GraphicsData:

`engine/GraphicsData.py`

```python
from OpenGL.GL import *
import numpy as np

class GraphicsData:
    def __init__(self, data_type, data):
        # Store the data
        self.data = data
        # Set the data type
        self.data_type = data_type
        # Generate a Buffer Object Names
        self.buffer_ref = glGenBuffers(1)
        # Load the data
        self.load()

    def load(self):
        # Create an array of float32 type to represent positions
        data = np.array(self.data, np.float32)
        # Bind the named buffer object
        glBindBuffer(GL_ARRAY_BUFFER, self.buffer_ref)
        # Creates and initialize a buffer object's data store
        # data.ravel() -> toma los datos del array de numpy y lo transforma a
        # un array unidimensional de números, que es lo que espera OpenGL
        glBufferData(GL_ARRAY_BUFFER, data.ravel(), GL_STATIC_DRAW)

    def create_variable(self, program_id, variable_name):
        # Return the location of an attribute variable
        variable_id = glGetAttribLocation(program_id, variable_name)
        # Bind the named buffer object
        glBindBuffer(GL_ARRAY_BUFFER, self.buffer_ref)
        # If data is a vector3...
        if self.data_type == "vec3":
            # Define an array of generic vertex attribute data
            # 3        -> Size
            # GL_FLOAT -> Type
            # False    -> Not normalized
            # 0        -> Stride size
            # None     -> Mixed data pointer
            glVertexAttribPointer(variable_id, 3, GL_FLOAT, False, 0, None)
        # Enable or disable a generic vertex attribute array
        glEnableVertexAttribArray(variable_id)
```

Ahora ya podemos definir una lista de múltiples vértices en nuestra aplicación en porciones de 3 números (las posiciones x, y, z):

```python
import sys
import numpy as np
sys.path.append('..')
from res.engine.PyOGLApp import *
from res.engine.GraphicsData import *
from res.engine.Utils import *

vertex_shader = r"""
#version 330 core
// Variable que toma datos externos
in vec3 position;
void main()
{
    // posición del vértice tomado del exterior
    gl_Position = vec4(position.x, position.y, position.z, 1);
}
"""

fragment_shader = r"""
#version 330 core
out vec4 frag_color;
void main()
{
    // color del vértice de prueba
    frag_color = vec4(0, 1, 0, 1);
}
"""

class MyApp(PyOGLApp):
    def Init(self):
        self.program_id = create_program(vertex_shader, fragment_shader)
        self.vao_ref = glGenVertexArrays(1)
        glBindVertexArray(self.vao_ref)
        glPointSize(10)
        # Define multiple vertices
        position_data = [
            [0, -.9, 0],
            [-.6, .8, 0],
            [.9, -.2, 0],
            [-.9, -.2, 0],
            [.6, .8, 0]
        ]
        # Save the number of vertices
        self.vertex_count = len(position_data)
        # Define the variable for the vec3 chunks using the vertices list
        position_variable = GraphicsData("vec3", position_data)
        # Create the variable in the memory buffer
        position_variable.create_variable(self.program_id, "position")

    def Render(self):
        # Clear buffers to preset values
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        # Install a program object as part of current rendering state
        glUseProgram(self.program_id)
        # Render primitives from array data passing the counter
        glDrawArrays(GL_POINTS, 0, self.vertex_count)

if __name__ == '__main__':
    app = MyApp("Segundo Shader", 600, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/img78.png)

## Estrella de colores

En este tercer shader vamos a utilizar una segunda lista con colores para los puntos, deberemos crear la variable y almacenarla en el buffer.

Respecto al "fragment shader", éste toma como entradas las salidas del "vertex shader", razón por la cuál tendremos un `out vec3 color;` que retomaremos `in vec3 color;`:

```python
import sys
from venv import create
import numpy as np
sys.path.append('..')
from res.engine.PyOGLApp import *
from res.engine.GraphicsData import *
from res.engine.Utils import *

vertex_shader = r"""
#version 330 core
// Variable que toma datos externos
in vec3 position;
// Variable con un color para el fragment shader
in vec3 vertex_color;
out vec3 color;
void main()
{
    // posición del vértice tomado del exterior
    gl_Position = vec4(position.x, position.y, position.z, 1);
    // Devolvemos el mismo color
    color = vertex_color;
}
"""

fragment_shader = r"""
#version 330 core
in vec3 color;
out vec4 frag_color;
void main()
{
    // color del vértice de prueba
    frag_color = vec4(color, 1);
}
"""

class MyApp(PyOGLApp):
    def Init(self):
        self.program_id = create_program(vertex_shader, fragment_shader)
        self.vao_ref = glGenVertexArrays(1)
        glBindVertexArray(self.vao_ref)

        # Variable que controla las posiciones
        position_data = [
            [0, -.8, 0],
            [-.6, .8, 0],
            [.8, -.2, 0],
            [-.8, -.2, 0],
            [.6, .8, 0]
        ]
        position_variable = GraphicsData("vec3", position_data)
        position_variable.create_variable(self.program_id, "position")

        # Variable que controla los colores
        color_data = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 0, 1],
            [1, 1, 0]
        ]
        color_variable = GraphicsData("vec3", color_data)
        color_variable.create_variable(self.program_id, "vertex_color")

        # Save the number of vertices
        self.vertex_count = len(position_data)

    def Render(self):
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glUseProgram(self.program_id)
        glDrawArrays(GL_LINE_LOOP, 0, self.vertex_count)

if __name__ == '__main__':
    app = MyApp("Tercer Shader", 600, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/img79.png)

## Renderizando un modelo

Nuestro siguiente objetivo es dibujar un modelo mediante shaders y para ello definiremos nuestra propia implementación de la clase Mesh que podremos extender para crear diferentes formas:

`engine/Mesh.py`

```python
from OpenGL import *
from .GraphicsData import *
from .Uniform import *
import pygame as pg
import numpy as np


class Mesh:
    def __init__(self, program_id, vertices, vertex_colors, draw_type):
        # Lista con los vértices
        self.vertices = vertices
        # Tipo de dibujado
        self.draw_type = draw_type
        # Creamos un VAO para el mesh
        self.vao_ref = glGenVertexArrays(1)
        # Enlazamos el VAO del mesh
        glBindVertexArray(self.vao_ref)
        # Creamos una variable para la posición de los vértices
        position = GraphicsData("vec3", self.vertices)
        position.create_variable(program_id, "position")
        # Creamos una variable para el color de los vértices
        colors = GraphicsData("vec3", vertex_colors)
        colors.create_variable(program_id, "vertex_color")

    def draw(self):
        # Enlazamos el VAO del mesh
        glBindVertexArray(self.vao_ref)
        # Dibujamos el VAO
        glDrawArrays(self.draw_type, 0, len(self.vertices))
```

Esta clase podemos extenderla en nuestras propias clases Triangle y Square sin complicación:

`engine/Triangle.py`

```python
from .Mesh import *

class Triangle(Mesh):
    def __init__(self, program_id, location=None):
        vertices = [
            [0, 0.25, -1.0],
            [0.5, -0.5, -1.0],
            [-0.5, -0.5, -1.0]
        ]
        colors = [
            [0, 1, 1],
            [0, 1, 0],
            [0, 0.5, 0.5]
        ]
        super().__init__(program_id, vertices, colors, GL_TRIANGLE_FAN, location)
```

`engine/Square.py`

```python
from .Mesh import *

class Square(Mesh):
    def __init__(self, program_id, location=None):
        vertices = [
            [0.5, 0.5, -1.0],
            [0.5, -0.5, -1.0],
            [-0.5, -0.5, -1.0],
            [-0.5, 0.5, -1.0]
        ]
        colors = [
            [1, 0, 0],
            [1.0, 0.5, 0],
            [1, 1, 0],
            [0, 1, 0]
        ]
        super().__init__(program_id, vertices, colors, GL_TRIANGLE_FAN, location)
```

Y ya podremos hacer uso de ellas en nuestra aplicación:

```python
import sys
from venv import create
import numpy as np
sys.path.append('..')
from res.engine.PyOGLApp import *
from res.engine.Utils import *
from res.engine.Square import *
from res.engine.Triangle import *
from res.engine.GraphicsData import *

vertex_shader = r"""
#version 330 core
// Variable que toma datos externos
in vec3 position;
// Variable con un color para el fragment shader
in vec3 vertex_color;
out vec3 color;
void main()
{
    // posición del vértice tomado del exterior
    gl_Position = vec4(position.x, position.y, position.z, 1);
    // Devolvemos el mismo color
    color = vertex_color;
}
"""

fragment_shader = r"""
#version 330 core
in vec3 color;
out vec4 frag_color;
void main()
{
    // color del vértice de prueba
    frag_color = vec4(color, 1);
}
"""

class MyApp(PyOGLApp):
    def Init(self):
        # Creamos el programa con los shaders
        self.program_id = create_program(vertex_shader, fragment_shader)
        # Creamos un cuadrado y un triángulo
        self.square = Square(self.program_id)
        self.triangle = Triangle(self.program_id)

    def Render(self):
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glUseProgram(self.program_id)
        # Dibujamos ambas formas de abajo hacia arriba
        self.square.draw()
        self.triangle.draw()

if __name__ == '__main__':
    app = MyApp("Cuarto Shader", 600, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/img80.png)

## Traslación en el modelo

Por último en esta sección veamos cómo enviar un movimiento de traslación a la hora de dibujar un modelo con los shaders.

Como debemos representar la traslación en una posición necesitaremos almacenarla en la gráfica y hacer uso de ella en los shaders. Con ese objetivo crearemos una implementación de la clase Uniform que nos permitirá crear variables y buscarlas cómodamente.

A uniform is a global Shader variable declared with the "uniform" storage qualifier. These act as parameters that the user of a shader program can pass to that program. Their values are stored in a program object.

`engine/Uniform.py`

```python
from OpenGL.GL import *

class Uniform:
    def __init__(self, data_type, data):
        self.variable_id = None
        self.data = data
        self.data_type = data_type

    def find_variable(self, program_id, variable_name):
        # Return the location of a uniform variable
        self.variable_id = glGetUniformLocation(program_id, variable_name)

    def load(self):
        if self.data_type == "vec3":
            # Set the value of a uniform variable for the current program object
            glUniform3f(
                self.variable_id,
                self.data[0],
                self.data[1],
                self.data[2]
            )
```

Estableceremos una traslación para modificar el offset del centro del modelo, por eso lo podemos pasar como un pg.Vector3 al crearlo. En caso de que lo establezcamos crearemos la variable uniform y la cargaremos en el shader antes de realizar el dibujado:

`engine/Mesh.py`

```python
from OpenGL import *
from .GraphicsData import *
from .Uniform import *
import pygame as pg
import numpy as np

class Mesh:
    def __init__(self, program_id, vertices, vertex_colors, draw_type, translation=None):
        self.vertices = vertices
        self.draw_type = draw_type
        self.vao_ref = glGenVertexArrays(1)
        glBindVertexArray(self.vao_ref)
        position = GraphicsData("vec3", self.vertices)
        position.create_variable(program_id, "position")
        colors = GraphicsData("vec3", vertex_colors)
        colors.create_variable(program_id, "vertex_color")
        # Si pasamos una posición de traslación inicial
        if translation:
            # Creamos la variable en el programa
            self.translation = Uniform("vec3", translation)
            self.translation.find_variable(program_id, "translation")

    def draw(self):
        # Si tenemos la traslación la cargamos en el shader
        if self.translation:
            self.translation.load()
        # Luego realizamos el dibujado de forma normal
        glBindVertexArray(self.vao_ref)
        glDrawArrays(self.draw_type, 0, len(self.vertices))
```

La clave es tomar esta cantidad traslación como una variable unform en el "vertex shader" y sumarla a la posición actual:

```python
import sys
from venv import create
import numpy as np
sys.path.append('..')
from res.engine.PyOGLApp import *
from res.engine.Utils import *
from res.engine.Square import *
from res.engine.Triangle import *
from res.engine.GraphicsData import *

vertex_shader = r"""
#version 330 core
// Variable que toma datos externos
in vec3 position;
// Variable con un color para el fragment shader
in vec3 vertex_color;
out vec3 color;
// Variable para manejar una traslación
uniform vec3 translation;
void main()
{
    // Sumamos la posición trasladada a la actual
    vec3 pos = position + translation;
    // Posición del vértice tomado del exterior
    gl_Position = vec4(pos, 1);
    // Devolvemos el mismo color
    color = vertex_color;
}
"""

fragment_shader = r"""
#version 330 core
in vec3 color;
out vec4 frag_color;
void main()
{
    // color del vértice de prueba
    frag_color = vec4(color, 1);
}
"""

class MyApp(PyOGLApp):
    def Init(self):
        self.program_id = create_program(vertex_shader, fragment_shader)
        # Creamos el modelo pasando un vector de traslación inicial
        self.square = Square(self.program_id, pg.Vector3(-0.5, 0.5, 0))
        self.triangle = Triangle(self.program_id, pg.Vector3(0.5, -0.5, 0))

    def Render(self):
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glUseProgram(self.program_id)
        self.square.draw()
        self.triangle.draw()

if __name__ == '__main__':
    app = MyApp("Quinto Shader", 600, 600, 60)
    app.Run()
```

![]({{cdn}}/opengl/img81.png)

Como vemos estamos renderizando dos modelos, pero en lugar de en cada iteración realizar el proceso de dibujado de los vértices, los almacenamos en la memoria de la tarjeta gráfica en una referencia VAO (Vertex Array Object) y simplemente los dibujamos.

Este concepto de "guardar" información en la memoria de la gráfica y utilizarla cuando lo necesitemos es muy conveniente y abre la puerta a realizar innumerables experimentos, permitiéndose renderizar complejos modelos tridimensionales con un lenguaje poco potente como es Python.

---

<small class="edited"><i>Última edición: 12 de Octubre de 2022</i></small>