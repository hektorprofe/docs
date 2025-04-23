title: Creando las vistas del Blog (2) | Curso de Django | Hektor Profe
description: Para las categorías tenemos que aplicar una lógica diferente de la que hemos utilizado hasta ahora.

# Creando las vistas del Blog (2)

Para las categorías tenemos que aplicar una lógica diferente de la que hemos utilizado hasta ahora. Lo primero es idear una forma de mostrar cada categoría, digamos que cada una es independiente de las otras y tendrá sus propias entradas, así que tenemos que diferenciarlas en la vista. 

En estos casos la lógica más simple es enviar al Path el id del objeto que queremos recuperar. En nuestro caso podemos hacerlo de esta forma:

`blog/views.py`
```python
from django.shortcuts import render
from .models import Post, Category

def blog(request):
    posts = Post.objects.all()
    return render(request, "blog/blog.html", {'posts':posts})

def category(request, category_id):
    pass
```

Para configurar la URL simplemente añadiremos un parámetro **category_id**. Antes de Django 2.0 este proceso requería utilizar expresiones regulares, pero ahora gracias a la función **path** es mucho más sencillo, sólo debemos indicar el nombre del parámetro entre <> (más pequeño, más grande):

`blog/urls.py`
```python
    from django.urls import path
    from . import views

    urlpatterns = [
        path('', views.blog, name="blog"),
        path('category/<category_id>/', views.category, name="category"),
    ]
```

Esto ya funcionará, pero por defecto **category_id** será una cadena y el campo id es un número entero. Podemos forzar la conversión a entero cambiándolo a:

```python
path('category/<int:category_id>/', views.category, name="category"),
```

Sea como sea con esto añadimos dinamismo en la URL, de manera que podemos enviar un parámetro y nos será muy fácil recuperar la categoría, pero antes vamos a crear un template **category.html** como una copia de **blog.html**, sólo que en el título mostraremos el nombre de la categoría:

`blog/templates/blog/category.html`
```html
{% raw %}{% extends 'core/base.html' %}

{% load static %}

{% block title %}{{category}}{% endblock %}

{% block content %}
    {% for post in posts %}
    <section class="page-section cta">
        <div class="container">
            <div class="row">
                <div class="col-xl-9 mx-auto">
                    <div class="cta-innerv text-center rounded">
                    <h2 class="section-heading mb-5">
                        <span class="section-heading-upper">
                            {{post.published}}</span>
                        <span class="section-heading-lower">
                            {{post.title}}</span>
                    </h2>
                    <p class="mb-0">
                        <img class="mx-auto d-flex img-fluid mb-3 mb-lg-0" 
                            src="{{post.image.url}}" alt="">
                    </p>
                    <p class="mb-0 mbt">{{post.content}}</p>
                    <p class="mb-0 mbt">
                        <span class="section-heading-under">
                            Publicado por <em><b>{{post.author}}</b></em>
                            en <em> </em>
                        </span>
                    </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    {% endfor %}
{% endblock %}{% endraw %}
```

Ahora en la vista simplemente recuperamos la categoría utilizando el método get de objects, pasándole el campo que tiene usar como filtro:

`blog/views.py`
```python
from django.shortcuts import render
from .models import Post, Category

def blog(request):
    posts = Post.objects.all()
    return render(request, "blog/blog.html", {'posts':posts})

def category(request, category_id):
    category = Category.objects.get(id=category_id)
    return render(request, "blog/category.html", {'category':category})
```

Si intentamos acceder a una categoría, por ejemplo la de id 1 que es la primera que se crea, nos la devolverá correctamente:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/36.png" style="max-width:305px"/></div>

Lo malo de utilizar directamente el método get, es que si no se encuentra un resultado Django devolverá un error:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/37.png" style="max-width:375px"/></div>

Para evitar esta situación y devolver un error 404, el típico de no encontrado, podemos utilizar un shortcut llamado **get_object_or_404**:

`blog/views.py`
```python
from django.shortcuts import render, get_object_or_404
from .models import Post, Category

def blog(request):
    posts = Post.objects.all()
    return render(request, "blog/blog.html", {'posts':posts})

def category(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    return render(request, "blog/category.html", {'category':category})
```

