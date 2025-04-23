title: Widget Label (Etiqueta de texto) | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Widget Label (Etiqueta de texto)

En esta lección vamos a trabajar el widget label utilizado para mostrar textos. Suele ser texto estático, de ahí que se llame label o **etiqueta** de texto. 

!!! info "" 

    ```python
    from tkinter import *
    root = Tk()
    
    label = Label(frame,text="¡Hola Mundo!")
    label.pack()
                        
    root.mainloop() 
    ```

También se puede añadir directamente a la raíz y empaquetarla:

!!! info "" 

    ```python
    Label(root, text="¡Hola Mundo!").pack() 
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/05.png"/></div>

Vamos a crear más etiquetas:

!!! info "" 
    ```python
    from tkinter import *
    root = Tk()
    Label(root, text="¡Hola Mundo!").pack()
    Label(root, text="¡Otra etiqueta!").pack()
    Label(root, text="¡Última etiqueta!").pack()
    root.mainloop() 
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/06.png"/></div>

Como véis las tres etiquetas se muestran una encima de otra porque al hacer pack() por defecto se posicionan así, pero podemos cambiar su distribución:

!!! info "" 
    ```python
    Label(root, text="¡Hola Mundo!").pack(anchor=NW)
    Label(root, text="¡Otra etiqueta!").pack(anchor=CENTER)
    Label(root, text="¡Última etiqueta!").pack(anchor=SE)
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/07.png"/></div>

Evidentemente también tienen distintos parámetros visuales, para cambiar el color en primer plano, el del fondo, la fuente y su tamaño...:

!!! info "" 
    ```python
    label = Label(root, text="¡Otra etiqueta!")
    label.pack(anchor=CENTER)
    label.config(fg="blue",    # Foreground
                 bg="green",   # Background
                 font=("Verdana",24)) 
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/08.png"/></div>

Pero una de las cosas más interesantes que nos permiten hacer es cambiar el texto sobre la marcha utilizando un objeto llamado StringVar() y su propiedad textvariable:

!!! info "" 
    ```python
	texto = StringVar()
	texto.set("Un nuevo texto")
	label.config(textvariable=texto)  # añadimos una variable de texto
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/09.png"/></div>

Quizá ahora no parece muy útil, pero más adelante veremos cómo capturar el momento en que apretamos un botón y entonces cambiaremos el texto de una etiqueta.

Por cierto, algo que os va a gustar es que las etiquetas pueden contener imágenes, lo malo es que tkinter sólo acepta dos formatos de imagen a través de la clase PhotoImage: pgm y gif. 

!!! info "" 
    ```python
	imagen = PhotoImage(file="imagen.gif")
	Label(root, image=imagen, bd=0).pack()
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/10.png"/></div>

Si quisiéramos trabajar con otros formatos de imágen deberíamos utilizar un módulo externo como PIL, pero eso me lo reservo por si más adelante os interesa profundizar en el mundo de las interfaces.

Código final:

!!! info "" 

    ```python
    from tkinter import *

    # Configuración de la raíz
    root = Tk()

    """
    # Variables dinámicas
    texto = StringVar()
    texto.set("Un nuevo texto")

    Label(root, text="¡Hola mundo!").pack(anchor="nw")
    label = Label(root, text="¡Otra etiqueta!")
    label.pack(anchor="center")
    Label(root, text="¡Última etiqueta!").pack(anchor="se")

    label.config(bg="green", fg="blue", font=("Verdana",24))
    label.config(textvariable=texto)
    """

    imagen = PhotoImage(file="imagen.gif")
    Label(root, image=imagen, bd=0).pack(side="left")

    # Finalmente bucle de la aplicación
    root.mainloop()
    ```

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>