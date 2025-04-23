title: Creando un Template Tag para listar páginas | Curso de Django | Hektor Profe
description: Vamos a aprender a crear un template tag para mostrar contenido personalizado.

# Creando un Template Tag para listar páginas

En esta lección vamos a aprender a crear un template tag para mostrar contenido personalizado, concretamente lo que hará es recuperar la lista de páginas secundarias y devolverla. Es una alternativa más flexible que extender el procesador de contexto, pero también consume algo más de recursos.

Para crear nuestro propio template tag debemos seguir unos pasos. El primer es crear un directorio llamado **template tags** dentro de la app donde queremos añadir esta funcionalidad. En nuestro caso **pages/templatetags**. Dentro añadiremos un **init**, esto indicará a Python que se trata de un package, y justo al lado crearemos un script para almacenar nuestros template tags, podemos llamarlo como queramos pero yo siguiendo el ejemplo oficial de la documentación le voy a llamar **pages_extras.py**.

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/52.png" style="max-width:190px"/></div>

Ahora vamos a declarar el template tag, para ello debemos registrarlo en la librería de Templates, así que empezaremos importando el módulo de registro de templates: 

`pages/templatetags/pages_extras.py`
```python
from django import template
from pages.models import Page

register = template.Library()
``` 

El tag que vamos a crear es un relativamente simple. No necesitará que le pasemos ningún parámetro, simplemente devolverá la lista de páginas:

`pages/templatetags/pages_extras.py`
```python
from django import template
from pages.models import Page

register = template.Library()

@register.simple_tag
def get_page_list():
    pages = Page.objects.all()
    return pages
``` 

Ahora muy importante, <u>reiniciamos el servidor para que incluya los nuevos template tags en la memoria</u>, y  de vuelta a template **base.html** si cargamos los **pages_extras** con {% raw %}{% load %}{% endraw%}, ya deberíamos ser capaces de ejecutar el template tag:

`core/templates/core/base.html`
```html
{% raw %}{% load pages_extras %}
{% get_page_list %}{% endraw %}
``` 

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/53.png"/></div>

Ahí tenemos nuestro QuerySet con las páginas, pero claro… así no podemos manejarlo, necesitamos tenerlo en una variable. No es difícil, sólo tenemos que darle un nombre al template tag de la siguiente forma:

`core/templates/core/base.html`
```html
{% raw %}{% get_page_list as page_list %}{% endraw %}
``` 

Una vez ejecutada esta línea podemos recorrer page_list con un for y mostrar la lista de páginas con sus respectivos enlaces:

`core/templates/core/base.html`
```html
{% raw %}{% load pages_extras %}
{% get_page_list as page_list %}
{% for page in page_list %}
    <a href="{% url 'page' page.id %}" class="link">{{page.title}}</a> 
    {% if not forloop.last %}·{% endif %} 
{% endfor %}{% endraw %}
``` 

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/54.png" style="max-width:400px"/></div>

Si queréis darle un toque más interesante a los enlaces de las páginas, siempre podéis pasar el título en forma de slug:

`core/templates/core/base.html`
```html
{% raw %}{% load pages_extras %}
{% get_page_list as page_list %}
{% for page in page_list %}
    <a href="{% url 'page' page.id page.title|slugify %}" class="link">
        {{page.title}}</a> {% if not forloop.last %}·{% endif %} 
{% endfor %}{% endraw %}
    ``` 

Aunque sólo es de adorno tendréis que definir un slug de mentira en el path y la vista:

`pages/urls.py`
```python
path('<int:page_id>/<slug:page_slug>/', views.page, name="page"),
``` 

`pages/views.py`
```python
def page(request, page_id, page_slug):
``` 

Pero el resultado es interesante y puede mejorar el SEO de las páginas:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/55.png" style="max-width:275px"/></div>

En fin, con esto habéis aprendido otra forma de inyectar datos comunes en todas las páginas, sólo imaginad la de cosas que podéis llegar a a hacer.

___
<small class="edited"><i>Última edición: 1 de Noviembre de 2018</i></small>