title: Tutoriales | Django | Academia | Hektor Profe
description: Recopilación de tutoriales interesantes sobre este framework web.

# Tutoriales sobre Django

## Utilizar Django en entornos virtuales con Pipenv

Python incluye un gestor de paquetes llamado pip, el problema es que no se puede tener instaladas dos versiones distintas del mismo paquete y si realizamos un proyecto que necesita una versión y luego tenemos que actualizar quizá deja de funcionar.

Los entornos virtuales sirven para crear una instalación de Python aislada a la del sistema, permitiéndonos instalar versiones de los paquetes que queramos.

Hasta hace un tiempo se utilizaba una herramienta llamada virtualenv, cuyo propósito es generar esos entornos aislados. El problema de este método es que es poco práctico porque te obliga a crear los entornos uno a uno identificándolos con un nombre. Ese es un problema común con el gestor de paquetes conda, una alternativa a virtualenv que además permite elegir la versión de Python, pero que también requiere otorgar nombres a los entornos.

Pipenv viene a solucionar ese punto, pues permite crear un entorno virtual individual para cada proyecto sin tener que darle un nombre. Simplemente crea el entorno en el directorio del proyecto y permite manejarlo desde ahí cómodamente.

La limitación que tiene este método es que está ligado a las versiones de Python que tengamos instaladas. Es decir, puedes crear entornos con otras versiones de Python diferentes a la que tienes por defecto, pero las necesitas previamente descargadas en la máquina y establecer las rutas durante la creación del entorno, algo que no sucede en conda.

Utilizar pipenv es muy fácil, para instalarlo haremos lo de siempre:

```bash
pip install pipenv
```

Luego navegamos con la terminal al directorio de nuestro proyecto y ahí creamos el entorno de la siguiente forma:

```bash
pipenv shell
```

Esto no sólo lo creará, también lo activará. Lo sabremos porque en la parte delantera de la terminal aparecerá el nombre del proyecto entre paréntesis y un código:

```bash
(proyecto-hJNodmU0)
```

Para salir de él podemos usar el comando **exit**:

```bash
(proyecto-hJNodmU0) exit
```

Y para volver a activarlo, simplemente situándonos de nuevo en la carpeta del proyecto hacemos de nuevo:

```bash
pipenv shell
```

Siempre que tengamos la shell activa, el intérprete **python** hará referencia al del entorno virtual, sin embargo no es obligatorio tener la shell activada, podemos seguir interactuando con el entorno haciendo uso de **pipenv**. 

Por ejemplo para instalar un paquete la lógica es simple, como si usáramos pip pero con pipenv:

```bash
pipenv install <paquete>
```

Incluso se puede instalar un fichero requirements.txt:

```bash
pipenv install -r requirements.txt
```

Y para desinstalar un paquete:

```bash
pipenv uninstall <paquete>
```

O si queremos ver la lista de paquetes del entorno organizado por dependencias, podemos hacerlo con:

```bash
pipenv graph
```

Me gusta utilizar pipenv porque me ahorra tiempo y además Visual Studio Code detecta el entorno automáticamente instalado en el directorio del proyecto.

Para utilizar Django en Pipenv simplemente deberíamos instalarlo en el entorno creado previamente en una carpeta que representará nuestro proyecto:

```bash
pipenv install django
```

Ahora podemos ejecutar comandos dentro del entorno utilizando **pipenv run** y así crear el proyecto:

```bash
pipenv run django-admin startproject <proyecto>
```

Para crear una app, nos situaremos en la raíz de nuestro proyecto (donde tenemos el **manage.py**) y lo haremos con:

```bash
pipenv run python manage.py startapp <app>
```

Siguiendo la misma lógica podemos realizar migraciones, crear superusuarios, etc:

```bash
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate
pipenv run python manage.py createsuperuser
```

Algo genial es que podemos editar el fichero Pipfile y añadir en él nuestros propios scripts, por ejemplo un script para lanzar el servidor y ahorrarnos algunas palabras. Sólo tenemos que añadir un apartado [scripts] de la siguiente forma:

`Pipfile`
```
[scripts]
server = "python manage.py runserver"
```

Luego para llamar al script lo haremos con el run y el nombre del script:

```bash
pipenv run server
```

