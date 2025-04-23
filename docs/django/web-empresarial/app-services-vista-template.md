title: Tercera App [Services] Vista y template | Curso de Django | Hektor Profe
description: 

# Tercera App [Services] Vista y template

En esta segunda parte te enfocarás en crear la vista y su respectivo template:

* Crea algunos servicios de prueba utilizando el panel de administrador, puedes utilizar los servicios del frontend y sus imágenes (directorio img) del frontend. 
* Traslada el template services.html a un directorio templates/services en su propia app.
* Traslada la vista services a su propia app (no olvides borrar su path en las urls de core) y renderiza el template anterior. Llámala como quieras pero evita el nombre services ya que es redundante con el de la propia app y puede llevar a errores.
* Configura la vista que has creado en un fichero urls.py de app (services/urls.py) tal como hicimos con la app Core en las urls del proyecto, de manera que funcione en la url /services de la web. 
* Finalmente fusiona el template para que muestre los servicios creados en el panel de administrador.

## Solución

Básicamente voy a hacer un copiar y pegar de lo que tengo en el frontend:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/16.png" style="max-width:220px"/></div>

Me llevo el template a su propio directorio de la app:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/43.png" style="max-width:200px"/></div>

Me llevo la vista a la nueva app y muestro el nuevo template:
`services/views.py`
```python
from django.shortcuts import render

def services(request):
    return render(request, "services/services.html")
```

Configuro las urls de app y en el proyecto (borro services de core/urls):
`services/urls.py`
```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.services, name="services"),
]
```
`webempresa/urls.py`
```python
urlpatterns = [
    path('', include('core.urls')),
    path('blog/', include('blog.urls')),
    path('services/', include('services.urls')),
    path('admin/', admin.site.urls),
]
```

Compruebo que todo funcione:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/17.png" style="max-width:400px"/></div>

Finalmente realizo la fusión, tomando los servicios en la vista y pasándolos al template:
`services/views.py`
```python 
from django.shortcuts import render
from .models import Service

def services(request):
    services = Service.objects.all()
    return render(request, "services/services.html", {'services':services})
```

Y con un bucle for muestro todos los servicios siguiente la plantilla. Por defecto aparecen ordenados de más nuevos a más antiguos, pero (podemos usar el reversed en el propio template para voltear la lista, cuestión de gustos):

`services/templates/services/services.html`
```html
{% raw %}{% extends 'core/base.html' %}

{% load static %}

{% block title %}Servicios{% endblock %}

{% block content %}

{% for service in services reversed %}
    <section class="page-section">
    <div class="container">
        <div class="product-item">
        <div class="product-item-title d-flex">
            <div class="bg-faded p-5 d-flex mr-auto rounded">
                <h2 class="section-heading mb-0">
                    <span class="section-heading-upper">
                        {{service.subtitle}}
                    </span>
                    <span class="section-heading-lower">
                        {{service.title}}
                    </span>
                </h2>
            </div>
        </div>
        <img class="product-item-img mx-auto d-flex rounded img-fluid mb-3"
            src="{{service.image.url}}" alt="">
        <div class="product-item-description d-flex ml-auto">
            <div class="bg-faded p-5 rounded">
                <p class="mb-0">{{service.content}}</p>
            </div>
        </div>
        </div>
    </div>
    </section>
{% endfor %}

{% endblock %}{% endraw %}
```

Con esto hemos completado nuestra tercera app del curso.

___
<small class="edited"><i>Última edición: 30 de Octubre de 2018</i></small>