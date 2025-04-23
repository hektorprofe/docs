title: Widget Tk (Raíz) | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Widget Tk (Raíz)

Muy bien, pues vamos a comenzar por lo más esencial, **la raíz** o base de la interfaz gráfica. 

Recordad que la raíz es el contenedor base de todos los widgets que forman la interfaz, no tiene tamaño propio sino que se adapta a los widgets que contiene:

!!! info "" 

    ```python
    from tkinter import *

    # Creamos la raíz
	root = Tk()

    # Comenzamos el bucle de aplicación, es como un while True
	root.mainloop()  
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/01.png"/></div>

Un par de opciones interesantes:

!!! info "" 

    ```python
	root.title("Hola mundo")     # Título de la ventana 
	root.iconbitmap('hola.ico')  # Icono de la ventana, en ico o xbm en Linux
	root.resizable(0, 0)         # Desactivar redimensión de ventana    
    ```

!!! info "Icono en GNU/Linux"
    En la mayoría de distribuciones hay que usar un icono de tipo xbm con la siguiente lógica:

    ```python
    root.iconbitmap('@hola.xbm')
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/02.png"/></div>

!!! tip "Tip Windows: Abrir los scripts gráficos con doble clic"
    Si cambiamos la extensión de nuestros scripts gráficos a **.pyw** y asignamos el ejecutable **pythonw.exe** como aplicación por defecto para abrirlos podremos ejecutarlos haciendo doble clic. Podéis encontrar el ejeuctable en la carpeta de Anaconda. Por cierto, la 'w' significa 'windowed' (modo ventana) y esconde la terminal de fondo.

Código final:

!!! info "" 

    ```python
    from tkinter import *

    # Configuración de la raíz
    root = Tk()
    root.title("Hola mundo")
    root.resizable(1,1)
    root.iconbitmap('hola.ico')

    # Finalmente bucle de la aplicación
    root.mainloop()
    ```

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>