title: Quinta App [Social] Redes Sociales | Curso de Django | Hektor Profe
description: App social para permitirle a nuestros clientes configurar sus redes sociales.

# Quinta App [Social] Redes Sociales

En esta lección toca crear la app Social para permitirle a nuestros clientes configurar sus redes sociales.

```
(django2) python manage.py startapp social
```

`social/models.py`
```python
from django.db import models

class Link(models.Model):
    key = models.SlugField( 
        verbose_name="Nombre clave", max_length=100, unique=True)
    name = models.CharField( 
        verbose_name="Red social", max_length=200)
    url = models.URLField(
        verbose_name="Enlace", max_length=200, null=True, blank=True)
    created = models.DateTimeField(
        verbose_name="Fecha de creación", auto_now_add=True)
    updated = models.DateTimeField(
        verbose_name="Fecha de edición", auto_now=True)

    class Meta:
        verbose_name = "enlace"
        verbose_name_plural = "enlaces"
        ordering = ['name']

    def __str__(self):
        return self.name
```

Al modelo lo llamaremos link (enlace) y constará de tres sencillos campos: una clave de tipo Slug la cual nos obligará  a utilizar caracteres alfanuméricos, guiones o barras; y que utilizaremos para consultar el registro a modo de diccionario, un nombre para la red social y una dirección URL. Es interesante comentar que sólo cambiando la url por un texto podríais conseguir una especie de panel de opciones configurables por el cliente, dándole la opción de cambiar cadenas de caracteres por ejemplo con el título de la página, metadatos o cualquier otro campo que podáis mostrar en el template.

A comentar también que como no puede haber dos enlaces para la misma red social, haremos que la clave sea única. Además aunque nosotros demos al cliente la posibilidades añadir varias redes sociales, es posible que algunas no las necesite, por lo que dejaremos el enlace como optativo.

Vamos a cambiarle el **verbose_nombre** a "Redes sociales", que siempre quedará mejor. La activamos y la migramos:

`social/apps.py`
```python
from django.apps import AppConfig

class SocialConfig(AppConfig):
    name = 'social'
    verbose_name = 'Redes sociales'
```

Activamos la app con la configuración extendida:

`webempresa/settings.py`
```python
'social.apps.SocialConfig',
```

Migramos:

```
(django2) python manage.py makemigrations social
(django2) python manage.py migrate social
```

Creamos un admin simple:

`social/admin.py`
```python 
from django.contrib import admin
from .models import Link

# Register your models here.
class LinkAdmin(admin.ModelAdmin):
    pass

admin.site.register(Link, LinkAdmin)    
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/44.png" style="max-width:150px"/></div>

Y algunas redes básicas:

| Clave            | Nombre      | Enlace          |   |   |
|------------------|-------------|-----------------|---|---|
|  			LINK_TWITTER 		   |  			Twitter 		   |  			twitter.com 		   |   |   |
|  			LINK_FACEBOOK 		  |  			Facebook 		  |  			facebook.com 		  |   |   |
|  			LINK_INSTAGRAM 		 |  			Instagram 		 |  			instagram.com 		 |   |   |

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/45.png" style="max-width:125px"/></div>

Vosotros podéis añadir las que queráis, aunque tened en cuenta que si son muy raras tal vez la librería Fontawesome no tenga un icono para mostrarlas.

Sea como sea ya tenemos los enlaces en la base de datos, ahora sólo tenemos que mostrarlas en nuestra web. Lo más sencillo sería ir a cada vista, recuperar las redes y enviarlas a sus respectivos templates… Pero está claro que eso no es óptimo ni elegante, de hecho es redundante, difícil de mantener y de extender. En su lugar aprenderemos algo mejor, pero lo veremos en la siguiente lección.

___
<small class="edited"><i>Última edición: 31 de Octubre de 2018</i></small>