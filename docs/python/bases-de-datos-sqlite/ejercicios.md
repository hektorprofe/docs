title: Ejercicios « Bases de datos SQLite | Curso de Python | Hektor Profe
description: ¿Qué es una base de datos? También conocidas como bancos de datos son simplemente conjuntos de datos que hacen referencia a información perteneciente a un mismo contexto.

# Ejercicios « Bases de datos SQLite

## Ejercicio 1

A lo largo de estos ejercicios vamos a crear un pequeño sistema para gestionar los platos del menú de un restaurante. 

### Parte 1

Por ahora debes empezar creando un script llamado **restaurante.py** y dentro una función **crear_bd()** que creará una pequeña base de datos **restaurante.db** con las siguientes dos tablas:
     
```sql
CREATE TABLE categoria(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) UNIQUE NOT NULL)
```
 
```sql
CREATE TABLE plato(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) UNIQUE NOT NULL, 
    categoria_id INTEGER NOT NULL,
    FOREIGN KEY(categoria_id) REFERENCES categoria(id))
```

Si ya existen deberá tratar la excepción y mostrar que las tablas ya existen, lo notarás porque en este caso no usamos el *IF NOT EXISTS* y eso lanzará un error. En caso contrario mostrará que se han creado correctamente.

!!! info "Nota"
    La línea **FOREIGN KEY(categoria_id) REFERENCES categoria(id)** indica un tipo de clave especial (foránea), por la cual se crea una relación entre la categoría de un plato con el registro de categorías.

Llama a la función y comprueba que la base de datos se crea correctamente.

### Parte 2

Crea una función llamada **agregar_categoria()** que pida al usuario un nombre de categoría y se encargue de crear la categoría en la base de datos (ten en cuenta que si ya existe dará un error, por que el nombre es UNIQUE). 

Luego crea un pequeño menú de opciones dentro del script, que te de la bienvenida al sistema y te permita *Crear una categoría* o *Salir*. Puedes hacerlo en una función **mostrar_menu()**. Añade las siguientes tres categorías utilizando este menú de opciones:

* Primeros 
* Segundos 
* Postres

### Parte 3

Crea una función llamada **agregar_plato()** que muestre al usuario las categorías disponibles y le permita escoger una (escribiendo un número).

Luego le pedirá introducir el nombre del plato y lo añadirá a la base de datos, teniendo en cuenta que la categoria del plato concuerde con el id de la categoría y que el nombre del plato no puede repetirse (no es necesario comprobar si la categoría realmente existe, en ese caso simplemente no se insertará el plato).

Agrega la nueva opción al menú de opciones y añade los siguientes platos:

* **Primeros**: Ensalada del tiempo / Zumo de tomate
* **Segundos**: Estofado de pescado / Pollo con patatas
* **Postres**: Flan con nata / Fruta del tiempo

### Parte 4

Crea una función llamada **mostrar_menu()** que muestre el menú con todos los platos de forma ordenada: los primeros, los segundos y los postres. Optativamente puedes adornar la forma en que muestras el menú por pantalla.

## Ejercicio 2

En este ejercicios debes crear una interfaz gráfica con tkinter (menu.py) que muestre de forma elegante el menú del restaurante.

* Tú eliges el nombre del restaurante y el precio del menú, así como las tipografías, colores, adornos y tamaño de la ventana.
* El único requisito es que el programa se conectará a la base de datos para buscar la lista categorías y platos.

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/menu.png"/></div>

## Soluciones

Disponibles solo para los alumnos <u>[matriculados en el curso](https://www.hektorprofe.net/cupon/python)</u>.

___
<small class="edited"><i>Última edición: 5 de Octubre de 2018</i></small>