title: Widget Checkbutton (Seleccionable) | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Widget Checkbutton (Seleccionable)

Con los radiobutton vimos que el usuario puede marcar una opción de entre varias, pero si queremos simplemente proponer una única opción es mejor utilizar un botón de selección. Son bastante parecidos. Vamos a crear un par de checkbuttons para por ejemplo, pedir a un usuario como quiere que le sirvan un café, él tendrá que marcar si quiere leche, y también si quiere azúcar:

!!! info "" 

    ```python
    from tkinter import *

    root = Tk()
    root.config(bd=15)

    leche = IntVar()      # 1 si, 0 no
    azucar = IntVar()    # 1 si, 0 no

    Label(root,text="¿Cómo quieres el café?").pack()
    Checkbutton(root, text="Con leche", variable=leche, 
                onvalue=1, offvalue=0).pack()
    Checkbutton(root, text="Con azúcar",variable=leche, 
                onvalue=1, offvalue=0).pack()

    root.mainloop()
    ```

Aprovechando que tenemos una imagen, y para practicar un poco la distribución, podríamos mejorar un poco la presentación del formulario:

!!! info "" 

    ```python
    from tkinter import *

    root = Tk()
    root.config(bd=15)

    leche = IntVar()
    azucar = IntVar()

    imagen = PhotoImage(file="imagen.gif")
    Label(root, image=imagen).pack(side=LEFT)

    frame = Frame(root).pack(side=RIGHT)
    Label(frame, text="¿Cómo quieres el café?\n").pack(anchor=W)
    Checkbutton(frame, text="Con leche", variable=leche, 
                onvalue=1, offvalue=0).pack(anchor=W)
    Checkbutton(frame, text="Con azúcar", variable=leche, 
                onvalue=1, offvalue=0).pack(anchor=W)

    root.mainloop()
    ```

Bien, entonces ¿cómo podemos recuperar los valores de nuestros botones de selección? Podríamos crear una función y añadir un comando a los checkbutton para mostrar el resumen de nuestro café en una label:

!!! info "" 

    ```python
    def selec():
        cadena = ""

        if (leche.get()): cadena += "Con leche"
        else: cadena += "Sin leche"

        if (azucar.get()): cadena += " y con azúcar"
        else: cadena += " y sin azúcar"

        monitor.config(text=cadena)

    ...

    monitor = Label(frame)
    monitor.pack()
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/15.png"/></div>

Código final:

!!! info "" 

    ```python
    from tkinter import *

    def seleccionar():
        cadena = ""
        if (leche.get()):
            cadena += "Con leche"
        else:
            cadena += "Sin leche"

        if (azucar.get()):
            cadena += " y con azúcar"
        else:
            cadena += " y sin azúcar"

        monitor.config(text=cadena)

    # Configuración de la raíz
    root = Tk()
    root.title("Cafetería")
    root.config(bd=15)

    leche = IntVar() 	# 1 si, 0 no
    azucar = IntVar()	# 1 si, 0 no

    imagen = PhotoImage(file="imagen.gif")
    Label(root, image=imagen).pack(side="left")

    frame = Frame(root)
    frame.pack(side="left")

    Label(frame, text="¿Cómo quieres el café?").pack(anchor="w")
    Checkbutton(frame, text="Con leche", variable=leche, onvalue=1, 
                offvalue=0, command=seleccionar).pack(anchor="w")
    Checkbutton(frame, text="Con azúcar", variable=azucar, onvalue=1, 
                offvalue=0, command=seleccionar).pack(anchor="w")

    monitor = Label(frame)
    monitor.pack()

    # Finalmente bucle de la aplicación
    root.mainloop()
    ```

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>