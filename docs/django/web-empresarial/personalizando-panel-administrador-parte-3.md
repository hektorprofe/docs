title: Personalizando el administrador (3) | Curso de Django | Hektor Profe
description: Añadir un editor WYSIWYG Ckeditor para los campos de texto.

# Personalizando el administrador (3)

Antes de ponernos la última app de contacto y acabar la web, voy a enseñaros cómo añadir un editor WYSIWYG para los campos de texto de nuestro modelos.

Un editor WYSIWYG , del inglés "What You See Is What You Get" o "Lo que ves es lo que consigues", representa una interfaz avanzada para editar texto enriquecido, como si de un fichero Word se tratase.

Existen muchos editores WYSIWYG, pero uno de los más utilizados en el mundo del desarrollo web es CKEditor, un proyecto muy maduro y compatible con Django. Su integración es tan simple que en unos pocos pasos lo tendremos funcionando.

Empezaremos instalando la app django-ckeditor con pip:

```
(django2) pip install django-ckeditor
```

Luego la añadiremos a las apps de Django en **settings.py**:

`webempresa/settings.py`
```python
INSTALLED_APPS = [
    ...
    'ckeditor',
]
``` 

Con esto ya tenemos listo CKEditor, sólo nos resta configurar los campos donde queramos mostrar el editor WYSIWYG. Lo haremos de la siguiente forma, importando el campo **RichTextField** de la app **CKeditor**, y sustituyendo el campo **models.TextField** por este que hemos importado:

`pages/models.py`
```python
content = RichTextField(verbose_name="Contenido")
``` 

Ahora pondremos el servidor en marcha, vamos a editar una página y...

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/60.png" /></div>

¿Qué os parece? Aquí tenemos un editor visual para nuestro campo de texto. En él podemos poner estilos visuales, negritas, cursivas, subrayados, enlaces, etc.

**CKEditor** incluye muchísimas funcionalidades y podríamos estar hablando de él horas y horas, así que por mi parte sólo os voy a enseñar como cambiar la configuración básica. 

Para establecer una configuración personalizada en la barra de CKEditor tendremos que redefinir su diccionario de configuración en **settings.py**:

`webempresa/settings.py`
```python
# Ckeditor
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': None,
    }
}
``` 

Si establecemos el valor de la toolbar en None le estaremos diciendo que muestre todos los campos posibles:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/61.png"/></div>

Esto es una bestialidad, por eso quizá os interesa más mostrar una versión compacta sólo con negritas y cursivas:

`webempresa/settings.py`
```python
# Ckeditor
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'Basic',
    }
}
``` 

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/62.png" style="max-width:385px"/></div>

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/63.png"/></div>

En la página de la app django-ckeditor encontraréis la documentación completa y ejemplos para adaptar la barra a vuestras necesidades: [https://github.com/django-ckeditor/django-ckeditor](https://github.com/django-ckeditor/django-ckeditor)

Por ejemplo una barra personalizada con nos dan de ejemplo la definiríamos de la siguiente forma:

`webempresa/settings.py`
```python
# Ckeditor
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Bold', 'Italic', 'Underline'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 
             'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
            ['Link', 'Unlink'],
            ['RemoveFormat', 'Source']
        ]
    }
}
``` 

A partir de esta configuración podemos observar que cada sublista de toolbar_Custom es un grupo de botones, sería cuestión de jugar con ellos para mostrarlos y esconderlos:

`webempresa/settings.py`
```python
# Ckeditor
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Bold', 'Italic', 'Underline'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 
             'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
            ['Link', 'Unlink']
        ]
    }
}
``` 

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/64.png"/></div>

Una vez guardamos el contenido y vamos al frontend, veremos que nos aparece el código HTML no interpretado:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/65.png"/></div>

Le tenemos que decir a Django, tranquilo, este contenido contiene HTML seguro así que interprétalo. Eso lo haremos sustituyendo el template tag **linebreaks** por **safe**:

`pages/templates/pages/sample.html`
```html
{% raw %}{{page.content|safe}}{% endraw %}
``` 

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/66.png"/></div>

Si queréis practicar un poco más podéis poner el editor WYSIWYG en el contenido de las entradas del blog.
___
<small class="edited"><i>Última edición: 1 de Noviembre de 2018</i></small>