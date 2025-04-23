title: Panel de administrador | Curso de Django | Hektor Profe
description: Nos quedamos en que había dos formas de añadir registros a nuestra base de datos.

# Panel de administrador

Bien, como recordaréis nos quedamos en que había dos formas de añadir registros a nuestra base de datos. Una era crear las instancias manualmente a través de formularios en vistas y la otra utilizar el panel de administrador. Evidentemente vamos a utilizar la segunda, la primera la reservaremos para más adelante.

El panel de administrador de Django es una funcionalidad que viene creada por defecto. Para acceder tenemos que entrar a la dirección **/admin** de nuestra página:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/28.png"/></div>

Esto no es casual, si abrís el **urls.py** del proyecto veréis que ya está configurado por defecto para abrirse en esa dirección como si se tratara de otra app:

`webpersonal/urls.py` 

```python
path('admin/', admin.site.urls),
```

No tenemos ningún usuario creado. Vamos a crear uno, pero no uno cualquiera, sino el superusuario, el jefazo de la página que tendrá pleno acceso. Os recomiendo no utilizar nunca el nombre de usuario admin más allá del desarrollo, es mejor vuestro nombre o un nick cualquiera.

```
(django2) python manage.py createsuperuser
```

También es buena idea poner un email real. Una vez hecho ponemos de nuevo el servidor en marcha, nos identificamos y...

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/29.png"/></div>

¡Ahí estamos! Os presento al panel de administrador, la razón por la que me enamoré de Django, y que además desde Django 2.0 es 100% adaptativo, así que vuestros clientes podrán acceder desde su móvil o tablet sin ningún problema.

Al identificados como super usuario podemos editar cualquier tabla de la base de datos a voluntad, aunque por ahora sólo nos aparecen las tablas de grupos y usuarios. 

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/30.png"/></div>

Muy bonito... pero ¿dónde está nuestro modelo de proyectos?

Para que nuestro modelo aparezca en el administrador tenemos que registrarlo en el fichero **portfolio/admin.py**:


`portfolio/admin.py` 

```python
from django.contrib import admin
from .models import Project

# Register your models here.
admin.site.register(Project)
```

Ahora actualizamos de nuevo… y ahí lo tenemos ¿qué os parece?

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/31.png"/></div>

Ahora desde este menú podemos añadir, modificar y borrar proyectos a nuestro antojo:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/32.png"/></div>

Sé que os dan muchas ganas de crear algo pero esperad un momento, vamos a tomarnos un descanso y a la vuelta le damos duro.

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>