title: Tercera App [Services] Modelo y admin | Curso de Django | Hektor Profe
description: 

# Tercera App [Services] Modelo y admin

La app Services es en esencia lo mismo que la app portafolio de la web personal así que estoy seguro de que podréis implementarla sin ayuda. Para hacerlo más llevadero la crearás en dos partes. Empezarás por crear el modelo y configurando el panel de administrador. Aquí tienes las indicaciones:

* Configura los ficheros media que funcionen en el servidor de desarrollo.
* Crea una app Services y añádela a la lista *INSTALLED_APPS* en settings.py.
* El modelo Service constará de 6 campos obligatorios, podéis utilizar de referencia el modelo Project de la app Portfolio del primer proyecto:
    * **Title**: Un título con 200 caracteres de longitud máxima.
    * **Subtitle**: Un subtítulo con 200 caracteres de longitud máxima.
    * **Content**: Un texto de tamaño indefinido.
    * **Image**: Una imagen para mostrar de fondo almacenada en el directorio media/services.
    * **Created**: Un campo automático para gestionar la fecha y hora de creación.
    * **Updated**: Un campo automático para gestionar la fecha y hora de última actualización.
* Haz una migración completa (makemigrations y migrate a secas) y crea un superusuario para poder acceder al panel de administrador.
* Ahora configura la app para ser manejable desde el panel de administrador. Debes mostrar los campos especiales Created y Updated en modo sólo lectura.
* Toda la información de la app deberá aparecer en español (admin en general, nombre de la app, nombre del modelo y sus campos).

## Solución

Creamos el directorio media en la raíz del proyecto:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/13.png" style="max-width:200px"/></div>

Añadimos la configuración *MEDIA* al **settings.py**:

`webempresa/settings.py`
```python
# Media config
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

Configuramos el PATH en **webempresa/urls.py** para servir ficheros media en modo *DEBUG*:

`webempresa/urls.py`
```python
from django.conf import settings

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, 
        document_root=settings.MEDIA_ROOT)
```

Una vez preparados los ficheros media creamos la app y la añadimos a **settings.py**:

```
(django2) python manage.py startapp services
```

Creamos el modelo Service, podemos basarnos en el de Proyecto que hicimos para la app Portafolio:

`services/models.py` 
```python
from django.db import models

class Service(models.Model):
    title = models.CharField(max_length=200, 
        verbose_name="Título")
    subtitle = models.CharField(max_length=200, 
        verbose_name="Subtítulo")
    content = models.TextField(
        verbose_name="Contenido")
    image = models.ImageField(verbose_name="Imagen", 
        upload_to="services")
    created = models.DateTimeField(auto_now_add=True, 
        verbose_name="Fecha de creación")
    updated = models.DateTimeField(auto_now=True, 
        verbose_name="Fecha de edición")

    class Meta:
        verbose_name = "servicio"
        verbose_name_plural = "servicios"
        ordering = ['-created']

    def __str__(self):
        return self.title
```

Creamos las migraciones:

```
(django2) python manage.py makemigrations
(django2) python manage.py migrate
```

Creamos un superusuario:
```
(django2) python manage.py createsuperuser
```

Activamos la app en el **admin.py**:

`services/admin.py` 
```python 
from django.contrib import admin
from .models import Service

class ServiceAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')

admin.site.register(Service, ServiceAdmin)
```

Ya podemos acceder al admin:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/14.png" style="max-width:200px"/></div>

Finalmente tocaría acabar de traducir el nombre de la app y configurar django en español:

`webempresa/settings.py` 
```python
LANGUAGE_CODE = 'es'
```

`services/apps.py` 
```python
from django.apps import AppConfig

class ServicesConfig(AppConfig):
    name = 'services'
    verbose_name = 'Gestor de servicios'
```

Activamos la configuración extendida:

`webempresa/settings.py` 
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',
    'services.apps.ServicesConfig',
]
```

Y ya lo tenemos:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/15.png" style="max-width:200px"/></div>

___
<small class="edited"><i>Última edición: 29 de Octubre de 2018</i></small>