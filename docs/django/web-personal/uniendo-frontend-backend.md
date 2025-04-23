title: Uniendo el Frontend con el Backend | Curso de Django | Hektor Profe
description: Cuando vayamos a fusionar un frontend y un backend, mi mejor consejo es tomarlo con calma.

# Uniendo el Frontend con el Backend

Con todo lo que hemos hecho hasta ahora hemos creado un backend funcional utilizando templates con herencia simple. Pero como recordaréis ya contamos con un frontend, así que vamos a utilizarlo ¿no?

Cuando vayamos a fusionar un frontend y un backend, mi mejor consejo es tomarlo con calma. Pararse a identificar los elementos comunes y dinámicos de las páginas para aplicar la lógica de la herencia de plantillas.

Por suerte el diseño de este primer proyecto es muy sencillo, todas las páginas tienen la misma estructura y lo único que cambia es el contenido. Vamos a empezar trasladando el código de la plantilla **base.html**. tomando como referencia la maqueta **index.html**.

Lo primero que haremos será comentar el código que tenemos en la base **&#60;!-- --&#62;** de principio a fin, así podremos tomarlo como referencia.
`core/templates/core/base.html`
```html
{% raw %}<!--
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{% block title %}{% endblock %}</title>
    
</head>
<body>
    <h1>Mi Web Personal</h1>
    <ul>
        <li><a href="{% url 'home' %}">Portada</a></li>
        <li><a href="{% url 'about' %}">Acerca de</a></li>
        <li><a href="{% url 'portfolio' %}">Portafolio</a></li>
        <li><a href="{% url 'contact' %}">Contacto</a></li>
    </ul>

    {% block content %}{% endblock %}
    
</body>
</html>
-->{% endraw %}
```

Justo debajo podemos pegar todo el código de la maqueta **index.html**.

Empezando por arriba, el primer contenido dinámico que encontramos es el título, vamos a ponerlo bien:

`core/templates/core/base.html`
```html
{% raw %}<title>{% block title %}{% endblock %} | Juan Pérez (Ingeniero)</title>{% endraw %}
```

A continuación vamos a actualizar el menú para utilizar el template tag url, de esa forma nos aseguramos que los enlaces siempre funcionarán y llevarán a la vista correspondiente:

`core/templates/core/base.html`

```html
{% raw %}<div class="collapse navbar-collapse" id="navbarResponsive">
    <ul class="navbar-nav ml-auto">
        <li class="nav-item">
            <a class="nav-link" href="{% url 'home' %}">Portada</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="{% url 'about-me' %}">Acerca de</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="{% url 'portfolio' %}">Portafolio</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="{% url 'contact' %}">Contacto</a>
        </li>
    </ul>
</div>{% endraw %}
```

Tampoco nos olvidemos del enlace del propio nombre de la página, que debería llevar a la portada:

`core/templates/core/base.html`
```html
{% raw %}<a class="navbar-brand" href="{% url 'home' %}">Juan Pérez</a>{% endraw %}
```

Justo debajo del menú nos topamos con un nuevo contenido dinámico: la cabecera. Esta parte consta de un título, un subtítulo y una imagen de fondo. Estos contenidos irán cambiando en cada página, de ahí lo de dinámicos. Luego nos pondremos a ello, por ahora vamos a finalizar con el bloque de contenido, que lo pondremos justo entre la cabecera y el pié de página.

`core/templates/core/base.html`
```html
{% raw %}<!-- Contenido -->
{% block content %}{% endblock %}{% endraw %}
```

Hecho esto ya podemos borrar el código de referencia que teníamos arriba comentado, sino nos dará error porque detectar bloques repetidos.

Vamos a probar qué tal se ve nuestra página:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/24.png"/></div>

Bueno, parece que ha cambiado un poco, pero claramente no es lo que estábamos esperando. ¿Qué está sucediendo? Pues que nos se están cargando los recursos estáticos.

Los recursos estáticos son esos contenidos que forman parte del maquetado frontend, por ejemplo los css, los javascripts y las imágenes, de ahí que no se vea nada. ¿Por qué sucede esto?

Bueno, resulta que el servidor de Django, ese que utilizamos al hacer un: 

```python 
(django2) python manage.py runserver
```

Es sólo un servicio para utilizar durante el desarrollo y no está pensado para manejar ficheros estáticos. De esto se encargaría por ejemplo Nginx o Apache que son servidores pensados para la fase de producción. 

¿Entonces no podemos ver como queda nuestra web en la fase de desarrollo? Pues sí, sí que podemos, pero debemos realizar algunas configuraciones.

Lo primero es crear un directorio en nuestra app core para almacenar los contenidos estáticos, la lógica es la misma que con el directorio templates, asi que crearemos un directorio **static** y dentro otro llamado **core**, el nombre de la app, y dentro vamos a copiar todos los directorios de la maqueta que incluyen este tipo de ficheros:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/25.png"/></div>

Ahora sólo nos falta decirle a nuestro template que cargue los ficheros estáticos. Vamos de vuelta a nuestro **base.html**, y justo antes de llamar nuestros css y javascripts ejecutaremos el siguiente template tag:

`core/templates/core/base.html`
```html
{% raw %}<!-- Estilos y fuentes del template  -->

{% load static %}
```

Acto seguido sólo tenemos que sustituir los enlaces con los recursos mediante el tag **static** y pasándole la ruta con la app por delante, en nuestro caso **core**:

!!! note {% raw %}
```html tab="core/templates/core/base.html"
<!-- Estilos y fuentes del template  -->

{% load static %}
<link href="{% static 'core/vendor/bootstrap/css/bootstrap.min.css' %}" rel="stylesheet">
<link href="{% static 'core/vendor/font-awesome/css/font-awesome.min.css' %}" rel="stylesheet" type="text/css">
<link href='https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
<link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
<link href="{% static 'core/css/clean-blog.min.css' %}" rel="stylesheet">{% endraw %}
``` 

No olvidemos los Javascripts de la parte inferior:

`core/templates/core/base.html`
```html
{% raw %}<!-- Bootstrap y Javascripts -->

<script src="{% static 'core/vendor/jquery/jquery.min.js' %}"></script>
<script src="{% static 'core/vendor/bootstrap/js/bootstrap.bundle.min.js' %}"></script>
<script src="{% static 'core/js/clean-blog.min.js' %}"></script>{% endraw %}
```

Una vez lo tenemos vamos a probar de nuevo nuestra web:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/26.png"/></div>

Ahora ya nos carga los recursos, menos la imagen de la cabecera que no la hemos adaptado. Podríamos hacerlo ahora, pero como se nos alargaría mucho la lección lo haremos en la siguiente.

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>