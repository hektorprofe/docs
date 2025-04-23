title: Editor de texto | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Editor de texto

Para acabar la unidad he pensado en crear un pequeño editor de texto, será una forma de trabajar en conjunto varios de los widgets que hemos ido aprendiendo. 

Lo primero es tener claro el diseño del programa que vamos a crear. A parte del menú superior para gestionar las funcionalidades, nos viene como anillo al dedo un widget Text para manejar todo el contenido, así que vamos a comenzar por crear esta estructura:

!!! info "" 
    ```python
    from tkinter import *
    root = Tk()
	root.title("Mi editor")

	# Menú superior
	menubar = Menu(root)
	filemenu = Menu(menubar, tearoff=0)
	filemenu.add_command(label="Nuevo")
	filemenu.add_command(label="Abrir")
	filemenu.add_command(label="Guardar")
	filemenu.add_command(label="Guardar como")
	filemenu.add_separator()
	filemenu.add_command(label="Salir", command=root.quit)
	menubar.add_cascade(label="Archivo", menu=filemenu)

	# Caja de texto central
	texto = Text(root)
	texto.pack(fill='both', expand=1)
	texto.config(padx=6, pady=4, bd=0, font=("Consolas", 12))

	# Menu y bucle de la aplicación
	root.config(menu=menubar)
	root.mainloop()
    ```

También he pensado, que de cara a abrir y guardar ficheros estaría bien mostrar un poco de información en la parte inferior. Podemos por ejemplo añadir una label abajo a la izquierda:

!!! info "" 
    ```python
	# Monitor inferior
	mensaje = StringVar()
	mensaje.set('Bienvenido a tu editor')
	monitor = Label(root, textvar=mensaje, justify='right')
	monitor.pack(side='left')
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/31.png"/></div>

Muy bien, ya tenemos el diseño base. Ahora toca la lógica. Vamos a identificar bien todas las funciones que tendrá nuestro editor de texto, y podemos mostrar un mensaje utilizando nuestro monitor:

!!! info "" 
    ```python
    def nuevo():
        mensaje.set('Nuevo fichero')

    def abrir(): 
        mensaje.set('Nuevo fichero')

    def guardar():
        mensaje.set('Guardar fichero')

    def guardar_como():
        print("Guardar fichero como")
    ```

Ahora ya podemos dejarlas enlazadas:

!!! info "" 
    ```python
    filemenu.add_command(label="Nuevo", command=nuevo)
	filemenu.add_command(label="Abrir", command=abrir)
	filemenu.add_command(label="Guardar", command=guardar)
	filemenu.add_command(label="Guardar como", command=guardar_como)
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/32.png"/></div>

Perfecto, ahora nos falta implementar la lógica de las funciones.

## Nuevo fichero

Antes de nada vamos a crear una variable global ruta, fuera del ámbito de las funciones.

!!! info "" 
    ```python
    ruta = ''  # La utilizaremos para almacenar información
    ```

Comenzando por un nuevo fichero, lo que este comando hará es simplemente borrar el contenido del Texto dejándolo vacío, y reiniciar cualquier posible configuración:

!!! info "" 
    ```python
    def nuevo():
		mensaje.set('Nuevo fichero')
		texto.delete(1.0, END)  # En flotante, el primer carácter es un salto
    ```

## Abrir fichero

Ya sabemos que podemos utilizar una ventana emergente para pedirle al usuario que seleccione un fichero del disco duro, así que vamos a importar el módulo file dialog:

!!! info "" 
    ```python
    from tkinter import filedialog as FileDialog
    ```

Ahora tenemos que programar toda la lógica:

