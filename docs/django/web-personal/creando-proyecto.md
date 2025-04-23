title: Creando el proyecto | Curso de Django | Hektor Profe
description: Antes de crear el proyecto vamos a comentar el plan de desarrollo oficial de Django Framework.

# Creando el proyecto

Antes de crear el proyecto vamos a comentar el plan de desarrollo oficial de Django Framework.

Como sabéis este es un curso sobre Django 2.0. El caso es que tanto esta versión como sus futuras actualizaciones tendrán un ciclo de vida de 2 años hasta Diciembre de 2019, momento cuando "en teoría" se publicará Django 3.0.

Por suerte la última actualización de esta serie, la 2.2, tendrá soporte extendido hasta 2022, eso significa que seguirán arreglando bugs y fallos de seguridad pero no añadirán nuevas funcionalidades. A medida que se publiquen las actualizaciones de la versión 2 (la 2.1 y la 2.2) os compartiré los cambios más importantes en la *Sección 6. Anexo* del curso. 

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/01b.png" /></div>

Ahora sí, dando por hecho que todos podemos crear entornos virtuales y tenemos un editor, voy a proceder abrir una terminal y a crear un nuevo entorno. Lo voy a llamar **django2** haciendo referencia a que en él instalaré esta versión. Tened en cuenta que Django 2 requiere Python 3.4 o superior, así que mientras utilicéis una versión mayor a esa no deberíais tener problemas. Actualmente la versión más actual de Python es la 3.6.4 así que utilizaré esa, vosotros podéis utilizar la más actual:

```
conda create -n django2 python=3.6.4
```

```
activate django2
```

Ahora, a diferencia de lo que digo en el vídeo, se han reportado fallos de seguridad en la versión 2.0 así que os recomiendo instalar la versión 2.1 o superior de Django:

```
(django2) pip install django==2.1
```

Para saber si Django está bien instalado podemos hacer lo siguiente, desde el entorno virtual:

```
(django2) python -m django --version
```

Ahora, estando en el directorio **CursoDjango** y siempre con nuestro entorno virtual activo, ejecutaremos las palabras mágicas para crear un nuevo proyecto con Django:

```
(django2) django-admin startproject webpersonal
```

Si no ocurre nada es buena señal, porque si abrimos nuestro directorio ahí tendremos creada una jerarquía de carpetas cuya raíz es el nombre que le hemos puesto **webpersonal**:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/django/02.png"/></div>

Una vez tenemos nuestro primer proyecto vamos a abrir el directorio en Visual Studio Code desde **Archivo > Abrir carpeta** o arrastrándolo al programa.

___
<small class="edited"><i>Última edición: 25 de Octubre de 2018</i></small>