Ahora si da error, por lo menos será un error dentro de la nomenclatura, ya que el 404 es el error que por norma hay que devolver si no se encuentra una página. Aunque con el Debug nos salga en forma de información:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/38.png" style="max-width:435px"/></div>

Sea como sea ahora que tenemos la categoría podemos buscar sus entradas. Una forma rudimentaria de hacerlo es crear otra consulta para recuperar las entradas filtrando por categoría:

`blog/views.py`
```python
from django.shortcuts import render
from .models import Post, Category

def blog(request):
    posts = Post.objects.all()
    return render(request, "blog/blog.html", {'posts':posts})

def category(request, category_id):
    posts = Post.objects.filter(categories=category)
    category = Category.objects.get(id=category_id)
    return render(request, "blog/category.html", 
        {'category':category, 'posts':posts})
```

Esto ya nos funcionará:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/39.png" style="max-width:485px"/></div>

Sin embargo como os decía es una forma rudimentaria de hacerlo, y eso es porque Django nos ofrece una forma mucho más fácil de hacerlo gracias a la capacidad de las relaciones de hacer consultas inversas.

Vamos a dejar la vista como la teníamos, únicamente pasando la categoría:

`blog/views.py`
```python
from django.shortcuts import render, get_object_or_404
from .models import Post, Category

def blog(request):
    posts = Post.objects.all()
    return render(request, "blog/blog.html", {'posts':posts})

def category(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    return render(request, "blog/category.html", {'category':category})
```

Ahora vamos a nuestro template, y en lugar de recorrer las entradas, que no tenemos porque no estamos pasando ninguna clave con este nombre, haremos la siguiente magia:

```html
{% raw %}{% for post in category.posts_set.all %}{% endraw %}
```

Si comprobamos nuestra web veremos que increíblemente funciona:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/40.png" style="max-width:485px"/></div>

¿Cómo puede ser? Pues fácil, las relaciones no sólo existen en un sentido, sino en ambos. Aprovechando ésto, Django implementa una sintaxis genérica con **modelo.modeloRelacionado_set.all** para consultar todas las instancias del modeloRelacionado con el modelo. 

Su limitación es que sólo podemos tener una relación a dos bandas con el mismo nombre genérico, pero no es nada que no se pueda arreglar manualmente. Por ejemplo en nuestro caso, simplemente deberíamos ir a nuestro modelo Post y en la relación Many2Many categories, añadir un campo llamado **related_name**, nombre relacionado:

`blog/models.py`
```python
categories = models.ManyToManyField(Category,
    verbose_name="Categorías", related_name="get_posts")
```

Una vez hecho, en lugar del **_set.all** podemos llamar a este nombre relacionado:

!!! note 
```html
{% raw %}{% for post in category.get_posts.all %}{% endraw %}
```

Ahora que tenemos la página de categorías vamos a finalizar la app añadiendo los enlaces que dejamos pendientes. Por desgracia ya no podemos utilizar el join porque necesitamos crear un enlace, así que vamos a usar un for:

```html
{% raw %}<span class="section-heading-under">
    Publicado por <em><b>{{post.author}}</b></em> en
    {% for category in post.categories.all %}
        <a href="{% url 'category' category.id %}" class="link">
            {{category.name}}</a>
    {% endfor %}
</span>{% endraw %}
```

<u>Antes de continuar no olvides añadir los enlaces también en el template **blog.html**</u>.

Por último un pequeño detalle que quizá os pasará desapercibido, pero nuestro menú deja de resaltar BLOG cuando filtramos por una categoría:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/42.png" style="max-width:100px"/></div>

Claro, la url ahora ya no es **/blog/** si no **/blog/category/etc**. Por suerte con un poco de ingenio podemos arreglarlo recortando los primeros caracteres del path con el filtro slice (que hace lo mismo que el slicing con las colecciones):

`core/templates/core/base.html`
```html
{% raw %}<li class="nav-item px-lg-4 
    {% if request.path|slice:":6" == '/blog/' %}active{% endif %}">
    <a class="nav-link text-uppercase text-expanded" 
        href="{% url 'blog' %}">Blog</a>
</li>{% endraw %}
```

Y con esto damos por finalizada esta pequeña app Blog.

___
<small class="edited"><i>Última edición: 31 de Octubre de 2018</i></small>