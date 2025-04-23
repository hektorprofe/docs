title: Primera App [Core] Vistas | Curso de Django | Hektor Profe
description: En esta lección vamos a hablar de las apps y las vistas.

# Primera App [Core] Vistas

En esta lección vamos a hablar de las *apps*.

Django apuesta por un sistema de reutilización de código organizado en *apps*, algo así como aplicaciones internas que implementan funcionalidades específicas. 

¿Recordáis el mensaje que aparecía antes de migrar la base de datos? Allí se hablaba de las apps *admin, auth, contenttypes y sessions*. Bueno, pues esas son algunas de las apps integradas en Django que sirven para gestionar el panel de administrador y la autenticación de usuarios entre otras cosas.

Las Apps activas en un proyecto de Django, las encontramos definidas en el fichero de configuración **settings.py**, en la lista *INSTALLED_APPS*:

`webpersonal/settings.py`
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
```

No sé si lo recordaréis, pero al migrar algunas de estas apps no aparecían: Messages y StaticFiles. Eso es porque no necesariamente todas las apps requieren utilizar la base de datos, aunque por contra sí requieran estar activadas en esta lista.

La genialidad de Django recae en que que a parte de incluir muchas apps genéricas también nos permite crear las nuestras propias, y eso estimados alumnos es la mejor idea de este framework, pues una app no tiene que limitarse a un solo proyecto, sino que se puede reutilizar en varios. Sin ir más lejos, en los repositorios de PyPy existen miles de apps de Django creadas por la comunidad y que en pocos minutos podríamos estar utilizando sin mucha complicación.

En este curso vamos a crear un montón de apps, desde un portafolio hasta un blog, pasando por gestores de contenidos con páginas dinámicas y otras apps para manejar el registro de usuarios y sus perfiles. Todas y cada una de ellas son reutilizables y os servirán para un montón de proyectos.

Por lo tanto podríamos concluir en que, mientras una app es una aplicación web que implementa una funcionalidad y por sí misma no sirve para nada, un proyecto es un conjunto de configuraciones a las que se "conectan" esas apps para que todo unido de lugar a un sitio web completo. Un proyecto puede contener múltiples apps, y una app puede ser incluida en múltiples proyectos.

Ahora que conocemos la diferencia entre proyecto y app, vamos a crear nuestra primera app. Será el núcleo de nuestra web personal (el **core** en inglés) y nos servirá como base para aprender como fluyen los datos en Django.

Así que vamos a la terminal, presionamos *Control + C* para cancelar la ejecución del servidor y escribimos: 

```
python manage.py startapp core
```

Al hacerlo podréis observar como se ha creado un nuevo directorio core en nuestro proyecto:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/11.png"/></div>

Vamos a ir descubriendo los ficheros que conforman la app core sobre la marcha, no tiene mucho sentido explicar cosas que no utilizaremos hasta dentro de varias horas. 

De todos estos ficheros el que nos interesa es ese llamado **views.py**. Este fichero es uno de los más importantes y en él se definen las vistas de la app. Una vista hace referencia a la lógica que se ejecuta cuando se hace una petición a nuestra web, y lo que vamos a hacer es crear una vista para procesar la petición a la raíz de nuestro sitio, lo que sería la portada.

Vamos a ir arriba del todo y vamos a importar un método del módulo **django.http** llamado **HttpResponse**:

`core/views.py`
```python
from django.shortcuts import render, HttpResponse
```

Este método que nos permite contestar a una petición devolviendo un código, así que vamos a definir una vista para la portada y devolveremos algo de HTML de ejemplo:

`core/views.py`
```python
def home(request):
    return HttpResponse("<h1>Mi Web Personal</h1><h2>Portada</h2>")
```

Cada vista se corresponde con una función del fichero **views.py**. Podéis usar el nombre que queráis pero como esta es la portada yo le llamo home. Además notad que se recibe un argumento llamado request, se trata de la petición y contiene mucha información, más adelante haremos uso de ella.

Ahora ya tenemos la vista con la portada, pero todavía no le hemos dicho a Django en qué URL tiene que mostrarla.

¿Recordáis el fichero **webpersonal/urls.py** dentro del directorio de configuración del proyecto? Pues es momento de volver ahí. Siguiendo la documentación superior, vamos a hacer lo que nos indican las instrucciones:

`webpersonal/urls.py`
```python
from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('', views.home, name="home"),
    path('admin/', admin.site.urls),
]
```

¿Qué significa esto? Pues que del package **core** (notad ese  **&#95;&#95;init.py&#95;&#95;**) importamos el módulo **views**, es decir, de la app **core** importamos las vistas. Y a continuación creamos un **patrón url**, justo en la raíz del sitio (cadena vacía) desde el que llamaremos a la vista **views.home** a la que damos el nombre **home**.

Ahora guardamos el fichero, ponemos el servidor en marcha y comprobamos la portada de nuestra web:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/12.png"/></div>

¡Vaya! Ahora en lugar de aparecernos la bienvenida genérica de Django nos muestra el HTML que hemos devuelto en vista home. ¿Vais captando como fluye la información? Dentro del fichero **urls.py** establecemos un path indicando la URL donde vamos a enlazar una vista de la **app core** que a su vez estará devolviendo una respuesta HTML.

Sólo esto ya nos da mucho juego. Imaginaros que nuestra respuesta es una variable cadena, la de cosas que podemos hacer con Python y luego plasmarlas en una página HTML:

`core/views.py`
```python
def home(request):
    html_response = "<h1>Mi Web Personal</h1>"
    for i in range(10):
        html_response += "<p>Esto es la portada</p>"
    return HttpResponse(html_response)
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/13.png"/></div>

Pues esto estimados alumnos es el backend, la parte oculta que gracias a la programación es capaz de otorgar dinamismo al frontend.

Vamos a dejar la vista como la teníamos y continuaremos con la siguiente lección.

`core/views.py`
```python
def home(request):
    return HttpResponse("<h1>Mi Web Personal</h1><h2>Portada</h2>")
```

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>