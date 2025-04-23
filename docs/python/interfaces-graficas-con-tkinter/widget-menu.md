title: Widget Menu (Menú) | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Widget Menu (Menú)

En esta lección vamos a aprender a crear un menú superior de toda la vida con varias secciones. 

El primer widget menú que creamos hace referencia a la barra de menú, de ahí que se le suele llamar menubar:

!!! info "" 

    ```python
    from tkinter import *

    root = Tk()

    menubar = Menu(root)
    root.config(menu=menubar)  # Lo asignamos a la base

    root.mainloop()
    ```

Una vez creada la barra podemos comenzar a añadir submenús y comandos. Empecemos con los submenús:

!!! info "" 

    ```python
	filemenu = Menu(menubar)
	editmenu = Menu(menubar)
	helpmenu = Menu(menubar)
    ```

Ya tenemos los submenús, pero todavía nos falta añadirlos a la barra de menú:

!!! info "" 

    ```python
	menubar.add_cascade(label="Archivo", menu=filemenu)
	menubar.add_cascade(label="Editar", menu=editmenu)
	menubar.add_cascade(label="Ayuda", menu=helpmenu)
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/16.png"/></div>

Bien ya tenemos nuestra barra con los 3 submenús funcionando bien, pero ocurre algo raro, nos aparece una especie de elemento por defecto. Podemos hacer que desaparezca si indicamos el parámetro tearoff=0:

!!! info "" 

    ```python
	filemenu = Menu(menubar, tearoff=0)
	editmenu = Menu(menubar, tearoff=0)
	helpmenu = Menu(menubar, tearoff=0)
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/17.png"/></div>

Ahora  sí que lo tenemos bien, ¿pero está demasiado vacío no? Vamos a añadir comandos de ejemplo en nuestros submenús:

!!! info "" 

    ```python
    filemenu = Menu(menubar, tearoff=0)
    filemenu.add_command(label="Nuevo")
    filemenu.add_command(label="Abrir")
    filemenu.add_command(label="Guardar")
    filemenu.add_command(label="Cerrar")
    ```

También podemos agregar un separador y un comando de salir con root.quit:

!!! info "" 

    ```python
    filemenu.add_separator()
    filemenu.add_command(label="Salir", command=root.quit)
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/18.png"/></div>

Tened en cuenta que debéis crear una funcionalidad para cada comando, pero como sólo estamos haciendo una prueba vamos a crear algunas opciones más de ejemplo:

!!! info "" 

    ```python
    editmenu = Menu(menubar, tearoff=0)
    editmenu.add_command(label="Cortar")
    editmenu.add_command(label="Copiar")
    editmenu.add_command(label="Pegar")

    helpmenu = Menu(menubar, tearoff=0)
    helpmenu.add_command(label="Ayuda")
    helpmenu.add_separator()
    helpmenu.add_command(label="Acerca de...")
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/19.png"/></div>

Código final:

!!! info "" 

    ```python
    from tkinter import *

    # Configuración de la raíz
    root = Tk()

    menubar = Menu(root)
    root.config(menu=menubar)

    filemenu = Menu(menubar, tearoff=0)
    filemenu.add_command(label="Nuevo")
    filemenu.add_command(label="Abrir")
    filemenu.add_command(label="Guardar")
    filemenu.add_command(label="Cerrar")
    filemenu.add_separator()
    filemenu.add_command(label="Salir", command=root.quit)

    editmenu = Menu(menubar, tearoff=0)
    editmenu.add_command(label="Cortar")
    editmenu.add_command(label="Copiar")
    editmenu.add_command(label="Pegar")

    helpmenu = Menu(menubar, tearoff=0)
    helpmenu.add_command(label="Ayuda")
    helpmenu.add_separator()
    helpmenu.add_command(label="Acerca de...")

    menubar.add_cascade(label="Archivo", menu=filemenu)
    menubar.add_cascade(label="Editar", menu=editmenu)
    menubar.add_cascade(label="Ayuda", menu=helpmenu)

    # Finalmente bucle de la aplicación
    root.mainloop()
    ```

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>