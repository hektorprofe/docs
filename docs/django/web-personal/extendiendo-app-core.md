title: Extendiendo la App [Core] | Curso de Django | Hektor Profe
description: Según nuestra maqueta tenemos varias páginas más, vamos añadirlas siguiendo la misma lógica.

# Extendiendo la App [Core]

Según nuestra maqueta tenemos varias páginas más, vamos añadirlas siguiendo la misma lógica. Vamos al fichero **core/views.py** y crearemos una vista llamada *about* (acerca de en inglés):

`core/views.py`

```python
def about(request):
    return HttpResponse("""
        <h1>Mi Web Personal</h1>
        <h2>Acerca de</h2>
        <p>Me llamo Héctor y me encanta Django!</p>
    """)
```

Ahora tenemos que enlazarla a una dirección, así que vamos a **webpersonal/urls.py** y la añadimos a la lista *urlpatterns*:

`webpersonal/urls.py`

```python
from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('', views.home, name="home"),
    path('about/', views.about, name="about"),
    path('admin/', admin.site.urls),
]
```

Si ahora ponemos de nuevo el servidor en marchay probamos la dirección **/about/** debería salirnos:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/14.png"/></div>

En este punto, sabiendo un poco de HTML y con algo de imaginación, podemos crear una pequeña web con un menú de enlaces:
`core/views.py`
```python
html_base = """
    <h1>Mi Web Personal</h1>
    <ul>
        <li><a href="/">Portada</a></li>
        <li><a href="/about/">Acerca de</a></li>
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
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/15.png"/></div>

Como véis es una forma bien interesante de ir estructurando nuestras páginas.

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>