title: Widget Entry (Texto corto) | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Widget Entry (Texto corto)

Los **campos de texto** sirven generalmente para que el usuario escriba un valor. Sería un puente que equivaldría a la función input() pero gráficamente. Lo bueno es que integra muchos métodos que le permiten desde borrar el texto a desactivar el campo.

!!! info "" 

    ```python
    from tkinter import *
    root = Tk()

    entry = Entry(root)
    entry.pack()

    root.mainloop()
    ```

Podemos añadir una label a la izquierda para indicar información sobre el campo:

!!! info "" 

    ```python 
	entry = Entry(root)
	entry.pack(side=RIGHT)

	label = Label(root, text="Nombre")
	label .pack(side=LEFT)
    ```

Lo malo es que si intentamos crear más etiquetas y campos, esto se posicionan mal:

!!! info "" 

    ```python 
    entry2 = Entry(root)
	entry2.pack(side=RIGHT)

	label2 = Label(root, text="Apellidos")
	label2 .pack(side=LEFT)
    ```

Como sabemos Pack() intenta posicionar automáticamente los elementos y alinearlos con los parámetros side y anchor, pero en este caso no hay una distribución más allá de la alineación, por éso se ve mal.

Para solucionarlo se puede hacer de distintas formas. Por ejemplo creando dos marcos, y añadir una etiqueta y un campo de texto en cada una. De esta forma el marco hará de separador:

!!! info "" 

    ```python 
    frame1 = Frame(root)
    frame1.pack()

    entry = Entry(frame1)
    entry.pack(side=RIGHT)

    label = Label(frame1, text="Nombre")
    label.pack(side=LEFT)

    frame2 = Frame(root)
    frame2.pack()

    entry2 = Entry(frame2)
    entry2.pack(side=RIGHT)

    label2 = Label(frame2, text="Apellidos")
    label2.pack(side=LEFT)
    ```

Sin embargo fijaros como las labels no parecen estar alineadas bien. Claro, éso es porque el texto de Nombre y el de Apellidos no ocupa lo mismo. Podemos hacer un truco rápido añadiendo un par de espacios en Nombre:

!!! info "" 

    ```python 
    label = Label(frame1, text="Nombre ")
    ```

Pero aún no acaba de salir bien. ¿Entonces cómo podemos posicionar bien estos widgets? La respuesta es utilizando una disposición cuadrícula, otra de las formas de tkinter para distribuir automáticamente los widgets.

Para hacerlo, en lugar del pack() utilizaremos grid() e indicaremos una fila y una columna para cada widget (borramos los frames):

!!! info "" 

    ```python 
    label = Label(root, text="Nombre")
    label.grid(row=0,column=0)

    entry = Entry(root)
    entry.grid(row=0,column=1)

    label2 = Label(root, text="Apellidos")
    label2.grid(row=1,column=0)

    entry2 = Entry(root)
    entry2.grid(row=1,column=1)
    ```

De esta forma no importa cuán larga sea una label, todo se posicionará siguiente la cuadrícula y cada widget quedará perfectamente separado de los otros. Quizá el problema que tenemos es que no tenemos las etiquetas justificadas al mismo lado y queda un poco raro. Aquí es donde entra el parámetro sticky (pegado) de grid():

!!! info "" 

    ```python
    label = Label(root, text="Nombre")
    label.grid(row=0,column=0, sticky=W)

    entry = Entry(root)
    entry.grid(row=0,column=1)

    label2 = Label(root, text="Apellidos")
    label2.grid(row=1,column=0, sticky=W)

    entry2 = Entry(root)
    entry2.grid(row=1,column=1)
    ```

Incluso podríamos acabar de afinar la separación indicando un padding en la grid, aunque este parámetro está en todos los widgets:

!!! info "" 

    ```python
    label = Label(root, text="Nombre")
    label.grid(row=0,column=0, sticky=W, padx=5, pady=5)

    entry = Entry(root)
    entry.grid(row=0,column=1, padx=5, pady=5)

    label2 = Label(root, text="Apellidos")
    label2.grid(row=1,column=0, sticky=W, padx=5, pady=5)

    entry2 = Entry(root)
    entry2.grid(row=1,column=1, padx=5, pady=5)
    ```

Como véis estoy introduciendo conceptos poco a poco para no saturaros demasiado. Para acabar esta lección os enseñaré algunos parámetros más de los campos de texto, a parte de los de colorear o cambiar la fuente que ya conocemos:

!!! info "" 

    ```python
	justify=LEFT, CENTER, RIGHT   # justificar el texto
	state=DISABLED, NORMAL	      # desactivar el campo
	show="*"			          # para contraseñas mostrar * o lo que sea
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/11.png"/></div>

Código final:

!!! info "" 

    ```python
    from tkinter import *

    # Configuración de la raíz
    root = Tk()

    label = Label(root, text="Nombre muy largo")
    label.grid(row=0, column=0, sticky="w", padx=5, pady=5)

    entry = Entry(root)
    entry.grid(row=0, column=1, padx=5, pady=5)
    entry.config(justify="right", state="normal")

    label2 = Label(root, text="Contraseña")
    label2.grid(row=1, column=0, sticky="w", padx=5, pady=5)

    entry2 = Entry(root)
    entry2.grid(row=1, column=1, padx=5, pady=5)
    entry2.config(justify="center", show="?")

    # Finalmente bucle de la aplicación
    root.mainloop()
    ```

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>