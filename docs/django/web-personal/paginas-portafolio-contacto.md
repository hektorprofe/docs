title: Páginas portafolio y contacto | Curso de Django | Hektor Profe
description: Para practicar lo que hemos hecho hasta ahora os reto a crear dos nuevas páginas.

# Páginas portafolio y contacto

Para practicar lo que hemos hecho hasta ahora os reto a crear dos nuevas páginas:

* Una para el *Portafolio* (**vista portfolio**) en la url **portfolio/**.
* Y para el Contacto (**vista contact**) en la url **contact/**.

Podéis poner el contenido que queráis, pero no olvidéis actualizar el menú para poder navegar entre ellas, recordad que debéis crear cada vista y enlazarla a un path en el fichero webpersonal/urls.py. 

## Solución
`core/views.py`
```python 
html_base = """
    <h1>Mi Web Personal</h1>
    <ul>
        <li><a href="/">Portada</a></li>
        <li><a href="/about/">Acerca de</a></li>
        <li><a href="/contact/">Contacto</a></li>
    </ul>
"""

def home(request):
    return HttpResponse(html_base + """
        <h2>Bienvenidos</h2>
        <p>Esto es la portada.</p>
    """)

def about(request):
    return HttpResponse(html_base + """
        <h2>Acerca de</h2>
        <p>Me llamo Héctor y me encanta Django!</p>
    """)

def contact(request):
    return HttpResponse(html_base + """
        <h2>Contacto</h2>
        <p>Aquí os dejo mi email y mis redes sociales:</p>
        <ul>
            <li><a href="mailto:hola@hektorprofe.net">Email</a></li>
            <li><a href="https://github.com/hcosta">Github</a></li>
            <li><a href="https://youtube.com">Youtube</a></li>
        </ul>
    """)
```
`webpersonal/urls.py`
```python
from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('', views.home, name="home"),
    path('about/', views.about, name="about"),
    path('contact/', views.contact, name="contact"),
    path('admin/', admin.site.urls),
]
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/16.png"/></div>

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>