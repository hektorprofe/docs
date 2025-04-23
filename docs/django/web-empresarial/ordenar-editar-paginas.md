title: Ordenación y edición de páginas | Curso de Django | Hektor Profe
description: Hay un par de funcionalidades que podemos añadir a nuestro sistema de páginas.

# Ordenación y edición de páginas

Si algo tiene el desarrollo de software es que nunca hay límite de mejora. Con eso en mente hay un par de funcionalidades que podemos añadir a nuestro sistema de páginas secundarias.

La primera consiste en un sistema de ordenación manual. Hasta ahora hemos estado ordenando nuestros modelos automáticamente, pero quizá algún cliente quiera establecer un orden distinto.

Cuando necesitemos hacerlo, os sugiero crear un campo en el modelo llamado order (orden) y de tipo Small Integer (entero pequeño) y con un valor 0 por defecto.

`pages/models.py`
```python
order = models.SmallIntegerField(verbose_name="Orden", default=0)
``` 

También cambiaremos la ordenación por defecto al campo order, y de segunda opción el título:

`pages/models.py`
```python
ordering = ['order','title']
``` 

Aplicamos las migraciones:

```
(django2) python manage.py makemigrations pages
(django2) python manage.py migrate pages
```

Y modificamos el admin.py para mostrar el orden en segundo lugar:

`pages/admin.py`
```python
class PageAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated')
    list_display = ('title', 'order')
``` 

De vuelta a nuestro panel de administrador podemos establecer un número de orden a cada página, un orden que sin cambiar nada se respetará en el frontend:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/56.png" style="max-width:450px"/></div>

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/57.png" style="max-width:400px"/></div>

Sólo le tenemos que decir al cliente, que si quiere cambiar el orden debe poner un número y que los más pequeños se muestran antes. 

El segundo detalle tiene que ver con la edición directa. Por ejemplo, tenemos al administrador de la página viendo la página de "políticas de privacidad" y detecta un fallo. Pues podríamos añadir un enlace de edición si la web detecta que un usuario ha iniciado sesión. Vamos a hacerlo.

Para saber si un usuario está identificado, os gustará saber que Django inyecta información de la sesión activa en el contexto, igual que hicimos nosotros manualmente para las redes sociales. Concretamente lo maneja con:

`webempresa/settings.py`
```python
'django.contrib.auth.context_processors.auth'
``` 

Como este procesador de contexto viene activado por defecto, podemos ir al template sample.html de las páginas y añadir el siguiente template tag:

`pages/templates/pages/sample.html`
```html
{% raw %}<div class="section-content">
    {{page.content|safe}}
    {% if user.is_authenticated %}
     <p><a href="#">Editar</a></p>
    {% endif %}
</div>{% endraw %}
```

Sí, en todos los templates tenemos una variable user que almacena el usuario identificado, y podemos comprobar cómodamente si se encuentra autenticado en el panel de administrador con su método **is_authenticated** para mostrar el enlace de edición.

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/58.png" style="max-width:150px"/></div>

Sólo tenemos que configurar el enlace, ¿a dónde debe apuntar? Obviamente a la dirección donde podemos editar la página. Podríamos ponerla en crudo, pero no es elegante. Lo haremos bien, utilizando **{% raw %}{% urls %}{% endraw %}** de la siguiente forma:

`pages/templates/pages/sample.html`
```html
{% raw %}<div class="section-content">
    {{page.content|safe}}
    {% if user.is_authenticated %}
     <p><a href="{% url 'admin:pages_page_change' page.id %}">Editar</a></p>
    {% endif %}
</div>{% endraw %}
```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/webempresa/59.png" style="max-width:385px"/></div>

La lógica es simple, **{% raw %}{admin}:{app}&#95;{modelo}&#95;{accion} {id_del_objeto}{% endraw %}** (cuando sea necesario). Hay otras acciones a parte de change que la url de edición, como add y delete para añadir y borrar respectivamente.

___
<small class="edited"><i>Última edición: 1 de Noviembre de 2018</i></small>