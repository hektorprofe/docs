title: Añadir enlace a los proyectos | Curso de Django | Hektor Profe
description: Nuestro proyecto en principio debía tener un enlace optativo para mostrar más información, así que os toca crearlo.

# Añadir enlace a los proyectos

No sé si lo recordaréis, pero nuestro proyecto en principio debía tener un enlace optativo para mostrar más información, así que os toca crearlo. Tenéis que seguir los siguientes pasos:

* Modificar el modelo Project y añadir un campo *URLField*. Tened en cuenta que es un campo opcional, así que deberéis establecer sus atributos *null* y *blank* en *True*.
* Crear la migración y migrar la app **portfolio** para aplicar los cambios.
* Modificar el Template para que muestre un enlace llamado **Más información** que llevará a la dirección establecida. Debéis contemplar la posibilidad de que no haya un enlace y en ese caso no mostrar nada. Para ello utilizad el template tag **&#123;% if condicion %&#125; &#123;% endif %&#125;**.
* Finalmente añade una dirección en algún proyecto, deja otro vacío para ver si no se muestra en enlace.

## Solución

`portfolio/models.py`
```python
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200, 
        verbose_name="Título")
    description = models.TextField(
        verbose_name="Descripción")
    image = models.ImageField(upload_to="projects",  
        verbose_name="Imagen")
    link = models.URLField(null=True, blank=True,  # <=====
        verbose_name="Dirección Web")
    created = models.DateTimeField(auto_now_add=True, 
        verbose_name="Fecha de creación")
    updated = models.DateTimeField(auto_now=True,
        verbose_name="Fecha de edición")

    class Meta:
        verbose_name = "proyecto"
        verbose_name_plural = "proyectos"
        ordering = ["-created"]

    def __str__(self):
        return self.title
```

```
(django2) python manage.py makemigrations portfolio
(django2) python manage.py migrate portfolio
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/55.png"/></div>

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

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/56.png"/></div>

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>