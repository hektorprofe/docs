title: Sexta App [Pages] Gestor de Páginas | Curso de Django | Hektor Profe
description: App para gestionar páginas de contenido secundario (políticas, avisos legales…).

# Sexta App [Pages] Gestor de Páginas

En este punto tenemos nuestro proyecto bastante encaminado, sólo nos falta desarrollar la app para gestionar páginas de contenido secundario (políticas, avisos legales…) y la de contacto para manejar el formulario de contacto.

La app Pages es muy sencilla, pues la estructura de una página consta únicamente de un título y un contenido. Vamos a crearla:

```
(django2) python manage.py startapp pages
```

Traducimos el nombre:

`pages/apps.py` 

```python
from django.apps import AppConfig

class PagesConfig(AppConfig):
    name = 'pages'
    verbose_name = 'Gestor de páginas'
```

Añadimos la configuración extendida:

`webempresa/settings.py` 
```python
'pages.apps.PagesConfig',
```

Y ahora el modelo Page:

`pages/models.py` 
```python
from django.db import models

class Page(models.Model):
    title = models.CharField(max_length=200, 
        verbose_name="Título")
    content = models.TextField(
        verbose_name="Contenido")
    created = models.DateTimeField(auto_now_add=True, 
        verbose_name="Fecha de creación")
    updated = models.DateTimeField(auto_now=True, 
        verbose_name="Fecha de edición")

    class Meta:
        verbose_name = "página"
        verbose_name_plural = "páginas"
        ordering = ['title']

    def __str__(self):
        return self.title
```

Creamos un admin básico:

`pages/admin.py` 
```python
from django.contrib import admin
from .models import Page

class PageAdmin(admin.ModelAdmin):
    pass

admin.site.register(Page, PageAdmin)
```

Migramos:

```
(django2) python manage.py makemigrations pages
(django2) python manage.py migrate pages
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/47.png" style="max-width:175px"/></div>

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/48.png" style="max-width:205px"/></div>

Perfecto, ahora tenemos que desarrollar las vistas. Seguiremos una lógica parecida a la del blog y sus categorías, de manera que estas páginas secundarias tengan el path **/page/&#60;page_id&#62;**.

Vamos a hacerlo:

`pages/views.py` 
```python
from django.shortcuts import render, get_object_or_404
from .models import Page

def page(request, page_id):
    page = get_object_or_404(Page, id=page_id)
    return render(request, 'pages/sample.html', {'page':page})
```

Ahora movemos el template sample.html en la propia app de páginas y **borramos la view y url sample de Core**:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/49.png" style="max-width:165px"/></div>

Creamos las urls:

`pages/urls.py` 
```python
from django.urls import path
from . import views

urlpatterns = [
    path('<int:page_id>/', views.page, name="page"),
]
```

`webempresa/urls.py` 
```python
urlpatterns = [
    path('', include('core.urls')),
    path('blog/', include('blog.urls')),
    path('page/', include('pages.urls')),
    path('services/', include('services.urls')),
    path('admin/', admin.site.urls),
]
```

Probamos si nos aparece alguna página con id 1:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/50.png" style="max-width:400px"/></div>

Perfecto, parece que funciona. Vamos a realizar la fusión, respetando los saltos de línea:

`pages/templates/pages/sample.html`
```html
{% raw %}{% extends 'core/base.html' %}

{% load static %}

{% block title %}{{page.title}}{% endblock %}

{% block content %}
<section class="page-section about-heading">
    <div class="container">
        <div class="about-heading-content mbtm">
            <div class="row">
                <div class="col-xl-9 col-lg-10 mx-auto">
                    <div class="bg-faded rounded p-5 forced">
                        <h2 class="section-heading mb-4">
                            <span class="section-heading-lower">
                                {{page.title}}</span>
                        </h2>
                        <div class="section-content">
                            {{page.content|linebreaks}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
{% endblock %}{% endraw %}
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/51.png" style="max-width:400px"/></div>

Lo tenemos listo, ya sólo falta mostrar los enlaces de las páginas en la parte inferior. Podríamos hacerlo añadiéndolas a un procesador de contexto como con las redes sociales, pero os comenté que se podía hacer de otra forma, os lo explico en la próxima lección.

___
<small class="edited"><i>Última edición: 31 de Octubre de 2018</i></small>