Todo esto no es más que una muestra del poder de Pipenv, si os parece interesante os dejo la [web oficial](https://pipenv.readthedocs.io/en/latest/) y un [tutorial de Real Python](https://realpython.com/pipenv-guide/) que está bastante bien.

## Colorear sintaxis y autocompletar en Visual Studio Code

Cuando trabajemos con templates HTML de Django en Visual Studio Code veremos que la sintaxis de los template tags no se colorea:

<div class="image">
    <img src="{{cdn}}/django/django_sintaxis_vsc_1.png"/>
</div>

Hay varias extensiones que vienen a soluciones el problema, pero a menudo si arreglan una cosa rompen otra, como por ejemplo el autocompletado de los tags:

<div class="image">
    <img src="{{cdn}}/django/django_sintaxis_vsc_2.png"/>
</div>

La solución es instalar la siguiente extensión llamada [Django](https://marketplace.visualstudio.com/items?itemName=batisteo.vscode-django) creada por Baptiste Darthenay, podéis instalarla directamente desde el navegador haciendo clic en el enlace.

Después de instalarla la clave consiste en configurarla, tendremos que ir a **Archivo > Preferencias > Configuración**, en Windows **Control + ,** y acceder a la configuración JSON en lugar de la interfaz desde el botón superior derecho que luce con dos llaves **{ }**:

<div class="image">
    <img src="{{cdn}}/django/django_sintaxis_vsc_3.png"/>
</div>

En nuestra configuración añadiremos las siguientes claves JSON con estos valores:

`settings.json`
```javascript
  "files.associations": {
    "**/templates/*.html": "django-html",
    "**/templates/*": "django-txt",
    "**/requirements{/**,*}.{txt,in}": "pip-requirements"
  },
  "emmet.includeLanguages": { "django-html": "html" },
```

Una vez lo tengamos reiniciamos Visual Studio Code, abrimos un template de Django y nos aseguramos de tener marcada la opción **Django HTML** en la sintaxis del documento:

<div class="image">
    <img src="{{cdn}}/django/django_sintaxis_vsc_4.png"/>
</div>

Una vez lo tengamos ya deberíamos ser capaces de usar los template tags de Django así como el autocompletado, tanto de HTML como de los template tags usando el tabulador:

<div class="image">
    <img src="{{cdn}}/django/django_sintaxis_vsc_5.gif"/>
</div>

## Filtrar un modelo por un campo utilizando un formulario

Con Django podemos crear filtros para nuestros modelos de forma relativamente sencilla jugando con los campos de un formulario y capturándolos en la vista para aplicarlos en las queryset.

Supongamos el siguiente proyecto donde tenemos un modelo **Persona** muy simple:

`models.py`
```python
from django.db import models

class Persona(models.Model):
  nombre = models.CharField(max_length=100)
  edad = models.SmallIntegerField()
```

Añadimos varias personas a través de nuestro panel de administración:

<div class="image"><img src="{{cdn}}/django/django_form_filtro_1.png"/></div>

Para devolver una lista de nuestras personas utilizaremos una consulta básica al modelo que devuelva todas sus instancias:

`views.py`
```python
from django.shortcuts import render
from .models import *


def home(request):
    personas = Persona.objects.all()

    return render(request, "core/home.html", {'personas': personas})
```

El template que visualizaría el contenido contendría sin mucha complicación un bucle for para recorrer las personas y mostrarlas:

`home.html`
```html
{% raw %}<body>
    <h2>Lista de personas</h2>

    <ul>
    {% for persona in personas %}
    	<li>{{persona.nombre}}, {{persona.edad}} años</li>
    {% endfor %}
    </ul>
</body>{% endraw %}
```

Este sería el resultado:

<div class="image"><img src="{{cdn}}/django/django_form_filtro_2.png"/></div>

Ahora viene lo interesante, ¿cómo podemos añadir un filtro para mostrar sólo las personas que tengan una edad mínima?

Lo primero sería añadir un formulario que valide contra la propia vista un campo con la edad mínima:

`home.html`
```html
{% raw %}<body>
    <h2>Lista de personas</h2>

    <ul>
    {% for persona in personas %}
    	<li>{{persona.nombre}}, {{persona.edad}} años</li>
    {% endfor %}
    </ul>

    <form action="/" method="POST">
        Edad mínima: 
        <input type="number" name="edad" value="0" style="width:40px" / >
        <input type="submit" value="Filtrar">
        {% csrf_token %}
    </form>
</body>{% endraw %}
```

Quedaría así:

<div class="image"><img src="{{cdn}}/django/django_form_filtro_3.png"/></div>

Lo único a comentar sería el uso obligatorio del token csrf entre los tags **form** para proteger el formulario de las peticiones entre sitios cruzados.

Para procesar el campo con el **name="edad"**, buscaríamos ese campo en el diccionario **POST** de la petición y lo transformaríamos a número entero para poder utilizarlo en el filtro del queryset:

```python
if request.POST.get('edad'):
  edad = int(request.POST.get('edad'))
```

El código final de la vista, una vez aplicado el **filter** quedaría de esta forma:

` views.py`
```python
from django.shortcuts import render
from .models import *

def home(request):
    personas = Persona.objects.all()
    edad = 0  # Filtro por defecto
    if request.POST.get('edad'):
        edad = int(request.POST.get('edad'))
        personas = personas.filter(edad__gte=edad)
    return render(request, "core/home.html", {'personas': personas, 'edad':edad})
```

Fijaros como envío el propio campo edad de nuevo al template, así podríamos mostrarlo como valor del input:

```html
<input type="number" name="edad" value="{{edad}}" style="width:40px" / >
```

Con esto ya tendríamos nuestro sistema de filtrado para la queryset original con todas las personas aplicándole el filter sólo en caso de recibir el parámetro con la edad por POST:

<div class="image"><img src="{{cdn}}/django/django_form_filtro_4.png"/></div>

## Crear, editar y borrar instancias de modelos con formularios

Una de las necesidades más comunes en Django es proveer una interfaz para crear, editar y borrar datos de un modelo.

Django cuenta con un tipo de formularios llamados **ModelForm** que podemos utilizar para gestionar los modelos de una forma cómoda y fácil.

**Nota**: Utilizaremos como base el tutorial anterior de **filtrar un modelo por un campo utilizando un formulario**.

Supongamos que tenemos un modelo de persona y queremos implementar una vista con un formulario para crear nuevas personas:

`models.py`
```python
from django.db import models

class Persona(models.Model):
    nombre = models.CharField(max_length=100)
    edad = models.SmallIntegerField()
```

Lo primero que necesitamos es crear un **Model Form** para manejar este modelo, lo haremos en un fichero **forms.py** dentro de la app:

`forms.py`
```python
from django.forms import ModelForm
from .models import Persona

class PersonaForm(ModelForm):
    class Meta:
        model = Persona
        fields = ['nombre', 'edad']
```

Simplemente tenemos que indicar el modelo del formulario y los campos que vamos a manejar.

Una vez hecho implementaremos una vista para procesar este formulario de creación:

`views.py`
```python
def add(request):
    # Creamos un formulario vacío
    form = PersonaForm()

    # Comprobamos si se ha enviado el formulario
    if request.method == "POST":
        # Añadimos los datos recibidos al formulario
        form = PersonaForm(request.POST)
        # Si el formulario es válido...
        if form.is_valid():
            # Guardamos el formulario pero sin confirmarlo,
            # así conseguiremos una instancia para manejarla
            instancia = form.save(commit=False)
            # Podemos guardarla cuando queramos
            instancia.save()
            # Después de guardar redireccionamos a la lista
            return redirect('/')

    # Si llegamos al final renderizamos el formulario
    return render(request, "core/add.html", {'form': form})
```

Esta vista la llamaremos en una URL específica, por ejemplo **/add/**:

`proyecto/urls.py`
```python
urlpatterns = [
    # ...
    path('add', views.add),
]
```

Finalmente renderizaremos el formulario en el template de la siguiente forma:

`add.html`
```html
{% raw %}<form method="POST">
    {{ form.as_p }}
    {% csrf_token %}
    <button type="submit">Crear</button>
</form>{% endraw %}
```

El resultado se vería así:

<div class="image">
    <img src="{{cdn}}/django/django_modelforms_2.png"/>
</div>

Para modificar una instancia el proceso es muy similar al de crearlas, con la peculiaridad de que debemos recuperar la instancia y rellenar el formulario con su información. La vista quedaría así:

`views.py`
```python
def edit(request, persona_id):
    # Recuperamos la instancia de la persona
    instancia = Persona.objects.get(id=persona_id)

    # Creamos el formulario con los datos de la instancia
    form = PersonaForm(instance=instancia)

    # Comprobamos si se ha enviado el formulario
    if request.method == "POST":
        # Actualizamos el formulario con los datos recibidos
        form = PersonaForm(request.POST, instance=instancia)
        # Si el formulario es válido...
        if form.is_valid():
            # Guardamos el formulario pero sin confirmarlo,
            # así conseguiremos una instancia para manejarla
            instancia = form.save(commit=False)
            # Podemos guardarla cuando queramos
            instancia.save()

    # Si llegamos al final renderizamos el formulario
    return render(request, "core/edit.html", {'form': form})
```

La URL definirá un campo numérico donde pasaremos el identificador de la instancia para poder recuperarlo:

`proyecto/urls.py`
```python
urlpatterns = [
    # ...
    path('edit/<int:persona_id>', views.edit),
]
```

Respecto al template, sería el mismo que usamos para crear la instancia, pero podemos utilizar una plantilla diferente para adaptar el texto informativo y mostrar **Editar** en lugar de **Crear** en el botón:

`edit.html`
```html
{% raw %}<form method="POST">
    {{ form.as_p }}
    {% csrf_token %}
    <button type="submit">Editar</button>
</form>{% endraw %}
```

Si tenemos una lista de objetos podemos mostrar un enlace para ir al formulario de edición fácilmente creando la URL **/edit/instancia.id**:

```html
{% raw %}<ul>
  {% for persona in personas %}
  <li>
    {{ persona.nombre }}, {{ persona.edad }} años
    <a href="/edit/{{ persona.id }}">Editar</a>
  </li>
  {% endfor %}
</ul>{% endraw %}
```

Así quedaría el formulario de edición al editar una instancia:

<div class="image">
   <img src="{{cdn}}/django/django_modelforms_4.png"/>
</div>

Si todo está correcto los cambios quedarán establecidos en la instancia al guardarlos, por eso es buena idea añadir un enlace para visualizar la lista de instancias actualizadas:

<div class="image">
   <img src="{{cdn}}/django/django_modelforms_5.png"/>
</div>

Por último podemos añadir una opción para borrar instancias a partir de su identificador.

No necesitamos manejar un formulario, simplemente recuperar la instancia en la vista y borrarla:

`views.py`
```python
def delete(request, persona_id):
    # Recuperamos la instancia de la persona y la borramos
    instancia = Persona.objects.get(id=persona_id)
    instancia.delete()

    # Después redireccionamos de nuevo a la lista
    return redirect('/')
```

La URL por tanto será casi igual que la de edición:

`proyecto/urls.py`
```python
urlpatterns = [
    # ...
    path('delete/<int:persona_id>', views.delete),
]   
```

Sólo necesitamos añadir un enlace en la lista de instancia para borrarlas, recomendablemente con una pequeña confirmación usando JavaScript para prevenir un borrado accidental:

```html
{% raw %}<ul>
    {% for persona in personas %}
    <li>
        {{ persona.nombre }}, {{ persona.edad }} años
        <a href="/edit/{{ persona.id }}">Editar</a>
        <a href="/delete/{{ persona.id }}" 
          onClick="return confirm('¿Quieres borrar {{persona.nombre}}?');">
            Borrar
        </a>
    </li>
    {% endfor %}
</ul>{% endraw %}
```

Al presionar el enlace de borrado nos aparecerá la ventana emergente de confirmación:

<div class="image">
   <img src="{{cdn}}/django/django_modelforms_6.png"/>
</div>

Y justo después de confirmar volveremos a la lista donde ya habrá desaparecido la instancia borrada:

<div class="image">
   <img src="{{cdn}}/django/django_modelforms_7.png"/>
</div>

## Mostrar gráficos generados con Matplotlib en Django

Algo que me preguntan muchos mis alumnos de Django es si es posible generar gráficos en Python y mostrarlos en un template.

La respuesta es sí, pero es un poco lioso porque hace falta "renderizar" el canvas de las figuras de Matplotlib sobre un buffer de bytes.

No voy a enseñar nada de Matplotlib porque eso es harina de otro costal, [aquí dejo mis apuntes online](https://nbviewer.jupyter.org/github/hcosta/curso-python-udemy/tree/master/Fase%205%20-%20Modulos%20externos/Tema%2018%20-%20Matplotlib/), pero sí el proceso para mostrar el gráfico.

La idea de mostrar gráficos con Django se basa en acceder a una url de nuestro proyecto, por ejemplo **/plot/**, y en lugar de renderizar un template, responder con la imagen del gráfico generada en tiempo de ejecución:

<div class="image">
   <img src="{{cdn}}/python/matplotlib_1.png"/>
   <div style="font-size:80%">Al acceder a la URL que genera el gráfico, ésta devuelve una imagen PNG en lugar de un documento HTML.</div>
</div>

El snippet para la vista de Django sería el siguiente:

`views.py`
```python
import io
import matplotlib.pyplot as plt

from django.http import HttpResponse
from django.shortcuts import render
from matplotlib.backends.backend_agg import FigureCanvasAgg

from random import sample

def home(request):
    return render(request, "core/home.html")

def plot(request):
    # Creamos los datos para representar en el gráfico
    x = range(1,11)
    y = sample(range(20), len(x))

    # Creamos una figura y le dibujamos el gráfico
    f = plt.figure()

    # Creamos los ejes
    axes = f.add_axes([0.15, 0.15, 0.75, 0.75]) # [left, bottom, width, height]
    axes.plot(x, y)
    axes.set_xlabel("Eje X")
    axes.set_ylabel("Eje Y")
    axes.set_title("Mi gráfico dinámico")

    # Como enviaremos la imagen en bytes la guardaremos en un buffer
    buf = io.BytesIO()
    canvas = FigureCanvasAgg(f)
    canvas.print_png(buf)

    # Creamos la respuesta enviando los bytes en tipo imagen png
    response = HttpResponse(buf.getvalue(), content_type='image/png')

    # Limpiamos la figura para liberar memoria
    f.clear()

    # Añadimos la cabecera de longitud de fichero para más estabilidad
    response['Content-Length'] = str(len(response.content))

    # Devolvemos la response
    return response
```

Esto nos generaría el gráfico que os muestro en la imagen de arriba, que cambiará cada vez que recargamos la página con F5 porque contiene datos aleatorios tomados del módulo **random**.

Lo bueno es que podemos insertar esta URL como si fuera una imagen:

`home.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Test plot</title>
</head>
<body>
    <h2>Gráfico embebido por imagen</h2>
    <p>Presionar F5 para generar nueva muestra: </p>
    <img src="/plot/" width="600px" />
</body>
</html>
```

Quedando finalmente la página principal de la siguiente forma:

<div class="image">
   <img src="{{cdn}}/python/matplotlib_2.png"/>
</div>

Si a esta idea le sumamos parámetros, ya sea por GET o POST que podemos capturar en la vista, entonces podemos añadir dinamismo y generar los gráficos como nosotros queramos. Por ejemplo pasando un parámetro GET llamado type **/plot/?type=1** donde luego con **request.GET.get['type']** podamos seleccionar el tipo de gráfico o lo que se os ocurra.

## Implementar sistema clásico de registro, login y logout

Este tutorial tiene como objetivo mostrar cómo utilizar las funciones que ofrece Django para registrar y autenticar usuarios utilizando sus apps y formularios internos. No enseñaré a programar funciones extendidas como podrían ser la de cambiar la contraseña o enviar emails de verificación, pues serían funcionalidades para tratar en tutoriales a parte.

Para este experimento vamos a suponer que necesitamos crear una sección privada sólo para usuarios registrados. Esta área exclusiva la manejaremos dentro de una app llamada **users** que también gestionará los formularios de inicio de sesión y login:

```bash
python manage.py startapp users
```

Una vez la tengáis creada no olvidéis activarla en el **settings.py**.

Tendremos básicamente 4 vistas en la aplicación de usuarios:

* **welcome**: Manejará la bienvenida al área para miembros y redireccionará a la vista de identificación si el usuario no ha iniciado la sesión.
* **register**: Manejará el formulario de registro de usuarios y autenticará al usuario automáticamente al registrarse.
* **login**: Manejará el formulario de identificación de usuarios y redireccionará a la portada si las credenciales son correctas.
* **logout**: Manejará la acción de cerrar la sesión y redirecciona a la vista de la portada de nuevo.

Podemos crearlas inicialmente con el mínimo contenido:

`views.py`
```python
from django.shortcuts import render, redirect

def welcome(request):
    return render(request, "users/welcome.html")

def register(request):
    return render(request, "users/register.html")

def login(request):
    return render(request, "users/login.html")

def logout(request):
    # Redireccionamos a la portada
    return redirect('/')
```

Las URL que las manejarán serán las siguientes:

`proyecto/urls.py`
```python
from django.contrib import admin
from django.urls import path
from users import views

urlpatterns = [
    path('', views.welcome),
    path('register', views.register),
    path('login', views.login),
    path('logout', views.logout),

    path('admin/', admin.site.urls),
]
```

Vamos a empezar con el **logout** porque es la acción más sencilla, sólo tenemos que llamar a la función de mismo nombre que encontraremos en el módulo **django.contrib.auth**. Os sugiero importar la función con otro nombre porque de esa forma podemos usar **logout** en la función de la vista:

`views.py`
```python
from django.contrib.auth import logout as do_logout

# ...

def logout(request):
    # Finalizamos la sesión
    do_logout(request)
    # Redireccionamos a la portada
    return redirect('/')
```

Tan sencillo como esto.

A continuación nos centraremos en añadir una validación a la portada que redireccione al usuario al **login** en caso de no estar autenticado, así protegeremos su contenido:

`views.py`
```python
def welcome(request):
    # Si estamos identificados devolvemos la portada
    if request.user.is_authenticated:
        return render(request, "users/welcome.html")
    # En otro caso redireccionamos al login
    return redirect('/login')
```

El contenido de la portada podría ser el siguiente:

`welcome.html`
```html
{% raw %}<h2>Área para miembros</h2>
<p>
    Bienvenido <b>{{request.user.username}}</b>, 
    esta página es exclusiva para usuarios registrados.
</p>
<hr />
<a href="/logout">Cerrar sesión</a>{% endraw %}
```

Al añadir este código si intentamos acceder a la la raíz del sitio **/** nos redireccionará al **/login** que aún no hemos creado. En caso de ver la portada podría ser por tener una sesión activa préviamente desde el panel de administrador, ya que se gestionan con la misma app interna de Django. Si la cerráis desde el enlace inferior os llevará al **login**.

El formulario de identificación es la cosa más sencilla del mundo, sólo necesitamos un campo para el nombre del usuario y otro para la contraseña. Podríamos crearlos manualmente pero también podemos usar los [built-in forms de Django](https://docs.djangoproject.com/en/dev/topics/auth/default/#module-django.contrib.auth.forms).

Así que vamos a importar el formulario de autenticación llamado **AuthenticationForm** y dejaremos que él lo gestione todo, nosotros sólo lo validaremos e iniciaremos la sesión si la información es correcta:

`views.py`
```python
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as do_login

# ...

def login(request):
    # Creamos el formulario de autenticación vacío
    form = AuthenticationForm()
    if request.method == "POST":
        # Añadimos los datos recibidos al formulario
        form = AuthenticationForm(data=request.POST)
        # Si el formulario es válido...
        if form.is_valid():
            # Recuperamos las credenciales validadas
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            # Verificamos las credenciales del usuario
            user = authenticate(username=username, password=password)

            # Si existe un usuario con ese nombre y contraseña
            if user is not None:
                # Hacemos el login manualmente
                do_login(request, user)
                # Y le redireccionamos a la portada
                return redirect('/')

    # Si llegamos al final renderizamos el formulario
    return render(request, "users/login.html", {'form': form})
```

El template quedaría de la siguiente forma, dejando que sea el propio Django quién renderice el formulario:

`login.html`
```html
{% raw %}<h2>Iniciar sesión</h2>
<form method="POST">
    {{ form.as_p }}
    {% csrf_token %}
    <button type="submit">Login</button>
</form>
<hr />
<a href="/register">Registrar usuario</a>{% endraw %}
```

Con esto ya tendremos implementada la identificación:

<div class="image">
    <img src="{{cdn}}/django/django_classic_auth_3.png"/>
</div>

Si no tenéis un usuario os recomiendo crear uno desde la terminal para probarlo, pero recordad antes hacer una migración inicial:

```bash
python manage.py migrate
python manage.py createsuperuser
```

Además lo interesante es que al ser un formulario integrado soporta la traducción dependiendo del idioma que tenemos configurado en Django y también es capaz de detectar los errores e informar si el usuario no es correcto.

<div class="image">
    <img src="{{cdn}}/django/django_classic_auth_2.png"/>
</div>

Y por último vamos con la funcionalidad de añadir nuevos usuarios.

Se maneja de forma muy parecida al **login**, ya que también hay un formulario integrado para manejar esta situación, se trata de **UserCreationForm**:

`views.py`
```python
from django.contrib.auth.forms import UserCreationForm

# ...

def register(request):
    # Creamos el formulario de autenticación vacío
    form = UserCreationForm()
    if request.method == "POST":
        # Añadimos los datos recibidos al formulario
        form = UserCreationForm(data=request.POST)
        # Si el formulario es válido...
        if form.is_valid():
            # Creamos la nueva cuenta de usuario
            user = form.save()
            # Si el usuario se crea correctamente 
            if user is not None:
                # Hacemos el login manualmente
                do_login(request, user)
                # Y le redireccionamos a la portada
                return redirect('/')

    # Si llegamos al final renderizamos el formulario
    return render(request, "users/register.html", {'form': form})
```

El template sería prácticamente un calco del de **login**:

`register.html`
```html
{% raw %}<h2>Registrar usuario</h2>
<form method="POST">
    {{ form.as_p }}
    {% csrf_token %}
    <button type="submit">Registrar</button>
</form>
<hr />
<a href="/login">Iniciar sesión</a>{% endraw %}
```

Se verá más o menos así:

<div class="image">
    <img src="{{cdn}}/django/django_classic_auth_4.png"/>
</div>

Este formulario de registro tiene la peculiaridad de contener mucho texto de ayuda a la hora de crear las cuentas, pero si queremos podemos esconder esa información borrando el atributo **help_text** de los tres campos del formulario:

`views.py`
```python
# Si queremos borramos los campos de ayuda
form.fields['username'].help_text = None
form.fields['password1'].help_text = None
form.fields['password2'].help_text = None

# Si llegamos al final renderizamos el formulario
return render(request, "users/register.html", {'form': form})
```

Así tendríamos un formulario más limpio, aunque conservaremos los mensajes de error si se introduce un nombre de usuario en uso o si las contraseñas no superan la validación mínima:

<div class="image">
    <img src="{{cdn}}/django/django_classic_auth_5.png"/>
</div>

## Extender el UserCreationForm para registrarse con el email

El sistema de usuarios en Django tiene un problema y es que por defecto utiliza únicamente el usuario y la contraseña. Sin embargo en la actualidad es cada vez más común que los sitios en lugar de un "nick" utilicen el correo electrónico como usuario:

Ya os enseñé a [implementar un sistema clásico de registro, login y logout](/tutorial/django-sistema-registro-login-logout), así que vamos a extender esa lógica para obligar al usuario a registrarse e iniciar sesión utilizando su correo electrónico:

<div class="image">
    <img src="{{cdn}}/django/django_auth_email_1.png"/>
</div>

La solución más sencilla consiste en engañar al usuario, para que en lugar de registrarse con un nombre utilice su correo electrónico.

Así que vamos a extender el formulario de registro de Django **UserCreationForm** para que en lugar de **Nombre de usuario** muestre el texto **Correo electrónico**. Podemos hacerlo dentro del fichero **forms.py** y llamaremos al nuevo formulario por ejemplo **UCFWithEmail**:

`forms.py`
```python
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

# Extendemos del original
class UCFWithEmail(UserCreationForm):
    # Ahora el campo username es de tipo email y cambiamos su texto
    username = forms.EmailField(label="Correo electrónico")

    class Meta:
        model = User
        fields = ["username", "password1", "password2"]
```

Ahora en la vista sólo tenemos que cambiar el formulario **UserCreationForm** por nuestro **UCFWithEmail**:

```python
# Estas son las líneas que cambian
from .forms import UCFWithEmail
form = UCFWithEmail()
form = UCFWithEmail(data=request.POST)
```

Y ya lo tendremos:

<div class="image">
    <img src="{{cdn}}/django/django_auth_email_1.png"/>
</div>

Ahora si quisiéramos cambiar el texto **Nombre de usuario** también en el formulario de login:

<div class="image">
    <img src="{{cdn}}/django/django_auth_email_3.png"/>
</div>

Podemos hacer lo mismo extendiendo el formulario **AuthenticationForm** en nuestro propio **AFWithEmail**:

`forms.py`
```python
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User

# Extendemos del original
class AFWithEmail(AuthenticationForm):
    # Ahora el campo username es de tipo email y cambiamos su texto
    username = forms.EmailField(label="Correo electrónico")

    class Meta:
        model = User
        fields = ["username", "password"]
```

Para usarlo en la vista, igual que antes, sólo tenemos que cambiar la clase del formulario por la nuestra.

```python
# Estas son las líneas que cambian
from .forms import UCFWithEmail, AFWithEmail
form = AFWithEmail()
form = AFWithEmail(data=request.POST)
```

Y listo, ya lo tendremos:

<div class="image">
    <img src="{{cdn}}/django/django_auth_email_4.png"/>
</div>

Faltaría sólamente arreglar un detalle durante la validación para que en lugar de **Nombre de usuario** muestre **Correo electrónico**, pero es algo tedioso porque el texto se encuentra dentro de las traducciones de Django, sería más fácil diseñar el formulario manualmente, pero bueno, dejando de banda ese detalle esta forma funciona genial:

<div class="image">
    <img src="{{cdn}}/django/django_auth_email_5.png"/>
</div>

Vamos a ver cómo utilizar **inline forms**, ya sea a través del administrador o en nuestras propias vistas.

Los **inlines** son formularios que surgen al crear modelos relacionados, normalmente de tipo **Foreign Key**.

El concepto se ve muy fácilmente en un ejemplo, así que vamos a utilizar como base el tutorial de [crear, editar y borrar instancias de modelos con formularios](/tutorial/django-formularios-crear-editar-instancias) y lo extenderemos un poco.

Supongamos que tenemos este modelo **Persona**:

`models.py`
```python
from django.db import models

class Persona(models.Model):
    nombre = models.CharField(max_length=100)
    edad = models.SmallIntegerField()

    def __str__(self):
        return self.nombre
```

Ahora queremos crear diferentes tareas para cada **Persona**, para ello vamos a crear un modelo relacionado llamado **Tarea**, con un nombre de tarea y una relación la persona que la tendrá asignada:

`models.py`
```python
class Tarea(models.Model):
    nombre = models.CharField(max_length=100)
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre
```

Hasta aquí sin mucha complicación.

Entonces, para añadir al panel de administrador estas tareas en el propio formulario de cada persona para manejar sus tareas cómodamente podemos usar inlines.

Podemos registrar el nuevo admin para **Tarea** en el **admin.py**, pero en lugar de hacerlo como un modelo tradicional, lo haremos como un **inline** y lo asignaremos al admin de **Persona**, fijaros:

`admin.py`
```python
# Creamos el inline para el modelo tarea
class TareaInline(admin.TabularInline):
    model = Tarea
    # Mostramos dos inlines acíos por defecto
    extra = 2

class PersonaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'edad')
    # Registramos el inline en la persona
    inlines = [TareaInline]
```

Con esto ya lo tenemos, si vamos al administrador veremos la nueva estructura y podremos crear nuevas tareas en la parte inferior, teniendo siempre dos huecos libres para añadir otras:

<div class="image">
    <img src="{{cdn}}/django/django_inlines_1.png"/>
</div>

A parte de la forma **TabularInline** para mostrar los campos horizontalmente también existe **StackedInline** para hacerlo verticalmente:

```python
TareaInline(admin.StackedInline)
```

Así es como se vería en nuestro ejemplo de tareas, no se nota mucho porque sólo tenemos un campo:

<div class="image">
    <img src="{{cdn}}/django/django_inlines_2.png"/>
</div>

Lo que hemos hecho en el panel de administrador está muy bien, pero ¿sé podrá hacer en nuestras propias vistas? Veamos cómo se hace.

En nuestra aplicación ya tenemos un formulario para editar personas, es el siguiente:

`view.py`
```python
def edit(request, persona_id):
    instancia = Persona.objects.get(id=persona_id)
    form = PersonaForm(instance=instancia)
    if request.method == "POST":
        form = PersonaForm(request.POST, instance=instancia)
        if form.is_valid():
            instancia = form.save(commit=False)
            instancia.save()
    return render(request, "core/edit.html", {'form': form})
```

Lo tengo perfectamente documentado en el otro tutorial y se ve de esta forma:

<div class="image">
    <img src="{{cdn}}/django/django_inlines_3.png"/>
</div>

Nuestro objetivo es mostrar debajo los **inline** igual que hacemos en el panel de administrador.

Para ello necesitamos contar con un formulario para manejar las instancias de **Tarea** y luego registrarlo como componente para un **inline form**, algo que haremos haciendo uso de un modelo de Django llamado **inlineformset_factory**:

`forms.py`
```python
from django.forms import ModelForm
from django.forms.models import inlineformset_factory
from .models import Persona, Tarea

class PersonaForm(ModelForm):
    class Meta:
        model = Persona
        fields = ['nombre', 'edad']

class TareaForm(ModelForm):
    class Meta:
        model = Tarea
        fields = ['nombre']

# Aquí registramos nuestro inline formset
TareasInlineFormSet = inlineformset_factory(
    Persona, Tarea, form=TareaForm, 
    extra=2, can_delete=True)
```

Básicamente le estamos diciendo que nuestro formset está formado por los modelos **Persona** haciendo de padre y **Tarea** de hijo, mostrándose estos últimos con el formulario **TareaForm** con dos huecos y la opción de borrar las tareas habilitada.

Ahora viene la parte importante, tenemos que hacer uso de este inline en la vista **edit**, recuperar sus datos y guardarlos cuando se reciben:

`view.py`
```python
from .forms import PersonaForm, TareasInlineFormSet

def edit(request, persona_id):
    instancia = Persona.objects.get(id=persona_id)
    form = PersonaForm(instance=instancia)

    # Creamos el formset de tareas con los datos de la instancia
    formset = TareasInlineFormSet(instance=instancia)

    if request.method == "POST":
        form = PersonaForm(request.POST, instance=instancia)

        # Actualizamos también los datos del formset de tareas
        formset = TareasInlineFormSet(request.POST, instance=instancia)

        if form.is_valid():

            instancia = form.save(commit=False)
            instancia.save()

            # Guardamos también el formset si es válido
            if formset.is_valid():
                formset.instance = instancia
                formset.save()

	        # Actualizamos la pantalla del formulario
	        return redirect(f'/edit/{instancia.id}')

    # Si llegamos al final renderizamos el formulario y el formset
    return render(
        request, "core/edit.html", {'form': form, 'formset': formset})
```

Como véis es cuestión de repetir lo mismo pero con el **formset** como si fuera otro formulario cualquiera.

En este punto nos faltaría sólo añadir renderizar los inlines en el HTML, lo podemos hacer recorriendo con un for el **formset** que enviamos, pues en realidad es una colección de subformularios:

`edit.html`
```html
{% raw %}<form method="POST">
  {{ form.as_p }}
  {% csrf_token %} 
  
  <h3>Lista de tareas</h3>

  {% for form_tarea in formset %}
    {{ form_tarea }} <br />
  {% endfor %}

  <!-- Este miniformulario maneja el inline -->
  {{ formset.management_form }}

  <br><button type="submit">Editar</button>
</form>{% endraw %}
```

Es extremadamente importante renderizar el **management_form**, ya que de forma oculta se encarga de manejar todos los subformilarios del inline y sin él no funcionaría nada.

Sea como sea con esto deberíamos tener los inlines funcionando perfectamente en nuestro formulario de edición:

<div class="image">
    <img src="{{cdn}}/django/django_inlines_4.gif"/>
</div>

## Django en Ubuntu Server con Nginx, Gunicorn y Supervisor

Hoy camparto con vosotros este tutorial para los interesados en aprender a desplegar Django en GNU/Linux de una forma cómoda y sencilla.

A continuación os resumo para qué sirve cada uno de los componentes que se utilizan en un despliegue genérico.

* **Gunicorn**: Green Unicorn es un servidor WSGI HTTP para Python (pre-fork de unicorn de ruby). Consume poco y es bastante rápido.
* **Nginx**: Es un servidor web/proxy inverso ligero de alto rendimiento y un proxy para protocolos de correo electrónico. Nos ayudará a servir ficheros estáticos.
* **Supervisor**: Es un gestor de procesos para Linux. Nos permitirá crear un proceso en segundo plano de nuestro servidor gunicorn.

**Requisitos** 

* Servidor con Nginx.
* Python 3.
* Proyecto Django ya listo para desplegar.
* Borrar del fichero **urls.py** que Django sirva los ficheros estáticos al desactivar el **DEBUG**.
* Tener configurada la variable con el directorio de los ficheros estáticos **STATIC_ROOT** en el **settings.py**:

`proyecto/settings.py`
```python
# Añadir esta línea abajo del todo dependiendo de vuestro directorio
STATIC_ROOT = os.path.join(BASE_DIR, 'static') 
```

Suponiendo que vuestro proyecto lo tendréis en **dominio.com** os recomiendo clonar el repositorio en la ruta **/var/www/dominio.com/**.

Ahora aseguraos de tener un fichero **requirements.txt** con las dependencias del proyecto en **/var/www/dominio.com/requirements.txt** y si no tenéis dependencias como mínimo que contenga a Django:

`requirements.txt`
```
django
```

Ahora vamos a instalar **Pipenv** para crear nuestro entorno virtual, para ello necesitamos **Pip** en **Python 3**:

```bash
sudo apt install python3-pip
pip3 install pipenv
```

El siguiente paso es crear el entorno e instalar las dependencias, fácil:

```bash
cd /var/www/dominio.com
pipenv install -r requirements.txt
```

Con esto ya deberíamos tener nuestro entorno creado, vamos a dejar anotada la ruta del **python** del entorno porque más adelante la necesitaremos, podemos consultar haciendo:

```
pipenv run which python
```

Os debería aparecer algo de este estilo dependiendo de vuestro usuario, que debería ser el administrador (aunque yo estoy haciendo el tutorial directamente con root):

```
/root/.local/share/virtualenvs/dominio.com-EZwa4jqa/bin/python
```

Dejadlo copiado en alguna parte.

En este punto deberíamos tener el proyecto funcionando, quizá tendréis que configurar una base de datos pero en eso no me voy a meter, en este tutorial daremos por hecho que usamos SQLite para hacerlo más sencillo:

```
pipenv run python manage.py migrate
```

Recopilamos los ficheros estáticos de las diferentes apps en el directorio static del proyecto (hay que hacerlo siempre que modifiquemos alguno), recordad tener configurada la variable **STATIC_ROOT** tal como indico arriba en los requisitos. Esto es necesario para que **Nginx** pueda servirlos correctamente:

```
pipenv run python manage.py collectstatic
```

Cualquier comando que debáis ejecutar recordad hacerlo con **pipenv run** para hacer referencia al Python del entorno virtual.

Tenemos el proyecto de Django preparado pero necesitamos un servidor para manejarlo, para ello vamos a utilizar **gunicorn**.

```bash
cd /var/www/dominio.com
pipenv install gunicorn
```

Vamos a probar si se lanza correctamente desde la raíz, justo donde está el **manage.py** (el puerto podéis cambiarlo): 

```bash
cd /var/www/dominio.com
pipenv run gunicorn proyecto.wsgi:application --bind=127.0.0.1:8000
```

Si se muestra el mensaje típico de **Listening at: http://127.0.0.1:8000** podemos hacer **Control + C** y confirmar que está funcionando bien.

El siguiente paso es mantener activo ese servidor de **gunicorn** en segundo plano, para ello usaremos el gestor de procesos **Supervisor**. 

```bash
sudo apt install supervisor
```

Ahora tenemos que crear un fichero de configuración para nuestro proyecto:

```bash
sudo nano /etc/supervisor/conf.d/dominio.com.conf
```
En él añadiremos esta simple configuración, recuperando ya la ruta al **python** de nuestro entorno virtual, la que copiamos anteriormente (atención al identificador único de vuestro entorno virtual):

`/etc/supervisor/conf.d/dominio.com.conf`
```
[program:dominio.com]
command = /root/.local/share/virtualenvs/dominio.com-EZwa4jqa/bin/python /root/.local/share/virtualenvs/dominio.com-EZwa4jqa/bin/gunicorn proyecto.wsgi:application --bind=127.0.0.1:8000
directory = /var/www/dominio.com/proyecto
user = root
```

Es muy importante poner correctamente las rutas a **python** y a **gunicorn** del entorno virtual para crear correctamente el comando con los ejecutables de ambos programas en el entorno. El usuario tiene que ser el vuestro o **root**, pero debe tener los permisos adecuados. Además si queremos tener varios Django funcionando tendremos que ponerlos en puertos diferentes, por ejemplo 8000, 8001, 8002 o los que queramos.

Para manejar el proceso debemos actualizar los cambios y activar el proyecto en **supervisor**:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start dominio.com
```

Con esto deberíamos tener **gunicorn** ejecutando **Django** en el puerto 8000 del sistema, ya sólo nos queda configurar un server block de **Nginx** haciendo de proxy reverso para enlazarlo a un dominio/subdominio y servir los ficheros estáticos.

Todas las acciones para manejar el proceso que ejecuta nuestro proyecto se pueden encontrar en la [documentación de Supervisor](http://supervisord.org/running.html#supervisorctl-actions). Los más comunes son:

* **reread**: Recarga las configuraciones de los procesos.
* **update**: Rearga las configuraciones y reinicia los procesos afectados.
* **start**: Para iniciar un proceso.
* **stop**: Para detener un proceso.
* **restart**: Para reiniciar un proceso, algo necesario para actualizar los cambios al modificar el proyecto de Django:

```bash
sudo supervisorctl restart dominio.com
```

En este punto deberías poder hacer una petición con **cURL** y ver que efectivamente os devuelve índice de vuestra página:

```bash
curl http://127.0.0.1:8000
```

Os voy a dejar la configuración genérica del sitio funcionando en un dominio en el puerto 80 no seguro y sirviendo los ficheros estáticos. Es vuestra tarea adaptarla y añadir un certificado tal como explico en el [curso de configuración básica de Ubuntu Server](/academia/gnu-linux/ubuntu-server-web/).

Primero vamos a crear un directorio para almacenar los **logs** de **nginx**:

```bash
cd /var/www/dominio.com
mkdir logs
``` 

Ahora creamos el **server block** del sitio:

```bash
sudo nano /etc/nginx/sites-available/dominio.com
```

Esta es la configuración básica:

`/etc/nginx/sites-available/dominio.com`
```
server {

    # Puerto y nombre
    listen 80;
    server_name dominio.com www.dominio.com;

    # Logs de nginx
    access_log /var/www/dominio.com/logs/nginx.access.log;
    error_log  /var/www/dominio.com/logs/nginx.error.log;

    # Ficheros estáticos
    location /static/ {
        alias /var/www/dominio.com/static/;
        expires 365d;
    }

    # Proxy reverso del puerto 8000
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 1m;
        proxy_connect_timeout 1m;
        proxy_pass http://127.0.0.1:8000;
    }

}
```

Guardamos y creamos un enlace simbólico:

```bash
cd /etc/nginx/sites-enabled
sudo ln -s ../sites-available/dominio.com
```

Finalmente reiniciamos nginx:

```bash
sudo service nginx restart
```

Si tenéis configurados los ficheros media en Django en el directorio **media** del proyecto, podéis añadir lo siguiente en la configuración (cortesía de RulezCore):

```
# Media
location /media/ {
    alias /var/www/dominio.com/media/;
}
```

Y ya deberíamos tener funcionando Django en [http://dominio.com](http://dominio.com) cargando correctamente los ficheros estáticos.

Para profundizar más sobre las opciones de configuración, como crear registros de errores y todo éso os dejo las documentaciones oficiales:

* [Documentación de Gunicorn](http://docs.gunicorn.org/en/develop/configure.html#config-file).
* [Documentación de Nginx](https://library.linode.com/web-servers/nginx/configuration/basic).
* [Documentación de Supervisor](http://supervisord.org/configuration.html).

¡Espero que os sirva!

___
<small class="edited"><i>Última edición: 16 de Marzo de 2021</i></small>