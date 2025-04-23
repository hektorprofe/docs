title: Fusionar el Frontend y el Backend | Curso de Django | Hektor Profe
description: Identifica las partes comunes en todas las maquetas HTML y crea una estructura con herencia.

# Fusionar el Frontend y el Backend

En esta lección deberás realizar la fusión. Identifica las partes comunes en todas las maquetas HTML y crea una estructura con herencia como hicimos con el primer proyecto (base.html, home.html...). Deberás lograr un menú funcional y que se carguen correctamente los ficheros estáticos (css, javascripts, imágenes) de todos los templates.

!!! info "Nota" 

    {% raw %}No olvides activar la app core y reiniciar el servidor para poder utilizar los recursos estáticos cargándolos con {% load static %} en su respectivo template.{% endraw %}

## Solución

Empezamos por ejemplo creando los directorio **static/core/** en nuestra app y copiamos ahí todos los recursos del frontend:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/07.png" style="max-width: 300px"/></div>

Ahora vamos a hacer lo mismo pero para los templates en el directorio **templates/core/**:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/08.png" style="max-width: 335px"/></div>

Ahora vamos a decirle a Django que cargue los ficheros estáticos y los templates de la app **core**, así que lo añadiremos en **settings.py**.

Acto seguido en lugar de seguir devolviendo un HttpResponse en las vistas vamos a renderizar nuestros templates. Voy a empezar por home y el template index.html al que cambiaré el nombre a home.html para que todo concuerde:

`core/views.py`
```python 
def home(request):
    return render(request, "core/home.html")
```

Ahora pruebo a ver si funciona:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/09.png" style="max-width: 300px"/></div>

Parece que carga bien, pero los recursos estáticos no funcionan. Vamos a utilizar el template tag *load_static* y a adaptar sus urls en home.html:

`core/templates/core/home.html`
```html
{% raw %}{% load static %}

<!-- Bootstrap -->
<link href="{% static 'core/vendor/bootstrap/css/bootstrap.min.css' %}" rel="stylesheet">

<!-- Fuentes -->
<link href="{% static 'core/vendor/font-awesome/css/font-awesome.min.css' %}" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Raleway:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i" rel="stylesheet">

<!-- Estilos -->
<link href="{% static 'core/css/business-casual.css' %}" rel="stylesheet">

<!-- Bootstrap -->
<script src="{% static 'core/vendor/jquery/jquery.min.js' %}"></script>
<script src="{% static 'core/vendor/bootstrap/js/bootstrap.bundle.min.js' %}"></script>{% endraw %}
```


Probamos de nuevo:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/10.png"/></div>

Más o menos funciona, pero como la  imágen de la cabecera no se está mostrando todo se descuadra. Vamos a poner bien su enlace estático:

`core/templates/core/home.html`
```html
{% raw %}<img class="intro-img img-fluid mb-3 mb-lg-0 rounded" 
    src="{% static 'core/img/intro.jpg' %}" alt="">{% endraw %}
```

Ahora sí:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/11.png"/></div>

Ahora que tenemos nuestra portada vamos a crear la plantilla base.html. Podemos simplemente copiar home.html y llamarla base.html porque lo tenemos todo ahí.

Vamos a echar un vistazo al diseño general de todas ellas para identificar la parte común y la parte que cambia...

Si nos fijamos un poco veremos que la estructura del contenido varía bastante entre ellas, así que lo más acertado en este caso sería crear un bloque content que abarque todo el espacio entre el menú y el pié:

`core/templates/core/base.html`
```html
{% raw %}</nav>

{% block content %} {% endblock %}

<!-- Pié de página -->
<footer class="footer text-faded text-center py-5">{% endraw %}
```


Ahora en cada template dejaremos únicamente esa parte dentro de un bloque content.

`core/templates/core/base.html`
```html
{% raw %}{% extends 'core/base.html' %}

{% load static %}

{% block title %}Inicio{% endblock %}

{% block content %}
    <!-- Cabecera -->
    <section class="page-section clearfix">...</section>

    <!-- Mensaje -->
    <section class="page-section cta">...</section>
{% endblock %}{% endraw %}
```

No debemos olvidar cargar el tag static en el template si para poder utilizarlo y en cuanto a los enlaces del menú vamos a utilizar el template tag url:

`core/templates/core/base.html`
```html
{% raw %}<!-- Navegación -->
<a class="navbar-brand text-uppercase text-expanded d-lg-none" 
    href="{% url 'home' %}">La Caffettiera</a>
...
<div class="collapse navbar-collapse" id="navbarResponsive">
    <ul class="navbar-nav mx-auto">
        <li class="nav-item px-lg-4">
            <a class="nav-link text-uppercase text-expanded" 
                href="{% url 'home' %}">Inicio</a>
        </li>
        <li class="nav-item px-lg-4">
            <a class="nav-link text-uppercase text-expanded" 
                href="{% url 'about' %}">Historia</a>
        </li>
        <li class="nav-item px-lg-4">
            <a class="nav-link text-uppercase text-expanded" 
                href="{% url 'services' %}">Servicios</a>
        </li>
        <li class="nav-item px-lg-4">
            <a class="nav-link text-uppercase text-expanded" 
                href="{% url 'store' %}">Visítanos</a>
        </li>
        <li class="nav-item px-lg-4">
            <a class="nav-link text-uppercase text-expanded"
                href="{% url 'contact' %}">Contacto</a>
        </li>
        <li class="nav-item px-lg-4">
            <a class="nav-link text-uppercase text-expanded"
                href="{% url 'blog' %}">Blog</a>
        </li>
    </ul>
</div>{% endraw %}
```


Evidentemente para que funcionen bien tendremos que renderizar los templates bien fusionados. Voy a preparar primero todas las view:

`core/views.py`
```python
from django.shortcuts import render

def home(request):
    return render(request, "core/home.html")

def about(request):
    return render(request, "core/about.html")

def services(request):
    return render(request, "core/services.html")

def store(request):
    return render(request, "core/store.html")

def contact(request):
    return render(request, "core/contact.html")

def blog(request):
    return render(request, "core/blog.html")

def sample(request):
    return render(request, "core/sample.html")
```

En cuanto a los templates los tengo preparados, voy a sustituirlos. Podéis descargarlos en los recursos de esta lección y hacer lo mismo. He incorporado elementos como el bloque title para mostrar un título dinámico en cada página.

Una vez vez tengamos todo listo deberíamos poder navegar correctamente entre las páginas y tendremos lista nuestra práctica.

___
<small class="edited"><i>Última edición: 29 de Octubre de 2018</i></small>