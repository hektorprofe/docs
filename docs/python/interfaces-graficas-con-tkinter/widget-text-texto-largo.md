title: Widget Text (Texto largo) | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Widget Text (Texto largo)

Por otro lado, si lo que necesitamos es trabajar con un campo de texto multilínea, podemos utilizar un Widget llamado Text:

!!! info "" 

    ```python
    from tkinter import *
    root = Tk()

    texto = Text(root)
    texto.pack()

    root.mainloop()
    ```
Como véis por defecto ocupa un espacio predefinido, pero podríamos establecer una altura y anchura en caracteres, no píxeles:

!!! info "" 

    ```python
	texto.config(width=30, height=10)
    ```

También acepta propiedades visuales para los colores o la fuente:

!!! info "" 

    ```python
	texto.config(font=("Consolas",12), selectbackground="red", padx=5, pady=5)
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/12.png"/></div>

Código final:

!!! info "" 

    ```python
    from tkinter import *

    # Configuración de la raíz
    root = Tk()

    texto = Text(root)
    texto.pack()
    texto.config(width=30, height=10, font=("Consolas",12), 
                 padx=15, pady=15, selectbackground="red")

    # Finalmente bucle de la aplicación
    root.mainloop()
    ```

Más adelante trabajaremos más a fondo este campo.

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>