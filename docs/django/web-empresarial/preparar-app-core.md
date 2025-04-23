title: Preparar la app [Core] | Curso de Django | Hektor Profe
description: Con el objetivo de practicar lo que hemos aprendido hasta ahora, tendrás que preparar el terreno para este segundo proyecto.

# Preparar la app [Core]

Con el objetivo de practicar lo que hemos aprendido hasta ahora, tendrás que preparar el terreno para este segundo proyecto.

* Crea un proyecto Django de nombre webempresa utilizando nuestro entorno virtual django2. 

```
(django2) django-admin startproject webempresa
```

* Añade una app Core con una vista para cada página de la cafetería, deberás añadir las respectivas URL y lograr que todo funcione. Por ahora puedes devolver un HttpResponse simple con el nombre de las página:
    * **Inicio** home/
    * **Historia** about/
    * **Servicios** services/
    * **Visítanos** store/
    * **Contacto** contact/
    * **Blog** blog/
    * **Sample** sample/ (esta es para páginas de prueba)

```
(django2) python manage.py startapp core
```
`core/views.py`
```python
from django.shortcuts import render, HttpResponse

def home(request):
    return HttpResponse("Inicio")

def about(request):
    return HttpResponse("Historia")

def services(request):
    return HttpResponse("Servicios")

def store(request):
    return HttpResponse("Visítanos")

def contact(request):
    retuyrn HttpResponse("Contacto")

def blog(request):
    return HttpResponse("Blog")

def sample(request):
    return HttpResponse("Sample")
```

`core/urls.py`
```python
from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('', views.home, name="home"),
    path('about/', views.about, name="about"),
    path('services/', views.services, name="services"),
    path('store/', views.store, name="store"),
    path('contact/', views.contact, name="contact"),
    path('blog/', views.blog, name="blog"),
    path('sample/', views.sample, name="sample"),
    path('admin/', admin.site.urls),
]
```

Pongo el servidor en marcha y pruebo algunas urls a ver si funcionan:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/01.png" style="max-width: 350px"/></div>

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/02.png" style="max-width: 425px"/></div>

Listo.

___
<small class="edited"><i>Última edición: 29 de Octubre de 2018</i></small>