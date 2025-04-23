title: Dialogs (Diálogos) | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Dialogs (Diálogos)

!!! bug "Bug en Mac OS 10.13 o superior"
    Debido a incompatibilidades de la librería tk de Anaconda, los iconos de los diálogos no se muestran correctamente.

Las ventanas emergentes, cuadros de diálogo o simplemente Pop Ups,  sirven para mostrar o pedir información rápida al usuario. Reciben ese nombre porque no forma parte de la ventana principal, sinó que aparecen de golpe encima.

La ventana emergente por excelencia es la MessageBox, que sirve para mostrar un icono y un mensaje, pero tiene algunas variantes. Desde la clásico ventana con la opción de aceptar, la de alerta para informar de excepciones o errores, y las de aceptar o rechazar algo. 

Vamos a echar un vistazo a todas ellas.


## ShowInfo

Sirve para mostrar un diálogo de más información:

!!! info "" 
    ```python
    from tkinter import *
    from tkinter import messagebox as MessageBox

    def test():
        MessageBox.showinfo("Hola!", "Hola mundo") # título, mensaje

    root = Tk()

    Button(root, text = "Clícame", command=test).pack()

    root.mainloop()
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/20.png" width="171" height="164"/></div>

## ShowWarning

Sirve para mostrar un diálogo con un mensaje de alerta:

!!! info "" 
    ```python
    MessageBox.showwarning("Alerta", 
        "Sección sólo para administradores.")
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/21.png" width="288" height="165"/></div>

## ShowError

Sirve para mostrar un diálogo con un mensaje de error:

!!! info "" 
    ```python
    MessageBox.showerror("Error", 
        "Ha ocurrido un error inesperado.")
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/22.png" width="277" height="168"/></div>

## AskQuestion

Sirve para mostrar un diálogo con una pregunta de Sí/No al usuario:

!!! info "" 
    ```python
    resultado = MessageBox.askquestion("Salir", 
        "¿Está seguro que desea salir sin guardar?")

    if resultado == "yes":
        root.destroy()  # Destruir, alternativa a quit
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/23.png" width="325" height="165"/></div>

## AskOkCancel

Sirve para mostrar un diálogo con una pregunta de Ok/Cancelar al usuario:

!!! info "" 
    ```python
    resultado = MessageBox.askokcancel("Salir", 
        "¿Sobreescribir fichero actual?")

	if resultado == True:
		# Hacer algo
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/24.png" width="259" height="165"/></div>

## AskRetryCancel

Sirve para mostrar un diálogo con una pregunta de Reintenar/Cancelar al usuario:

!!! info "" 
    ```python
    resultado = MessageBox.askretrycancel("Reintentar",
        "No se puede conectar")

	if resultado == True:
		# Hacer algo
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/26.png" width="238" height="163"/></div>

## AskColor

Imaginad que queréis crear una aplicación y necesitáis que el usuario seleccione un color. Pues para este caso tenemos una clase llamada **colorchooser**:

!!! info "" 
    ```python
    from tkinter import colorchooser as ColorChooser
    
    def test():
        color = ColorChooser.askcolor(title="Elige un color")
        print(color)
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/27.png" width="448"/></div>

Como véis nos muestra el cuadro de diálogo del sistema operativo y como resultado conseguimos una cómoda tupla con el color en dos formatos, RGB y Hexadecimal. En caso de no seleccionar ningún color la tupla tendrá dos valores nulos None por defecto.

## AskOpenFile

Y por último, un vistazo a la clase FileDialog, que nos permite realizar varias tareas como conseguir la ruta de un fichero para poder abrirlo, o para guardarlo:

!!! info "" 
    ```python
    from tkinter import filedialog as FileDialog

    def test():
        fichero = FileDialog.askopenfilename(title="Abrir un fichero")
        print(fichero)
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/28.png" width="946"/></div>

Como véis nos abre el cuadro de diálogo para gestionar ficheros en modo Abrir y nos devuelve la ruta. Y si no elegimos un fichero, se devuelve un valor vacío.

Sin embargo lo más interesante es que también podemos establecer otras opciones, por ejemplo un  directorio inicial y un filtro de extensiones. Pero debéis tener cuidado con el directorio, ya que no todos los sistemas operativos utilizan el mismo tipo de rutas:

!!! info "" 
    ```python
    file = FileDialog.askopenfilename(
        initialdir="C:", 
        filetypes=(
            ("Ficheros de texto", "*.txt"),
            ("Todos los ficheros","*.*")
        ), 
        title = "Abrir un fichero."
    )
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/29.png" width="821"/></div>

## AskSaveAsFile

Por contra, también podemos hacer lo mismo para buscar un directorio donde guardar un fichero. Aunque la lógica tras de ésto ya es más compleja, el proceso es muy similar:

!!! info "" 
    ```python
    def test():
        ruta = FileDialog.asksaveasfile(title="Guardar un fichero")
        print(fichero )
    ```

Este proceso equivaldría a abrir un fichero de texto plano con open(ruta,'w'), así que cuidado si abrís un fichero ya existente porque lo dejaréis sin nada, es decir, inservible. 

En cuanto a los parámetros que podemos enviar tenemos por ejemplo para establecer un modo (por si queréis escribir en append o en binario) y una extensión por defecto:

!!! info "" 
    ```python
	def test():
		fichero = FileDialog.asksaveasfile(
            title="Guardar un fichero", mode='w', defaultextension=".txt")

		if fichero is not None:
			fichero.write("Hola!")
			fichero.close()
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/30.png" width="567"/></div>

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>