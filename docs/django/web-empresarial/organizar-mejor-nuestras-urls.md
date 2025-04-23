title: Organizando mejor nuestras URLs | Curso de Django | Hektor Profe
description: Quiero explicaros una forma de manejar mejor las URLs de nuestras apps.

# Organizando mejor nuestras URLs

Antes de continuar con la siguiente práctica vamos a hacer un inciso. Quiero explicaros una forma de manejar mejor las URLs de nuestras apps. 

Hasta ahora hemos visto como añadir todas nuestras URL únicamente en el fichero urls del proyecto, pero imaginaros si tuviéramos varias apps cada una con sus urls, sería un lío tremendo, todo lleno de imports a las vistas de cada app.

Para solucionarlo podemos crear configuraciones URL específicas para cada app y luego importarlas en el fichero **urls.py** de nuestro proyecto bajo una url global. Esta es precisamente la forma como funcionan las URLS de la app **admin**, vamos a hacerlo con nuestra app **core**, ya veréis que fácil. 

Vamos a empezar creando un nuevo fichero **urls.py** en ella y añadiremos dentro una nueva configuración de paths en una lista *urlpatterns*, igual que que la del **urls.py** del proyecto:

`core/urls.py`
```python
from django.urls import path
from . import views

urlpatterns = [

]
```

Dentro vamos a trasladar los *paths* tal cual los tenemos, borrandolos de un lado para ponerlos en el otro:

`core/urls.py`
```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('about/', views.about, name="about"),
    path('services/', views.services, name="services"),
    path('store/', views.store, name="store"),
    path('contact/', views.contact, name="contact"),
    path('blog/', views.blog, name="blog"),
    path('sample/', views.sample, name="sample"),
]
```

Ahora lo que haremos es importar estas URLS todas a la vez en el **urls.py** del proyecto bajo un path global. En el comentario de **urls.py** nos explican como se hace:

`webempresa/urls.py`
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('core/', include('core.urls')),
    path('admin/', admin.site.urls),
]
```

Vamos a probar en nuestro proyecto:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/03.png" style="max-width: 550px"/></div>

Como véis no funciona. ¿Por qué? Bueno fijaros que estamos definiendo un path global llamado core/ para incluir en él las URLS de la app **core**:

```python
path('core/', include('core.urls')),
```

En otras palabras, todos nuestros Paths dependen de la raíz core/, representando el propio core/ la portada que tenemos en core:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/04.png" style="max-width: 350px"/></div>

Como  este path no tiene una URL, representa la propia raíz:

```python
path('', views.home, name='home'),
```

¿Como entraríamos en las otras páginas? Pues simplemente añadiendo después de core/ su path:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/05.png" style="max-width: 450px"/></div>

Por ahora no queremos esto, así que vamos a hacer que la raíz de las URLS de **core** esté vacía:

```python
path('', include('core.urls')),
```

Así replicaremos el funcionamiento que teníamos antes:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/06.png" style="max-width: 350px"/></div>

Y con esto ya sabéis manejar URLS de una forma mucho más cómoda.

___
<small class="edited"><i>Última edición: 29 de Octubre de 2018</i></small>