!!! info "" 
    ```python
    def abrir():

        # Indicamos que la ruta es respecto a la variable global
        # Debemos de forzar esta lectura global porque los comandos
        # sólo son conscientes de las variables externas que son widgets 
        global ruta 
               
        mensaje.set('Abrir fichero')

        ruta = FileDialog.askopenfilename(
            initialdir='.',
            filetypes=(  # Es una tupla con un elemento
                ("Ficheros de texto", "*.txt"),  
            ), 
            title="Abrir un fichero."
        )

        # Si la ruta es válida abrimos el contenido en lectura
        if ruta != "":  
            fichero = open(ruta, 'r')
            contenido = fichero.read()
            texto.delete(1.0, 'end')           # Nos aseguramos de que esté vacío
            texto.insert('insert', contenido)  # Le insertamos el contenido
            fichero.close()                    # Cerramos el fichero
            root.title(ruta + " - Mi editor")  # Cambiamos el título
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/33.png"/></div>

Muy bien, ya podemos abrir ficheros. Vamos a aprovechar y antes de continuar, importante que reiniciemos el título de ventana y la ruta si hacemos Nuevo. Si no lo hacemos, como mínimo la ruta, a la hora de guardar no podremos distinguir si un fichero es nuevo, o se ha abierto desde el disco duro:

!!! info "" 
    ```python
    def abrir():
        # Indicamos que la ruta es respecto a la variable global
        global ruta

        mensaje.set('Nuevo fichero')

        texto.delete(1.0, END)   # En flotante, el primer carácter es un salto
        root.title("Mi editor")  # Reiniciamos el título
        ruta = ""                # Reiniciamos la ruta
    ```

## Guardar fichero

A la hora de guardar un fichero tenemos dos opciones, o es un fichero ya existente, en ese caso en la ruta tendremos un valor, o será un fichero nuevo, una ruta vacía.

En el primer caso vamos a proceder a guardar normalmente el fichero como ya sabemos:

!!! info "" 
    ```python
    def guardar():
        global ruta
        if ruta != "":
            contenido = texto.get(1.0, 'end')  # Recuperamos el texto
            fichero = open(ruta, 'w+')         # Creamos el fichero o abrimos
            fichero.write(contenido)           # Escribimos el texto
            fichero.close()
            mensaje.set('Fichero guardado correctamente')
    ```

Si lo probamos veremos que todo se guarda correctamente. Pero si guardamos un fichero y lo volvemos a abrir, curiosamente se nos va añadiendo un salto de línea al final. Para solucionarlo, o le restamos ese último carácter manualmente antes de guardar, o bien le indicamos en el propio get que lo reste:

!!! info "" 
    ```python
    contenido = texto.get(1.0, 'end-1c')  # recuperamos el texto -1 char
    ```

Ahora nos falta la otra posibilidad, cuando el fichero es nuevo y tenemos que guardarlo en el disco con un nombre. Para este caso lo que vamos a hacer es llamar desde la función guardar la función guardar como, ya que ésta nos debería permitirhacer lo que necesitamos la primera vez eligiendo un nombre y un directorio:

!!! info "" 
    ```python
    else:
        guardar_como()
    ```

## Guardar fichero como

Ya sólo nos falta crear la última opción:

!!! info "" 
    ```python
    def guardar_como():
        global ruta
        fichero = FileDialog.asksaveasfile(title="Guardar fichero", mode='w',
                defaultextension=".txt")
        ruta = fichero.name  # El atributo name es la ruta, si está abierto
        if fichero is not None:
            contenido = texto.get(1.0, 'end-1c')  # recuperamos el texto
            fichero = open(ruta, 'w+') # creamos el fichero o abrimos
            fichero.write(contenido)  # escribimos el texto
            fichero.close()
            mensaje.set('Fichero guardado correctamente')
        else:
            mensaje.set('Guardado cancelado')
    ```

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/34.png"/></div>

Código final:

!!! info "" 
    ```python
    from tkinter import *
    from tkinter import filedialog as FileDialog
    from io import open

    ruta = "" # La utilizaremos para almacenar la ruta del fichero

    def nuevo():
        global ruta
        mensaje.set("Nuevo fichero")
        ruta = ""
        texto.delete(1.0, "end")
        root.title("Mi editor")

    def abrir():
        global ruta
        mensaje.set("Abrir fichero")
        ruta = FileDialog.askopenfilename(
            initialdir='.', 
            filetypes=(("Ficheros de texto", "*.txt"),),
            title="Abrir un fichero de texto")

        if ruta != "":
            fichero = open(ruta, 'r')
            contenido = fichero.read()
            texto.delete(1.0,'end')
            texto.insert('insert', contenido)
            fichero.close()
            root.title(ruta + " - Mi editor")

    def guardar():
        mensaje.set("Guardar fichero")
        if ruta != "":
            contenido = texto.get(1.0,'end-1c')
            fichero = open(ruta, 'w+')
            fichero.write(contenido)
            fichero.close()
            mensaje.set("Fichero guardado correctamente")
        else:
            guardar_como()

    def guardar_como():
        global ruta
        mensaje.set("Guardar fichero como")

        fichero = FileDialog.asksaveasfile(title="Guardar fichero", 
            mode="w", defaultextension=".txt")

        if fichero is not None:
            ruta = fichero.name
            contenido = texto.get(1.0,'end-1c')
            fichero = open(ruta, 'w+')
            fichero.write(contenido)
            fichero.close()
            mensaje.set("Fichero guardado correctamente")
        else:
            mensaje.set("Guardado cancelado")
            ruta = ""


    # Configuración de la raíz
    root = Tk()
    root.title("Mi editor")

    # Menú superior
    menubar = Menu(root)
    filemenu = Menu(menubar, tearoff=0)
    filemenu.add_command(label="Nuevo", command=nuevo)
    filemenu.add_command(label="Abrir", command=abrir)
    filemenu.add_command(label="Guardar", command=guardar)
    filemenu.add_command(label="Guardar como", command=guardar_como)
    filemenu.add_separator()
    filemenu.add_command(label="Salir", command=root.quit)
    menubar.add_cascade(menu=filemenu, label="Archivo")

    # Caja de texto central
    texto = Text(root)
    texto.pack(fill="both", expand=1)
    texto.config(bd=0, padx=6, pady=4, font=("Consolas",12))

    # Monitor inferior
    mensaje = StringVar()
    mensaje.set("Bienvenido a tu Editor")
    monitor = Label(root, textvar=mensaje, justify='left')
    monitor.pack(side="left")

    root.config(menu=menubar)
    # Finalmente bucle de la apliación
    root.mainloop()
    ```

¡Y ya lo tenemos! Hemos creado nuestro propio bloc de notas en menos de 100 líneas de código.

Tened en cuenta no deja de ser una introducción. Hay más widgets y muchos parámetros que no hemos visto. La clave como siempre es practicar y documentarse mucho por Internet, viendo ejemplos, en Youtube y sobretodo experimentando por vuestra cuenta.

!!! tip "Documentación de Tkinter"
    En la web [http://effbot.org/tkinterbook/tkinter-index.htm](http://effbot.org/tkinterbook/tkinter-index.htm) encontraréis muchísimo contenido y ejemplos de Tkinter.

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>