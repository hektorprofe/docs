title: Personalizando el administrador (2) | Curso de Django | Hektor Profe
description: 

# Personalizando el administrador (2)

Toca un intermedio para seguir aprendiendo cómo personalizar el administrador. Hay un montón de cosas que podemos hacer con nuestros modelos, por ejemplo añadirles columnas de visualización, campos de ordenación y de búsqueda.

Vamos a practicar con las entradas de nuestro blog. Por defecto sólo nos aparece el título:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/21.png" style="max-width:220px"/></div>

Pero podemos mostrar casi todos los campos. Vamos al fichero admin.py para personalizar qué columnas queremos mostrar. 

`blog/admin.py`
```python
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'author', 'published')
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/22.png" style="max-width:625px"/></div>

Como véis así es mucho mejor, y además podemos ordenar por columnas.

También podemos indicar una tupla de ordenación, ésta indicará las prioridades de ordenación al mostrarse la tabla inicialmente. 

`blog/admin.py`
```python
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'author', 'published')
    ordering = ('author', 'published')
```

Esto nos agrupará las entradas por autor y las ordenará por fecha de publicación:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/23.png"/></div>

Si quisiéramos indicar sólo un campo de ordenación igualmente debéis crear una tupla con por lo menos un campo y una coma, sino Django no entenderá que es una tupla.

Otra cosa interesante es mostrar un formulario de búsqueda a partir de algunos campos. Es fácil y además podemos indicar campos de los modelos relacionados:

`blog/admin.py`
```python
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'author', 'published')
    ordering = ('author', 'published')
    search_fields = ('title','content','author__username', 
        'categories__name')
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/24.png" style="max-width:450px"/></div>

También cuando trabajamos con modelos que tengan campos de fechas y horas es posible activar el filtro avanzado con date_hierarchy, una imagen vale más que mil palabras:

`blog/admin.py`
```python
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'author', 'published')
    ordering = ('author', 'published')
    search_fields = ('title','content','author__username', 
        'categories__name')
    date_hierarchy = 'published'
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/25.png" style="max-width:190px"/></div>

Y ya que hablamos de filtros no podemos olvidar la tupla list_filter, gracias a la cual podemos agrupar por campos directamente en la tabla:

`blog/admin.py`
```python
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'author', 'published')
    ordering = ('author', 'published')
    search_fields = ('title','content','author__username', 
        'categories__name')
    date_hierarchy = 'published'
    list_filter = ('author__username','categories__name')
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/26.png" style="max-width:225px"/></div>

o ya para poner la guinda al pastel, quizá os estáis preguntando si es posible mostrar la lista de categorías:

`blog/admin.py`
```python
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'author', 'published', 'categories')  # <==
    ordering = ('author', 'published')
    search_fields = ('title','content','author__username', 
        'categories__name')
    date_hierarchy = 'published'
    list_filter = ('author__username','categories__name')
```

Si lo probáis veréis que no se pueden añadir campos Many2Many en la opción **list_display**, pero no os preocupéis, os voy a enseñar a crear vuestros propios campos.

Lo que vamos a hacer es definir dentro de la clase PostAdmin un método cuyo nombre debe concuerde con el de la nueva columna que queremos crear. Además de self le pasaremos obj, que representa ni más ni menos que el objeto de cada fila que se muestra en la tabla del administrador. Esto lo gestiona Django así que no le deis muchas vueltas:

`blog/admin.py`
```python
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'author', 'published', 'categories') # <====
    ordering = ('author', 'published')
    search_fields = ('title','content','author__username', 
        'categories__name')
    date_hierarchy = 'published'
    list_filter = ('author__username','categories__name')

    def post_categories(self, obj):
        pass
```

Ahora tenemos que devolver una cadena de texto con el valor a mostrar. Nosotros queremos una lista de categorías, así que vamos a crear una cadena con los nombres de todas las categorías que tiene el objeto accediendo a su campo categories.all() mientras las ordenamos por nombre:

`blog/admin.py`
```python
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'author', 'published', 'categories')
    ordering = ('author', 'published')
    search_fields = ('title','content','author__username', 
        'categories__name')
    date_hierarchy = 'published'
    list_filter = ('author__username','categories__name')

    def post_categories(self, obj):
        return ", ".join(
            [c.name for c in obj.categories.all().order_by("name")])
```

Finalmente añadiremos este método a nuestra tupla **list_display** como si fuera una columna más a mostrar:

`blog/admin.py`
```python
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'author', 'published', 'post_categories') # <==
    ordering = ('author', 'published')
    search_fields = ('title','content','author__username', 
        'categories__name')
    date_hierarchy = 'published'
    list_filter = ('author__username','categories__name')

    def post_categories(self, obj):
        return ", ".join(
            [c.name for c in obj.categories.all().order_by("name")])
```

Y ahí lo tenemos:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/27.png" style="max-width:150px"/></div>

Ya seguro estáis pensando…¿Pero que hacemos con el nombre de la columna? ¿Cómo lo cambiamos? Pues sólo tenemos que modificar el atributo **short_description** del método de esta forma:

`blog/admin.py`
```python
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'author', 'published', 'post_categories')
    ordering = ('author', 'published')
    search_fields = ('title','content','author__username', 
        'categories__name')
    date_hierarchy = 'published'
    list_filter = ('author__username','categories__name')

    def post_categories(self, obj):
        return ", ".join(
            [c.name for c in obj.categories.all().order_by("name")])
    post_categories.short_description = "Categorías"
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/28.png" style="max-width:150px"/></div>

Con esto acabamos el intermedio. Si os interesa saber cómo generar código HTML en lugar de simple texto os dejo un enlace a StackOverflow donde lo explican muy bien haciendo uso de la función mark_safe:

[https://stackoverflow.com/questions/47953705/how-do-i-use-allow-tags-in-django-2-0-admin](https://stackoverflow.com/questions/47953705/how-do-i-use-allow-tags-in-django-2-0-admin)

En la próxima lección empezaremos a crear las vistas de nuestras app Blog.

___
<small class="edited"><i>Última edición: 30 de Octubre de 2018</i></small>