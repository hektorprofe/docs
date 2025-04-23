title: Configurando el proyecto | Curso de Django | Hektor Profe
description: Con el proyecto creado, el siguiente paso es realizar la configuración inicial para ponernos en marcha.

# Configurando el proyecto

Con el proyecto creado, el siguiente paso es realizar la configuración inicial para ponernos en marcha, pero antes vamos a hablar brevemente de esta jerarquía de ficheros que se han creado automáticamente.

Dejando de banda el directorio **.vscode**, que crea nuestro editor, lo primero que notaréis es que la propia carpeta webpersonal contiene a su vez otra carpeta webpersonal junto a un fichero llamado **manage.py**. Este fichero es un script que sirve para gestionar todo nuestro proyecto desde la terminal, y lo vamos a estar utilizando un montón.

Por otro lado el subdirectorio _webpersonal_ es el que contiene los scripts base del proyecto, los cuales tienen toda la configuración inicial y de despliegue.

Resumiendo mucho, el fichero **\_\_init.py\_\_** nos indica que la carpeta es un paquete, **settings.py** es el que contiene la configuración del proyecto, **urls.py** es el fichero encargado de manejar las direcciones de la web (sí esas que se escribirán en la barra del navegador) y por último **wsgi.py**, un script que contiene la información para desplegar el proyecto en producción, algo que trataremos en la _Sección 5. Despliegue_.

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/03.png"/></div>

Creo que es mejor que descubramos sobre la marcha estos ficheros, así que por ahora vamos a centrarnos sólo en el manage. Desde Visual Studio Code, vamos abrir el directorio donde se encuentra **manage.py**.

Lo vamos a ejecutar abriéndolo y ejecutando el script con clic derecho, de esa forma el propio Visual Studio Code nos activará el entorno virtual, es un pequeño truco.

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/04.png"/></div>

Ahora vamos a ejecutar el script junto con el comando runserver, que significa correr o poner en marcha el servidor:

```
(django2) python manage.py runserver
```

Esto pondrá en marcha el servidor de desarrollo de Django y podremos acceder a la web que se ha generado haciendo clic en la dirección mientras presionamos _Control_:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/05.png"/></div>

Así veremos nuestro primer proyecto y cómo Django nos da la bienvenida. Fijaros que nos muestra un mensaje:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/06.png"/></div>

> Estás viendo esta página porque el DEBUG está en True en tu settings y no has configurado ninguna URL.

¿Settings… eh? Vamos un momento a nuestro fichero settings.py. Ahí vamos a encontrar una configuración muuuy extensa, llena de variables, listas, directorios… Por ahora quedémonos con la de **DEBUG = True**, como véis nos indica una descripción justo encima "_AVISO DE SEGURIDAD: no poner en marcha con el debug en producción_".

`webpersonal/settings.py`
```python
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
```

Hablemos un poco sobre esto porque es muy importante. El modo **DEBUG**, o en español el modo de **DEPURACIÓN**, es un modo de ejecución especial en el que siempre que ocurra un fallo, Django nos mostrará un montón de información para analizarla y poder solucionarlo. Óbviamente esta información es confidencial, ya que muestra valores de variables, rutas de directorios y otros datos importantes. Es por eso que en cuanto publiquemos o mejor dicho, despleguemos un proyecto de Django en Internet, lo primero que haremos siempre es desactivar el modo **DEBUG** poniéndolo a _False_.

Otra cosa interesante de Django que os va a gustar mucho, es su interfaz viene traducida a a un montón de idiomas. Podemos cambiar el idioma por defecto cambiando la variable del fichero settings: _LANGUAGE_CODE_ a _es_. Si queréis algo más específico consultad la documentación del enlace justo encima:

`webpersonal/settings.py`

```python
# Internationalization # https://docs.djangoproject.com/en/dev/topics/i18n/
LANGUAGE_CODE = 'es'
```

Sólo habiendo hecho este cambio el servidor de Django se reiniciará aplicando los cambios, y si recargamos la pantalla de antes… ¡Sorpresa! Ahora nos sale en español:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/07.png"/></div>

El siguiente paso que tenemos que llevar a cabo, justo después de crear un proyecto, es crear la base de datos inicial. Lo tenemos que hacer para que Django pueda gestionar un montón de cosas por nosotros, como por ejemplo las sesiones, los usuarios o los grupos. Para hacerlo vamos de vuelta al fichero **settings.py** y buscaremos el diccionario llamado _DATABASES_.

`webpersonal/settings.py`

```python
# Database # https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

Lo que tenemos aquí es una configuración predeterminada utilizando la base de datos SQLite3. Sí, Django trabaja con bases de datos SQL, y es compatible con unas cuantas. Si accedemos al enlace de la documentación veremos exactamente cuales en el apartado _ENGINES_:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/08.png"/></div>

PostgreSQL, MySQL, SQLite3 y Oracle. ¿Y qué pasa con SQL Server de Microsoft? Pues no está soportada por defecto, aunque sí existen módulos externos como Django-MSSQL, pero claro, ya requiere una configuración más avanzada.

Nosotros vamos a trabajar siempre con bases de datos SQLite3. Este motor se maneja en un fichero y no requiere instalar ningún servidor de base de datos, es lo mejor para ir aprendiendo.

La configuración por defecto para utilizar SQLite3 es simplemente el _ENGINE_ y una ruta al directorio donde se creará la base de datos, que por defecto es el directorio principal del proyecto y se llamará **db.sqlite3**. Si os interesa conectar con MySQL, PostgreSQL u Oracle significa que estáis familiarizados con estos sistemas, echad un vistazo al ejemplo de la documentación para conectar PostgreSQL, no cambiará mucho en los otros servidores:

`webpersonal/settings.py`

```python
DATABASES = { 
    'default': { 
        'ENGINE': 
        'django.db.backends.postgresql', 
        'NAME': 'mydatabase', 
        'USER': 'mydatabaseuser', 
        'PASSWORD': 'mypassword', 
        'HOST': '127.0.0.1', 
        'PORT': '5432'
    } 
}
```

Así pues vamos a sincronizar la base de datos inicialmente, ¿cómo lo hacemos? Pues fijaros que si volvemos a nuestra terminal, justo en el momento que hemos puesto en marcha el servidor nos aparece un mensaje:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/09.png"/></div>

> <i>Tienes 14 migraciones sin aplicar. Tu proyecto puede no funcionar correctamente hasta que apliques las migraciones para las apps admin, auth, contenttypes y sessions. Ejecuta 'python manage migrate' para aplicarlas.</i>

Bueno, pues ahí tenemos el comando. Nos pide migrar esas "apps", de las que en un momento vamos a hablar. Por ahora simplemente ejecutémoslo (parando el servidor _Control + C_):

```
(django2) python manage.py migrate
```

Con esto tenemos migrada la configuración inicial y a Django listo para sacarle todo el jugo.

Por ahora lo vamos a dejar aquí, nos vemos en la siguiente lección.

---

<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>
