title: Personalizando el administrador (1) | Curso de Django | Hektor Profe
description: Lo que tenemos hasta ahora es sólo la configuración base del administrador, si queremos personalizarlo un poco tendremos que configurar algunas cosas.

# Personalizando el administrador (1)

¡Vamos a crear un proyecto!

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/33.png"/></div>

Ahora le damos a grabar y...

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/34.png"/></div>

Ya lo tenemos creado.

En este punto seguro que empezáis a tener algunas dudas, por ejemplo. ¿Si todo está en español porque hemos creado el modelo en inglés, no sería mejor hacerlo en español? o ¿Por qué en la lista de proyectos nos aparece *Project object (1)* en lugar del nombre del proyecto? o ¿Dónde se guarda la imagen que hemos añadido al proyecto? 

Calma hombre calma... Lo que tenemos hasta ahora es sólo la configuración base del administrador, si queremos personalizarlo un poco tendremos que configurar algunas cosas.

## Nombre de la app

Nuestra aplicación se llama Portfolio en inglés y quizá queremos que en el administrador aparezca Portafolio en español. Para lograrlo hay que cambiar dos cosas, primero añadir un campo **verbose_name** en el fichero **portfolio/apps.py**:

`portfolio/apps.py` 

```python
from django.apps import AppConfig

class PortfolioConfig(AppConfig):
    name = 'portfolio'
    verbose_name = 'Portafolio'
```

De esta forma podemos establecer una configuración extendida. 

Lo segundo es establecer esta configuración en **settings.py**, lo cual se hace llamando a esta clase **PortfolioConfig** en lugar de **portfolio** a secas:

`webpersonal/settings.py` 

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',
    'portfolio.apps.PortfolioConfig',  # <====
]
```

Ahora si volvemos a nuestro admin ya nos aparecerá traducido:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/35.png"/></div>

## Campos en español

Vamos de vuelta a nuestro fichero de modelos e introduciremos dos nuevos conceptos para nuestros modelos, la subclase Meta y el método especial **&#95;&#95;str&#95;&#95;**.

Al crear la clase **Proyecto** hemos decidido ponerle **Project** para seguir una lógica en todo el proyecto, pero podemos cambiar el nombre a mostrar en el panel de forma muy sencilla creando una subclase con **Meta** información:

`portfolio/models.py`
```python
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "proyecto"
        verbose_name_plural = "proyectos"
```

También es aconsejable poner un campo de ordenación por defecto para nuestros registros, que en nuestro caso podría ser la fecha de creación:

`portfolio/models.py`
```python
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "proyecto"
        verbose_name_plural = "proyectos"
        ordering = ["-created"]  # <=====
```

Ordering es una lista porque permite ordenar con prioridades entre distintos campos. Además si añadimos un guión delante del nombre del campo, es posible ordenar de forma revertida. Al hacer **-created**, le indicamos que nos muestre primero los proyectos de más actuales a más antiguos.

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/36.png"/></div>

Ahora para que nos aparezca el nombre del proyecto en el desplegable simplemente podemos redefinir el método especial **&#95;&#95;str&#95;&#95;** para que devuelva la cadena que nosotros queramos:

`portfolio/models.py`
```python
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "proyecto"
        verbose_name_plural = "proyectos"
        ordering = ["-created"] 

    def __str__(self):
        return self.title  # <=====
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/37.png"/></div>

En cuanto a los nombres de los campos, también podemos utilizar el atributo **verbose_name** para cambiarlos:

`portfolio/models.py`
```python 
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200, 
        verbose_name="Título")
    description = models.TextField(
        verbose_name="Descripción")
    image = models.ImageField(
        verbose_name="Imagen")
    created = models.DateTimeField(auto_now_add=True, 
        verbose_name="Fecha de creación")
    updated = models.DateTimeField(auto_now=True,
        verbose_name="Fecha de edición")

    class Meta:
        verbose_name = "proyecto"
        verbose_name_plural = "proyectos"
        ordering = ["-created"]

    def __str__(self):
        return self.title
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/38.png"/></div>

## Campos especiales

Como podréis observar los campos de fecha y hora automatizados no aparecen en el adminstrador, Django los esconde para que no se puedan modificar, pero podemos mostrarlos como campos de tipo "sólo lectura". 

Para hacerlo tenemos que extender un poco la configuración base del administrador de la siguiente forma:


`portfolio/admin.py`
```python
from django.contrib import admin
from .models import Project

class ProjectAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')

admin.site.register(Project, ProjectAdmin)
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/39.png"/></div>

Como véis poco a poco vamos dando forma a nuestro panel de administrador. A medida que avance el curso os iré enseñando más y más funcionalidades. 

## Servir ficheros media

Por ahora sólo hay una cosa que no tenemos del todo bien, y es la imagen. ¿Dónde habrá ido a parar? Como no hemos configurado un directorio para las subidas, lo más seguro es que esté en la raíz de nuestro proyecto:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/40.png"/></div>

Esto no es nada práctico y además es peligroso. ¿Os imagináis que todas las imágenes y documentos que sube un usuario se guardasen aquí? Al final podríamos tener cientos o miles de ficheros en el mismo directorio.

Bueno, pues antes de nada una pequeña apreciación. Los ficheros que suben los usuarios no son ficheros "estáticos", no existen desde el principio. Estos se llaman ficheros "media" o multimedia.

Para que Django pueda servir ficheros Media durante el desarrollo, necesitaremos crear un directorio donde almacenar todos estos archivos. Normalmente le llamaremos **media** y lo crearemos en la raíz de nuestro proyecto.

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/41.png"/></div>

Ahora nos dirigiremos al fichero **settings.py** y abajo del todo añadiremos estas dos variables, una para indicar indicar la URL externa y otra para el directorio interno donde se encuentran los ficheros media (unido al core_dir del proyecto):

`webpersonal/settings.py`
```python
# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
```

Ahora vamos a nuestro modelo Proyecto y vamos a añadir a la imagen un atributo llamado **upload_to**:

`portfolio/models.py`
```python
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200, 
        verbose_name="Título")
    description = models.TextField(
        verbose_name="Descripción")
    image = models.ImageField(upload_to="projects",  # <=====
        verbose_name="Imagen")
    created = models.DateTimeField(auto_now_add=True, 
        verbose_name="Fecha de creación")
    updated = models.DateTimeField(auto_now=True,
        verbose_name="Fecha de edición")

    class Meta:
        verbose_name = "proyecto"
        verbose_name_plural = "proyectos"
        ordering = ["-created"]

    def __str__(self):
        return self.title
```

Con esto le diremos a Django que suba todas las imágenes al directorio **media/projects**. Él mismo se encargará de crear el directorio si no existe. Haced la prueba, subid de nuevo la imagen y mirad los directorios:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/42.png"/></div>

Ahora fijaos en una cosa, si abrimos nuestro primer proyecto no podemos acceder a la imagen:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/43.png"/></div>

Esto sucede porque el servidor de desarrollo no puede servir estos ficheros, de eso normalmente se encargaría un servidor de producción como Apache o Nginx ya en la etapa de producción. Sin embargo y como algo temporal podemos hacer que lo haga sólo cuando tengamos el modo *DEBUG* activo.

Vamos a nuestro fichero **settings/urls.py** y vamos a editarlo de la siguiente manera:

`webpersonal/urls.py`
```python
from django.contrib import admin
from django.urls import path
from core import views

from django.conf import settings  # <=====

urlpatterns = [
    path('', views.home, name="home"),
    path('about-me/', views.about, name="about"),
    path('portfolio/', views.portfolio, name="portfolio"),
    path('contact/', views.contact, name="contact"),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, 
        document_root=settings.MEDIA_ROOT)
```

Ahora si probamos el enlace de nuevo nos aparecerá la imagen:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/44.png"/></div>

Lo que hemos hecho es cargar el módulo de ficheros estáticos genérico y hacer que Django sirva ficheros como algo excepcional, sólo si tenemos el modo *DEBUG* activo. Consideradlo un truco para la fase de desarrollo.

Con nuestro administrador listo y funcionando, el siguiente paso será recuperar nuestros proyectos en la vista **portfolio** y mostrarlos en el template **porfolio.html**.

Por cierto, no olvidéis borrar la imagen del directorio raíz, ya no pinta nada ahí. 

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>