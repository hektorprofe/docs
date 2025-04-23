title: Widget Button (Botón) | Curso de Python | Hektor Profe
description: Las interfaces gráficas son medios visuales con los que nuestros usuarios pueden interactuar y realizar tareas gráficamente.

# Widget Button (Botón)

Los botones son posiblemente los componentes más utilizados en el diseño de interfaces gráficas. Yo he llegado a crear una interfaz que únicamente tenía un botón, suena raro, pero uno de mis clientes, ya hace tiempo quería un programa con un botón para ejecutar una tarea con una flecha de esas de carga debajo girando para saber que estaba "en marcha". Y véis que hay gente para todo. 

Pero bueno, nosotros a lo nuestro. A partir de esta unidad todo se pone más interesante, porque grcias a los botones vamos a añadir comportamientos dinámicos a nuestras interfaces.

Comenzando por lo esencial, vamos a crear un botón:

!!! info "" 

    ```python
    # Podemos crearlos y empacarlos en una línea
    Button(root, text="Clícame").pack() 
    ```

Sin más complicación aquí tenemos un botón, ¿pero la gracia es que haga algo no? Pues vamos a añadirle comportamiento. Para hacerlo tenemos que crear un parámetro command que ejecutará un código cuando apretemos el botón. Este código se lo pasaremos en forma de función. Si tenemos la ventana de comandos con la extensión .py podríamos hacer lo siguiente:

!!! info "" 

    ```python
    from tkinter import *

    # Definimos una función a ejecutar al clic el botón
    def hola():
        print("Hola mundo!")

    root = Tk()

    # Enlezamos la función a la acción del botón
    Button(root, text="Clícame", command=hola).pack()

    root.mainloop() 
    ```

La verdad es que podemos realizar mil cosas jugando con los botones y otros widgets, vamos a crear una interfaz para realizar una suma a partir de dos campos y un tercero no editable para el resultado:

!!! info "" 

    ```python
    from tkinter import *

    # Funciones backend
    def borrar():
        n1.set('')
        n2.set('')

    def sumar():
        r.set( float( n1.get() ) + float(n2.get() ) )
        borrar()

    # Estructura del formulario
    root = Tk()
    root.config(bd=15)  # borde exterior de 15 píxeles, queda mejor

    # Tres StringVar para manejar los números y el resultado
    n1 = StringVar()
    n2 = StringVar()
    r = StringVar()

    Label(root, text="Numero 1").pack()
    Entry(root, justify=CENTER, textvariable=n1).pack()

    Label(root, text="\nNumero 2").pack()
    Entry(root, justify=CENTER, textvariable=n2).pack()

    Label(root, text="\nResultado").pack()
    Entry(root, justify=CENTER, state=DISABLED, textvariable=r).pack()

    Label(root).pack() # Separador

    Button(root, text="Sumar", command=sumar).pack()

    root.mainloop()
    ```

Como véis ya podemos hacer cosas bastante interesantes. Lo mejor de todo es que fácilmente podríamos extender el formulario para realizar más operaciones:

!!! info "" 

    ```python
    def restar():
        r.set( float( n1.get() ) - float(n2.get() ) )
        borrar()

    def multiplicar():
        r.set( float( n1.get() ) * float(n2.get() ) )
        borrar()

    Button(root, text="Sumar", command=sumar).pack(side=LEFT)
    Button(root, text="Restar", command=restar).pack(side=LEFT)
    Button(root, text="Multiplicar", command=multiplicar).pack(side=LEFT)
    ```

Y así de la nada hemos creado una calculadora, ¿qué os parece?:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/tkinter/13.png"/></div>

Código final:

!!! info "" 

    ```python
    from tkinter import *

    def sumar():
        r.set( float(n1.get()) + float(n2.get()) )
        borrar()

    def resta():
        r.set( float(n1.get()) - float(n2.get()) )
        borrar()

    def producto():
        r.set( float(n1.get()) * float(n2.get()) )
        borrar()

    def borrar():
        n1.set("")
        n2.set("")

    # Configuración de la raíz
    root = Tk()
    root.config(bd=15)

    n1 = StringVar()
    n2 = StringVar()
    r = StringVar()

    Label(root, text="Número 1").pack()
    Entry(root, justify="center", textvariable=n1).pack()

    Label(root, text="Número 2").pack()
    Entry(root, justify="center", textvariable=n2).pack()

    Label(root, text="Resultado").pack()
    Entry(root, justify="center", textvariable=r, state="disabled").pack()

    Label(root, text="").pack()  # Separador

    Button(root, text="Sumar", command=sumar).pack(side="left")
    Button(root, text="Resta", command=resta).pack(side="left")
    Button(root, text="Producto", command=producto).pack(side="left")

    # Finalmente bucle de la aplicación
    root.mainloop()
    ```

___
<small class="edited"><i>Última edición: 4 de Octubre de 2018</i></small>