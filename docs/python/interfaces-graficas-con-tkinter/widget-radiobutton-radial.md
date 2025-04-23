title: Widget Radiobutton (Radial) | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Widget Radiobutton (Radial)

Otro componente básico de los formularios son los **botones radiales**. Se utilizan cuando quieres ofrecerle al usuario la posibilidad de elegir una opción entre varias:

!!! info "" 

    ```python
    from tkinter import *

    def selec():
        monitor.config(text = "Opción {}".format(opcion.get() ) )
        
    root = Tk()
    root.config(bd=15)

    opcion = IntVar() # Como StrinVar pero en entero

    Radiobutton(root, text="Opción 1", variable=opcion, 
                value=1, command=selec).pack()
    Radiobutton(root, text="Opción 2", variable=opcion,
                value=2, command=selec).pack()
    Radiobutton(root, text="Opción 3", variable=opcion, 
                value=3, command=selec).pack()

    monitor = Label(root)
    monitor.pack()

    root.mainloop()
    ```

Si quisiéramos reiniciar el formulario podríamos añadir un botón y establecer los valores iniciales:

!!! info "" 

    ```python
    def reset():
        opcion.set(None)		  # Reiniciamos el seleccionable
        monitor.config(text='')	  # Reiniciamos la etiqueta

    Button(root, text="Reiniciar", command=reset).pack()
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/14.png"/></div>

Código final:

!!! info "" 

    ```python
    from tkinter import *

    def seleccionar():
        monitor.config(text="{}".format(opcion.get()))

    def reset():
        opcion.set(None)
        monitor.config(text="")

    # Configuración de la raíz
    root = Tk()

    opcion = IntVar()

    Radiobutton(root, text="Opción 1", variable=opcion, 
                value=1, command=seleccionar).pack()
    Radiobutton(root, text="Opción 2", variable=opcion, 
                value=2, command=seleccionar).pack()
    Radiobutton(root, text="Opción 3", variable=opcion,   
                value=3, command=seleccionar).pack()

    monitor = Label(root)
    monitor.pack()

    Button(root, text="Reiniciar", command=reset).pack()

    # Finalmente bucle de la aplicación
    root.mainloop()
    ```

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>