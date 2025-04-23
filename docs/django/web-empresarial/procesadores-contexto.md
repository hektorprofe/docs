title: Procesadores de contexto | Curso de Django | Hektor Profe
description: Un procesador de contexto es una forma de extender el diccionario de contexto.

# Procesadores de contexto

Así que tenemos que recuperar los enlaces sociales para enviarlos a todas las páginas… ¿Habrá alguna forma que nos permita hacerlo una vez y que funcione en todos los templates? ¡Pues sí! De hecho hay más de una, pero para este caso la más óptima es crear un procesador de contexto. 

¿Qué es un procesador de contexto? Pues es una forma de extender el contexto, aunque de poco sirve decirlo si no sabemos antes qué es el contexto.

¿Recordáis el diccionario que enviamos desde nuestras vistas a los templates? Bueno, ese diccionario lo que hace es extender el contexto, por lo que podemos entender que se trata de una especie de diccionario común, que existe incluso sin enviar ningún dato desde una vista. Así que blanco y en botella, si logramos extender ese contexto global y añadir los enlaces de nuestras redes, entonces podremos mostrarlas en cualquier template sin necesidad de enviarlas desde una vista.

Para crear un procesador de contexto vamos a crear un nuevo fichero llamado **processors.py** en nuestra app Social:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/46.png" style="max-width:275px"/></div>

Dentro vamos a definir una función que devuelva un diccionario de la siguiente forma:

`social/processors.py`
```python
def ctx_dict(request):
    ctx = {'test':'hola'}
    return ctx  
```

Nuestro objetivo es que este diccionario extienda el contexto global, de manera que podamos utilizar la clave ‘test’ como una variable en cualquier template. Para lograrlo debemos ir a **settings**, buscar el apartado **context_processors** en el diccionario *TEMPLATES* dentro de la clave *OPTIONS* y añadirlo al final:

`webempresa/settings.py`
```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social.processors.ctx_dict'   # <====
            ],
        },
    },
]
```

Si ahora vamos por ejemplo a base.html y mostramos la variable {% raw %}{{test}}{% endraw %} en el pie de página:

`core/templates/core/base.html` 
```html
{% raw %}<footer class="footer text-faded text-center py-5">
    <div class="container">
        {{test}}
        ...
    </div>
</footer>{% endraw %}
```

Si actualizamos la web, veremos que aparece "Hola" en todas las páginas.

Por tanto ya tenemos la base, sólo debemos añadir al diccionario las redes:

`social/processors.py`
```python
from .models import Link

def ctx_dict(request):
    ctx = {}
    links = Link.objects.all()
    for link in links:
        ctx[link.key] = link.url
    return ctx
```

Y mostrarlas en el template:

`core/templates/core/base.html`
```html
 {% raw %}<p class="m-0">
    {% if LINK_TWITTER %}
    <a href="{{LINK_TWITTER}}" class="link">
        <span class="fa-stack fa-lg">
        <i class="fa fa-circle fa-stack-2x"></i>
        <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
        </span>
    </a>
    {% endif %}
    {% if LINK_FACEBOOK %}
    <a href="{{LINK_FACEBOOK}}" class="link">
        <span class="fa-stack fa-lg">
        <i class="fa fa-circle fa-stack-2x"></i>
        <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
        </span>
    </a>
    {% endif %}
    {% if LINK_INSTAGRAM %}
    <a href="{{LINK_INSTAGRAM}}" class="link">
        <span class="fa-stack fa-lg">
        <i class="fa fa-circle fa-stack-2x"></i>
        <i class="fa fa-instagram fa-stack-1x fa-inverse"></i>
        </span>
    </a>
    {% endif %}
</p>{% endraw %}
```

Sin duda una técnica extensible y elegante, digna de unos buenos profesionales.

___
<small class="edited"><i>Última edición: 31 de Octubre de 2018</i></small>