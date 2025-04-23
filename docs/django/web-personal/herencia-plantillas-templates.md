title: Herencia en nuestras plantillas | Curso de Django | Hektor Profe
description: Django nos proporciona un sistema muy potente de herencia para nuestras plantillas.

# Herencia en nuestras plantillas

Siempre digo a mis estudiantes una frase recurrente:

> En programación, si estás repitiendo código, es que lo estás haciendo mal.
    
¿Os habéis fijado que la cabecera con el menú es exactamente la misma en los cuatro templates?

```html
<h1>Mi Web Personal</h1>

<ul>
    <li><a href="/">Portada</a></li>
    <li><a href="/about/">Acerca de</a></li>
    <li><a href="/portfolio/">Portafolio</a></li>
    <li><a href="/contact/">Contacto</a></li>
</ul>
```

Ahora imaginad que queremos cambiar el menú y añadir una nueva sección. ¿Qué problema tendríamos? Pues que deberíamos ir una a una cambiando exactamente lo mismo. ¿Es eso ideal? Para nada, más bien es un lastre, y por eso Django nos proporciona un sistema muy potente de herencia para nuestras plantillas.

Vamos a empezar creando una plantilla base, y en esta ocasión vamos a hacerlo bien. Creamos el fichero **base.html** dentro de **templates/core**. Si estáis en VSC, podemos escribir **html:5** y presionar tabulador para generar una plantilla HTML bien estructurada (podemos poner lang=es y un título).

`core/templates/core/base.html`
```html
{% raw %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mi Web Personal</title>
</head>
<body>
    
</body>
</html>{% endraw %}
```

Ahora la parte que nos interesa. ¿Qué es lo que se repetirá en todas nuestras páginas? ¿La cabecera y el menú no? Pues vamos a ponerlo dentro del body:

`core/templates/core/base.html`
```html
{% raw %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mi Web Personal</title>
</head>
<body>
    <h1>Mi Web Personal</h1>
    <ul>
        <li><a href="/">Portada</a></li>
        <li><a href="/about/">Acerca de</a></li>
        <li><a href="/portfolio/">Portafolio</a></li>
        <li><a href="/contact/">Contacto</a></li>
    </ul>
</body>
</html>{% endraw %}
```

Justo debajo viene la parte que cambia en cada página. Poned lo siguiente:

`core/templates/core/base.html`
```html
{% raw %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mi Web Personal</title>
</head>
<body>
    <h1>Mi Web Personal</h1>
    <ul>
        <li><a href="/">Portada</a></li>
        <li><a href="/about/">Acerca de</a></li>
        <li><a href="/portfolio/">Portafolio</a></li>
        <li><a href="/contact/">Contacto</a></li>
    </ul>

    {% block content %}{% endblock %}
    
</body>
</html>{% endraw %}
```

Esto estimados alumnos, es un template tag, una etiqueta de template, y sirve para añadir lógica de programación dentro del propio HTML. Existen muchos template tags en Django, iremos descubriendo algunos de ellos sobre la marcha.

En este caso el template tag **block** sirve para definir un bloque de contenido con un nombre.

Ahora viene la magia, vamos de vuelta por ejemplo a nuestro template home.html y vamos a dejar únicamente la parte de código específica de esa plantilla:

`core/templates/core/home.html`
```html
<h2>Mi Web Personal</h2>
<p>Bienvenidos.</p>
```

Muy bien, si ahora probamos de mostrar la portada evidentemente no nos aparecerá ni el título ni el menú:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/19.png"/></div>

No os preocupéis, sólo debemos hacer un pequeño ajuste para decirle que sea hija de la plantilla base.html. Vamos a poner justo encima el template tag extends de la siguiente forma:

`core/templates/core/home.html`
```html
{% raw %}{% extends 'core/base.html' %}

<h2>Mi Web Personal</h2>
<p>Bienvenidos.</p>{% endraw %}
```

Esto le indicará que es hija de base. Si ahora ejecutamos la portada:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/20.png"/></div>

Vaya, parece que esta vez sólo se muestra el título y el menú. El caso es que no está funcionando como debería, pero vamos bien. ¿Sabéis qué nos falta? Decirle que nuestra portada se dibuje justo dentro del bloque content de la base, y eso lo haremos creando de nuevo el bloque content y poniendo nuestro HTML dentro:

`core/templates/core/home.html`
```html
{% raw %}{% extends 'core/base.html' %}

{% block content %}
    <h2>Mi Web Personal</h2>
    <p>Bienvenidos.</p>
{% endblock %}{% endraw %}
```

Una vez rectificado esto, ya nos debería funcionar como era de esperar:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/21.png"/></div>

Así es como se utiliza la herencia con plantillas, con los template tags **block** y **extends**. En la siguiente lección tendrás que poner en práctica lo aprendido adaptando las demás páginas a este sistema.

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>