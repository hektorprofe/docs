title: Widget Frame (Marco) | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Widget Frame (Marco)

Los Frames **son marcos** contenedores de otros widgets. Pueden tener tamaño propio y posicionarse en distintos lugares de otro contenedor (ya sea la raíz u otro marco):

!!! info "" 

    ```python
	from tkinter import *
    root = Tk()

    # Hijo de root, no ocurre nada
	frame = Frame(root)  

    # Empaqueta el frame en la raíz
	frame.pack()      

    # Como no tenemos ningún elemento dentro del frame, 
    # no tiene tamaño y aparece ocupando lo mínimo posible, 0*0 px

    # Color de fondo, background
	frame.config(bg="lightblue")     

    # Podemos establecer un tamaño,
    # la raíz se adapta al frame que contiene
	frame.config(width=480,height=320) 

	root.mainloop()       
    ```

También podemos añadir la configuración al crear el frame:

!!! info "" 

    ```python
	Frame(root, width=480,height=320) 
    ```

Algo interesante de los frames es que permiten parámetros visuales utilizando atributos estándar:

!!! info "" 

    ```python
    frame.config(cursor="")         # Tipo de cursor
    frame.config(relief="sunken")   # relieve del frame hundido
    frame.config(bd=25)	            # tamaño del borde en píxeles
    ```

Pero esto no es algo único de los Frames, todos los widgets aceptan estos parámetros visuales, incluso la raíz:

!!! info "" 

    ```python
    root.config(bg="blue")   		# color de fondo, background
    root.config(cursor="pirate")    # tipo de cursor (arrow defecto)
    root.config(relief="sunken")    # relieve del root 
    root.config(bd=25)		        # tamaño del borde en píxeles
    ```

De esta forma podéis apreciar como se diferencia claramente el espacio de la raíz y el frame. 

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/03.png"/></div>

Sin embargo, fijaros que curiosamente si hacemos la ventana grande, el frame se encuentra centrado arriba al medio, eso es porque el método pack alinea el widget arriba al medio.Esta posición se conoce como la distribución del Widget y podemos cambiarla de dos formas posibles justo al empacar el frame. Con alineación [arriba, abajo, izquierda, derecha] o con anclaje [N,S,E,W,NE…]:

!!! info "" 

    ```python
	frame.pack(side=RIGHT)   # a la derecha al medio
	frame.pack(anchor=SE)    # sudeste, abajo a la derecha
    ```
    
<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/04.png"/></div>

Y no sólo eso, también podemos redimensionar un widget:

!!! info "" 

    ```python
	frame.pack(fill="x") 			    # ancho como el padre
	frame.pack(fill="y") 			    # alto como el padre
	frame.pack(fill="both")   			# ambas opciones
	frame.pack(fill="both", expand=1)   # expandirse para ocupar el espacio
    ```

Código final:

!!! info "" 

    ```python
    from tkinter import *

    # Configuración de la raíz
    root = Tk()
    root.title("Hola mundo")
    root.resizable(1,1)
    root.iconbitmap('hola.ico')

    frame = Frame(root, width=480, height=320)
    frame.pack(fill='both', expand=1)
    frame.config(cursor="pirate")
    frame.config(bg="lightblue")
    frame.config(bd=25)
    frame.config(relief="sunken")

    root.config(cursor="arrow")
    root.config(bg="blue")
    root.config(bd=15)
    root.config(relief="ridge")

    # Finalmente bucle de la aplicación
    root.mainloop()
    ```

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>