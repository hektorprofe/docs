title: Creando la cabecera dinámica | Curso de Django | Hektor Profe
description: Ya tenemos bastante adaptado el template a falta de algunos pequeños ajustes.

# Creando la cabecera dinámica

Ya tenemos bastante adaptado el template a falta de algunos pequeños ajustes.

Si estudiamos un poco el código veremos que hay tres componentes cambiantes en la cabecera: la imagen, el título y el subtítulo.

¿Se os ocurre alguna forma de cambiar estos valores? Estoy seguro de que sí, por ejemplo utilizando bloques como hicimos con el título de la página. Podríamos crear dos, uno para el fondo y otro para los textos:

`core/templates/core/base.html`
```html
{% raw %}<!-- Cabecera -->
<header class="masthead" 
    style="background-image: url('{% block background %}{% endblock %}')">
  <div class="overlay"></div>
  <div class="container">
    <div class="row">
      <div class="col-lg-8 col-md-10 mx-auto">
        <div class="site-heading">
          {% block headers %}{% endblock %}
        </div>
      </div>
    </div>
  </div>
</header>{% endraw %}
```

Ahora desde el template **home.html** sólo tendríamos que establecer los valores de ambos bloques:

`core/templates/core/home.html`

```html
{% raw %}{% extends 'core/base.html' %}

{% load static %}

{% block title %}Portada{% endblock %}

{% block background %}{% static 'core/img/home-bg.jpg' %}{% endblock %}

{% block headers %}
    <h1>Juan Pérez</h1>
    <span class="subheading">Ingeniero Industrial</span>
{% endblock %}{% endraw %}
```

Es muy importante que dejemos el bloque background en una línea y sin utilizar espacios, ya que si ponemos saltos no se inyectará correctamente el código css con la imagen en el template **base.html**.

Hecho esto ya deberíamos ver como nuestra portada aparece perfecta:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/27.png"/></div>

Ahora es tu turno de adaptar los demás templates con los contenidos de prueba de las maquetas.

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>