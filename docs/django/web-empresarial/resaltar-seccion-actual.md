title: Resaltando la sección actual | Curso de Django | Hektor Profe
description: 

# Resaltando la sección actual

Uno de esos detalles que quizá pasa desapercibido en nuestro frontend es que dependiendo de la sección que visitamos, ésta nos aparece resaltada en el menú. 

Según el código HTML de la maqueta para resaltar un elemento del menú hay que añadirle la clase active en su etiqueta *li*.

¿Se os ocurre alguna forma de manejar la página activa y resaltarla con esta clase? No sé si recordaréis la variable request.path, la utilizamos en el primer proyecto para mostrar o no una etiqueta *hr* que dibujaba una línea debajo del contenido en todas las páginas menos la portada. Bueno, pues podemos hacer lo mismo para establecer esta clase active:

`core/templates/core/base.html`
```html
{% raw %}<ul class="navbar-nav mx-auto">
    <li class="nav-item px-lg-4 
        {% if request.path == '/' %}active{% endif %}">
        <a class="nav-link text-uppercase text-expanded" 
            href="{% url 'home' %}">Inicio</a>
    </li>
    <li class="nav-item px-lg-4 
        {% if request.path == '/about/' %}active{% endif %}">
        <a class="nav-link text-uppercase text-expanded" 
            href="{% url 'about' %}">Historia</a>
    </li>
    <li class="nav-item px-lg-4 
        {% if request.path == '/services/' %}active{% endif %}">
        <a class="nav-link text-uppercase text-expanded" 
            href="{% url 'services' %}">Servicios</a>
    </li>
    <li class="nav-item px-lg-4 
        {% if request.path == '/store/' %}active{% endif %}">
        <a class="nav-link text-uppercase text-expanded" 
            href="{% url 'store' %}">Visítanos</a>
    </li>
    <li class="nav-item px-lg-4 
        {% if request.path == '/contact/' %}active{% endif %}">
        <a class="nav-link text-uppercase text-expanded" 
            href="{% url 'contact' %}">Contacto</a>
    </li>
    <li class="nav-item px-lg-4 
        {% if request.path == '/blog/' %}active{% endif %}">
        <a class="nav-link text-uppercase text-expanded" 
            href="{% url 'blog' %}">Blog</a>
    </li>
</ul>{% endraw %}
``` 

Y con esto lo tenemos:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/12.png"/></div>

No es que sea muy elegante porque si cambiamos la URL dejará de funcionar, pero es lo más fácil que podemos hacer para lograrlo.

___
<small class="edited"><i>Última edición: 29 de Octubre de 2018</i></small>