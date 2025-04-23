title: Patrón MVT: Modelo-Vista-Template | Curso de Django | Hektor Profe
description: Seguro que habéis oído hablar del famoso patrón MVC: Modelo-Vista-Controlador. Django lo redefine como MVT: Modelo-Vista-Template.

# Patrón MVT: Modelo-Vista-Template

Si tenéis experiencia en el mundo de la programación seguro que habéis oído hablar del famoso patrón MVC: Modelo-Vista-Controlador. Django redefine este modelo como MVT: Modelo-Vista-Template.

Hasta ahora lo que hemos hecho no requería de interactuar con la base de datos. Podríamos decir que simplemente se recibe una petición del navegador, se ejecuta la vista correspondiente y se renderiza el Template para que el navegador muestre el HTML resultante:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/45.png"/></div>

Sin embargo en el momento en que aparecen las base de datos y los modelos, este proceso se extendiende. Ahora se recibirá la petición, se pasará a la vista, en la vista recuperaremos los datos del modelo correspondiente, y finalmente la renderizaremos el Template pero esta vez integrando los datos dinámicos recuperados del modelo, antes de enviar el HTML final al navegador:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/46.png"/></div>

Vamos a hacerlo, ya veréis como en la práctica es bastante fácil.

Como la lista de proyectos la enviaremos al template **portofolio.html** a través de su view **porfolio**, vamos a recuperar los datos ahí. Pero en lugar de definirla en la app Core, la vamos a trasladar al views de su propia app **portfolio/views.py**:

`portfolio/views.py`
```python
from django.shortcuts import render

def portfolio(request):
    return render(request, "core/portfolio.html")
```

También crearemos una carpeta **templates/portfolio** y pondremos el template de la página **portfolio** ahí:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/54.png"/></div>

Y actualizamos la ruta al template:

`portfolio/views.py`
```python
from django.shortcuts import render

def portfolio(request):
    return render(request, "portfolio/portfolio.html")  # <=====
```

Ahora tenemos que readaptar las URL, pero como ahora tenemos que hacer referencia a dos apps, necesitamos importar de forma distintas las vistas:

`webpersonal/urls.py`
```python
from django.contrib import admin
from django.urls import path

from core import views as core_views
from portfolio import views as portfolio_views

from django.conf import settings

urlpatterns = [
    path('', core_views.home, name="home"),
    path('about-me/', core_views.about, name="about"),
    path('portfolio/', portfolio_views.portfolio, name="portfolio"),
    path('contact/', core_views.contact, name="contact"),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT)
```

Esto que hemos hecho parece una tontería, pero separar las apps siempre viene bien. Nos permite organizar mejor el código y prepararlo para escalarlo en el futuro.

De vuelta a nuestra vista **portfolio**, necesitamos hacer referencia a nuestro modelo Project para recuperar sus instancias y enviarlas al template, así que lo importamos arriba del todo:

`portfolio/views.py`
```python
from django.shortcuts import render
from .models import Project  # <=====

def portfolio(request):
    return render(request, "portfolio/portfolio.html")
```

Ahora fijaros qué fácil es recuperar los registros de la tabla Projects que maneja nuestro modelo ORM a través de un su lista de objetos interna y un método **.all()** que hace referencia a todos sus objetos:

`portfolio/views.py`
```python
from django.shortcuts import render
from .models import Project

def portfolio(request):
    projects = Project.objects.all()  # <=====
    return render(request, "portfolio/portfolio.html")
```

Finalmente tenemos que inyectar estos proyectos en el template. Para hacerlo simplemente enviamos a la función render un tercer parámetro con un diccionario y los valores que queremos inyectar. De la siguiente forma:

`portfolio/views.py`
```python
from django.shortcuts import render
from .models import Project

def portfolio(request):
    projects = Project.objects.all()  
    return render(request, "portfolio/portfolio.html", 
        {'projects':projects})  # <=====
```

Teóricamente con esto habremos inyectado los proyectos, así que ahora vamos a la plantilla para debugearlos a ver si nos aparece algo:

`portfolio/templates/portfolio/porfolio.html`
```html
{% raw %}{% extends 'core/base.html' %}

{% load static %}

{% block title %}Portafolio{% endblock %}

{% block background %}{% static 'core/img/portfolio-bg.jpg' %}{% endblock %}

{% block headers %}
    <h1>Portafolio</h1>
    <span class="subheading">Currículo</span>
{% endblock %}

{% block content %}
    {% for project in projects %}
        Proyecto: {{project.title}} creado {{project.created}} <br>
    {% endfor %}
{% endblock %}{% endraw %}
``` 

Probamos la página y fijaros que os mostrará algo llamado QuerySet, como una lista y dentro aparece nuestro proyecto.

Un QuerySet es la representación del resultado de una consulta a la base de datos, pero devuelta como una lista de instancias. Al ser una especie de lista,  lo bueno que tiene es que podemos iterarla con otro templatetag llamado for, y dentro de cada iteración mostrar para cada Proyecto sus atributos.

Si esto lo adaptamos un poco, podemos transformar cada iteración en el proyecto que tenemos que mostrar:

`portfolio/templates/portfolio/porfolio.html`
```html
{% raw %}{% extends 'core/base.html' %}

{% block title %}Portafolio{% endblock %}

{% load static %}

{% block background %}{% static 'core/img/portfolio-bg.jpg' %}{% endblock %}

{% block headers %}
    <h1>Portafolio</h1>
    <span class="subheading">Currículo</span>
{% endblock %}

{% block content %}
    {% for project in projects %}
        <!-- Proyecto -->
        <div class="row project">  	
            <div class="col-lg-3 col-md-4 offset-lg-1">
                <img class="img-fluid" src="{{project.image}}" alt="">
            </div>
            <div class="col-lg-7 col-md-8">
                <h2 class="section-heading title">{{project.title}}</h2>   
                <p>{{project.description}}</p>
                {% if project.link %}
                    <p><a href="{{project.link}}">Más información</a></p>
                {% endif %}
            </div>
        </div>
    {% endfor %}
{% endblock %}{% endraw %}
``` 

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/49.png" style="max-width: 500px"/></div>

¿No es fantástico? Lo malo es que la imagen no se muestra. Si analizamos el código generado veremos la causa:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/53.png"/></div>

Como véis no añade la URL de los ficheros que se supone están en /media/, pero no os preocupéis. El campo ImageField tiene un atributo llamado url que nos generará su ruta correcta automáticamente teniendo en cuenta la variable **MEDIA_URL** que tenemos en **settings.py**:

`portfolio/templates/portfolio/porfolio.html`
```html
{% raw %}<img class="img-fluid" src="{{project.image.url}}" alt="">{% endraw %}
``` 

Con esto debería funcionar la imagen:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/50.png"/></div>

En este punto si queréis podemos volver al panel de administrador y añadir otro proyecto de prueba:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/51.png"/></div>

Una vez creado el proyecto nos aparecerá en la parte superior, recordad que se nos ordenan de más recientes amás antiguos:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/52.png"/></div>

Fijaros en muy poco tiempo hemos transformado un template estático en una web con una sección Portafolio dinámica, donde a través de un panel de administrador nuestros clientes pueden manejar proyectos de forma simple y cómoda, incluso a través de su teléfono móvil. Sólo nos faltaría crear un usuario para nuestro cliente desde el administrador, pero esto lo trabajaremos más a fondo en el siguiente proyecto. 

Por ahora damos la web personal acabada, lo que resta de sección lo dedicaremos a algunos ejercicios prácticos.

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>