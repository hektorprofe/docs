title: Cuarta App [Blog] Relaciones | Curso de Django | Hektor Profe
description: 

# Cuarta App [Blog] Relaciones

Con la sección de Servicios lista nos toca desarrollar la app blog para que nuestros clientes puedan publicar noticias.

Mi idea es aprovechar el desarrollo de esta nueva app para introducir las relaciones entre modelos, una capacidad muy potente del sistema ORM de Django. Concretamente veremos dos tipos, las relaciones con ForeignKeys (claves foráneas) y las relaciones Many2Many (de muchos a muchos).

Las claves foráneas nos permiten enlazar una instancia de un modelo con otra instancia de otro modelo, o incluso del mismo. Esto es perfecto por ejemplo para enlazar una entrada con un usuario, representando éste al autor. En cambio con las relaciones de muchos a muchos, Many2Many para los amigos, podremos enlazar no sólo una instancia, sino varias, lo cual es muy conveniente para asignar varias categorías a una misma entrada de forma fácil y cómoda, ya veréis.

Vamos a empezar creando nuestra app **Blog**:

```
(django2) python manage.py startapp blog
```

Ahora creamos los dos modelos **Category** y **Post**, uno para las categorías y otra para las entradas. Como haremos uso del modelo Category en el modelo Post,  lo declararemos primero.

`blog/models.py` 

``` python 

from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, 
        verbose_name="Nombre")
    created = models.DateTimeField(auto_now_add=True, 
        verbose_name="Fecha de creación")
    updated = models.DateTimeField(auto_now=True, 
        verbose_name="Fecha de edición")

    class Meta:
        verbose_name = "categoría"
        verbose_name_plural = "categorías"

    def __str__(self):
        return self.name


class Post(models.Model):
    title = models.CharField(max_length=200, 
        verbose_name="Título")
    content = models.TextField(
        verbose_name="Contenido")
    published = models.DateTimeField(default=now,
        verbose_name="Fecha de publicación")
    image = models.ImageField(upload_to="blog", null=True, blank=True,
        verbose_name="Imagen")
    author = models.ForeignKey(User, on_delete=models.CASCADE, 
        verbose_name="Autor")
    categories = models.ManyToManyField(Category, 
        verbose_name="Categorías")
    created = models.DateTimeField(auto_now_add=True, 
        verbose_name="Fecha de creación")
    updated = models.DateTimeField(auto_now=True, 
        verbose_name="Fecha de edición")    

    class Meta:
        verbose_name = "entrada"
        verbose_name_plural = "entradas"

    def __str__(self):
        return self.title
```
A comentar: 

* El datetime **published** nos permite establecer una fecha manual de publicación de la entrada, así como la imagen que subiremos al directorio media/blog y es optativa.
* Por otro lado la relación ForeignKey haciendo referencia el primer parámetro al modelo User importado de **django.contrib.auth.models**, que maneja Django de forma automática y dentro suyo el parámetro **on_delete=models.CASCADE** que le indica a Django que si borramos un usuario, se borrarán también todas las entradas de las cuales sea el autor, de ahí lo de cascada, porque el modelo User se lleva los modelos relacionados con él. 
* Finalmente la relación Many2Many apuntando al modelo Category y que nos permitirá seleccionar una o más categorías.

Ahora activamos la app en **settings.py**, creamos un admin básico y migramos:

`blog/admin.py`

```python
from django.contrib import admin
from .models import Category, Post

class CategoryAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')

class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')

admin.site.register(Category, CategoryAdmin)
admin.site.register(Post, PostAdmin)
```

```
(django2) python manage.py makemigrations blog
(django2) python manage.py migrate blog
```

Con esto ya podemos entrar al admin y experimentar el potencial de las relaciones de nuestros modelos:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/18.png" style="max-width:150px"/></div>

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/19.png" style="max-width:750px"/></div>

Podemos seleccionar un autor de entre los usuarios registrados en nuestra web gracias a la relación ForeignKey de 1 a muchos. Y varias categorías (incluso crearlas in-situ) aprovechando el potencial de las relaciones Many2Many de Muchos a Muchos:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/20.png" style="max-width:450px"/></div>

No me diréis que no es genial, esta es una de las razones por las que me enamoré de Django.

___
<small class="edited"><i>Última edición: 30 de Octubre de 2018</i></small>