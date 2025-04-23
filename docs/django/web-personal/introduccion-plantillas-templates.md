title: Introducción a las plantillas: Templates | Curso de Django | Hektor Profe
description: Hasta ahora hemos estado devolviendo HTML plano, por eso Django nos ofrece la posibilidad de utilizar plantillas HTML.

# Introducción a las plantillas: Templates

Hasta ahora hemos estado devolviendo HTML plano utilizando el método **HttpResponse**. Como podéis suponer esto no es muy práctico, por eso Django nos ofrece la posibilidad de utilizar plantillas HTML (en inglés templates) mucho más cómodas y repletas de funcionalidades.

Para utilizar una plantilla lo primero es crearla, pero no la podemos crearla donde nos apetezca, debemos hacerlo siguiendo una lógica. Lo primero es crear un directorio **templates** en nuestra app, que dentro debe contener otro directorio con el mismo nombre que la app, en nuestro caso **core**.

Tenemos que hacerlo así porque Django funciona mezclando los directorios templates de las apps, de manera que al final él tiene un solo directorio **templates** y dentro otro para cada app. 

Dentro de este subdirectorio **templates/core** de la app vamos a comenzar creando un fichero **home.html**:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/17.png"/></div>

Dentro vamos a poner todo el código HTML tal cual será devuelto al llamar la vista home, algo más o menos así:

`core/templates/core/home.html`

```html
<h1>Mi Web Personal</h1>

<ul>
    <li><a href="/">Portada</a></li>
    <li><a href="/about/">Acerca de</a></li>
    <li><a href="/contact/">Contacto</a></li>
</ul>

<h2>Bienvenidos</h2>

<p>Esto es la portada.</p>
```

Evidentemente lo suyo sería crear bien la estructura de nuestro HTML, pero por ahora vamos a dejarlo así.

Lo que nos interesa es cambiar nuestra vista para que en lugar de devolver la respuesta HttpResponse devuelva este template HTML, y para lograrlo vamos utilizar el método render del módulo http de Django, que ya viene incluido por defecto.

`core/views.py`

```python
def home(request):
    return render(request, "core/home.html")
```

Una vez hecho vamos a probar si carga la portada, pero como podréis observar no funcionará:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/18.png"/></div>

Por defecto Django optimiza el uso de la memoria así que no carga las plantillas de una app que no esté instalada en **settings.py**. Para cargar la app core y sus plantillas en memoria debemos ir al fichero **webpersonal/settings.py** y añadir la app en la lista *INSTALLED_APPS* justo abajo del todo:

`webpersonal/settings.py`

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',  # <====
]
``` 

Ahora probamos de nuevo y ya funcionará como debe.

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>