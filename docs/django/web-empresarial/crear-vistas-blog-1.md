title: Creando las vistas del Blog (1) | Curso de Django | Hektor Profe
description: Ya tenemos los modelos listos así que nos toca desarrollar las vistas.

# Creando las vistas del Blog (1)

Bien, ya tenemos los modelos listos así que nos toca desarrollar las vistas. Vamos a crear vistas, una para mostrar todas las noticias, y otra para filtrar por categorías. En el próximo proyecto os enseñaré a crear paginadores y otras cosas interesantes, pero por ahora lo vamos a mantener lo más simple posible.

Vamos a prepararlo todo, trasladando el template blog.html y su respectiva vista a la app Blog y poniendo bien las urls:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/28-5.png" style="max-width:150px"/></div>

`blog/views.py`
```python
from django.shortcuts import render

def blog(request):
    return render(request, "blog/blog.html")
```

`blog/urls.py`
```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.blog, name="blog"),
]
```

`webempresa/urls.py`
```python
urlpatterns = [
    path('', include('core.urls')),
    path('blog/', include('blog.urls')),
    path('services/', include('services.urls')),
    path('admin/', admin.site.urls),
]
```

Ya debería funcionar:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/29.png" style="max-width:350px"/></div>

Vamos a recuperar las noticias y a fusionar su template:

`blog/views.py`
```python
from django.shortcuts import render
from .models import Post, Category

def blog(request):
    posts = Post.objects.all()
    return render(request, "blog/blog.html", {'posts':posts})
```

Fusionaremos todo menos las categorías:

`blog/templates/blog/blog.html`
```html
{% raw %}{% extends 'core/base.html' %}

{% load static %}

{% block title %}Blog{% endblock %}

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

Si echamos un vistazo al resultado todo está correcto, fijaros como el autor hace referencia al Usuario y nos lo muestra bien:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/30.png" style="max-width:350px"/></div>

Sin embargo la fecha de publicación no está en el formato que necesitamos, según nuestro frontend sólo necesitamos mostrar DIA/MES/AÑO separados con barras. Para conseguir este resultado podemos utilizar el template tag date y darle el formato deseado. En nuestro caso nos interesa uno predeterminado llamado **SHORT_DATE_FORMAT**:

```html
{% raw %}<span class="section-heading-upper">
    {{post.published|date:"SHORT_DATE_FORMAT"}}
</span>{% endraw %}
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/31.png" style="max-width:120px"/></div>

Otra cosa importante es que por defecto no se respetan los saltos de línea en el cuerpo de la noticia, para activarlos debemos indicar el template tag **linebreaks** en el contenido:

```html
{% raw %}<p class="mb-0 mbt">
    {{post.content|linebreaks}}
</p>{% endraw %}
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/32.png"/></div>

Y por último vamos a por las categorías. Si comentamos lo que tenemos en el diseño y simplemente mostramos la relación many2many nos aparecerá algo muy raro:

```html
{% raw %}<p class="mb-0 mbt">
    <span class="section-heading-under">
        Publicado por <em><b>{{post.author}}</b></em>
        en <em>{{post.categories}}</em>
    </span>
</p>{% endraw %}
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/33.png" style="max-width:380px"/></div>

Esto es porque categories se comporta como una consulta a la base de datos, tenemos que indicarle exactamente qué queremos mostrar, normalmente añadiendo **.all** para en nuestro caso hacer referencia a todas las categorías de la entrada:

```html
{% raw %}<p class="mb-0 mbt">
    <span class="section-heading-under">
        Publicado por <em><b>{{post.author}}</b></em>
        en <em>{{post.categories.all}}</em>
    </span>
</p>{% endraw %}
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/34.png" style="max-width:700px"/></div>

Esto hará la consulta y nos devolverá un QuerySet, evidentemente eso no lo queremos. Podemos hacer algo más fácil, utilizar un templatetag join para mostrar las categorías separadas por comas:

```html
{% raw %}<p class="mb-0 mbt">
    <span class="section-heading-under">
        Publicado por <em><b>{{post.author}}</b></em>
        en <em>{{post.categories.all|join:", "}}</em>
    </span>
</p>{% endraw %}
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/35.png" style="max-width:385px"/></div>

Por ahora vamos a dejarlo así, luego cuando tengamos la vista para filtrar por categoría volveremos para poner los enlaces.

___
<small class="edited"><i>Última edición: 31 de Octubre de 2018</i></small>