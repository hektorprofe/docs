title: Unittest | Curso de Python | Hektor Profe
description: En esta sección repasamos los módulos Docstring, Pydoc, Doctest y Unittest de Python.

# Unittest

El módulo **unittest**, a veces referido como **PyUnit**, forma parte de una serie de frameworks conocidos como *xUnit*. Estas librerías se encuentran en la mayoría de lenguajes y son casi un estándard a la hora de programar pruebas unitarias.

A diferencia de **doctest**, **unittest** ofrece la posibilidad de crear las pruebas en el propio código implementando una clase llamada **unittest.TestCase** en la que se incluirá un *kit o batería de pruebas*. 
Cada una de las pruebas puede devolver tres respuestas en función del resultado:

* **OK**: Para indicar que la prueba se ha pasado éxitosamente.
* **FAIL**: Para indicar que la prueba no ha pasado éxitosamente lanzaremos una excepción AssertionError (sentencia verdadero-falso)
* **ERROR**: Para indicar que la prueba no ha pasado éxitosamente, pero el resultado en lugar de ser una aserción es otro error.

Vamos a crear una prueba unitaria muy sencilla para ver su funcionamiento en un script **tests.py**:

!!! info "" 
    ```python
    import unittest

    class Pruebas(unittest.TestCase):
        def test(self):
            pass

    if __name__ == "__main__":
        unittest.main()
    ```

En este sencillo ejemplo podemos observar como heredamos de la clase **unittest.TestCase** para crear una batería de pruebas.

Cada método dentro de esta clase será una prueba, que en nuestro ejemplo no lanza ninguna excepción ni error, porlo que significa que los tests pasarán correctamente, y finalmente ejecutamos el método main() para ejecutar todas las baterías:

!!! info "" 
    ```
    ----------------------------------------------------------------------
    Ran 1 test in 0.000s
    OK
    ``` 

Como vemos se ha 1 realizado 1 test y el resultado a sido OK. Pero si en lugar de pasar, invocamos una execepción AssertError...

!!! info "" 
    ```python
    import unittest

    class Pruebas(unittest.TestCase):
        def test(self):
            raise AssertionError()

    if __name__ == "__main__":
        unittest.main()
    ```

El rest fallaría devolviendo una F:

!!! info "" 
    ```
    F
    ======================================================================
    FAIL: test (__main__.Pruebas)
    ----------------------------------------------------------------------
    Traceback (most recent call last):
    File "C:\Users\Hector\Desktop\test.py", line 5, in test
        raise AssertionError()
    AssertionError
    ----------------------------------------------------------------------
    Ran 1 test in 0.000s
    FAILED (failures=1)
    ```

En el supuesto caso que dentro del test diera un error no asertivo, tendríamos un Error:

!!! info "" 
    ```python
    import unittest

    class Pruebas(unittest.TestCase):
        def test(self):
            1/0

    if __name__ == "__main__":
        unittest.main()
    ```

Fallaría pero devolviendo una E:

!!! info "" 
    ```
    E
    ======================================================================
    ERROR: test (__main__.Pruebas)
    ----------------------------------------------------------------------
    Traceback (most recent call last):
    File "C:\Users\Hector\Desktop\test.py", line 5, in test
        1/0
    ZeroDivisionError: division by zero
    ----------------------------------------------------------------------
    Ran 1 test in 0.001s
    FAILED (errors=1)
    ```

## Excepciones Asertivas

Con lo que sabemos podríamos crear tests complejos sirviéndonos de condiciones y excepciones *AssertionError*, pero la clase **TestCase** nos provee de un montón de alternativas. 

Vamos a hacer un repaso de las más comunes, recordad que siempre devolverán True o False dependiendo de si pasan o no el test:

<div style="text-align:center;margin-top:25px"><img src="{{cdn}}/images/errores.png"/></div>

Si os interesa profundizar os dejo el enlace oficial: [https://docs.python.org/3/library/unittest.html](https://docs.python.org/3/library/unittest.html)

Vamos a hacer algunos ejemplos para practicar.

## Funciones propias

!!! info "" 
    ```python
    import unittest

    def doblar(a): return a*2
    def sumar(a,b): return a+b  
    def es_par(a): return 1 if a%2 == 0 else 0

    class PruebasFunciones(unittest.TestCase):

        def test_doblar(self):
            self.assertEqual(doblar(10), 20)
            self.assertEqual(doblar('Ab'), 'AbAb')

        def test_sumar(self):
            self.assertEqual(sumar(-15, 15), 0)
            self.assertEqual(sumar('Ab' ,'cd'), 'Abcd')

        def test_es_par(self):
            self.assertEqual(es_par(11), False)
            self.assertEqual(es_par(68), True)


    if __name__ == '__main__':
        unittest.main()
    ```

Resultado: 

!!! info "" 
    ```
    ...
    ----------------------------------------------------------------------
    Ran 3 tests in 0.000s
    OK
    ```

## Ejemplo métodos de cadenas

!!! info "" 
    ```python
    import unittest

    class PruebasMetodosCadenas(unittest.TestCase):

        def test_upper(self):
            self.assertEqual('hola'.upper(), 'HOLA')

        def test_isupper(self):
            self.assertTrue('HOLA'.isupper())
            self.assertFalse('Hola'.isupper())

        def test_split(self):
            s = 'Hola mundo'
            self.assertEqual(s.split(), ['Hola', 'mundo'])


    if __name__ == '__main__':
        unittest.main()
    ```

Resultado: 

!!! info "" 
    ```
    ...
    ----------------------------------------------------------------------
    Ran 3 tests in 0.000s
    OK
    ```

## Preparación y limpieza

Lo último importante a comentar es que la clase **TestCase** incorpora dos métodos extras.

El primero es **setUp()** y sirve para preparar el contexto de las pruebas, por ejemplo para escribir unos valores de prueba en un fichero conectarse a un servidor o a una base de datos.

Luego tendríamos **tearDown()** para hacer lo propio con la limpieza, borrar el fichero, desconectarse del servidor o borrar las entradas de prueba de la base de datos.

Este proceso de preparar el contexto se conoce como ***test fixture*** o accesorios de prueba.

Sólo por poner un ejemplo supongamos que necesitamos contar con una lista de elementos para realizar una serie de pruebas:

!!! info "" 
    ```python
    import unittest

    def doblar(a): return a*2

    class PruebaTestFixture(unittest.TestCase):

        def setUp(self):
            print("Preparando el contexto")
            self.numeros = [1, 2, 3, 4, 5]

        def test(self):
            print("Realizando una prueba")
            r = [doblar(n) for n in self.numeros]
            self.assertEqual(r, [2, 4, 6, 8, 10])

        def tearDown(self):
            print("Destruyendo el contexto")
            del(self.numeros)


    if __name__ == '__main__':
        unittest.main() 
    ```

Resultado de la prueba:

!!! info "" 
    ```
    Preparando el contexto
    .
    Realizando una prueba
    Destruyendo el contexto
    ----------------------------------------------------------------------
    Ran 1 test in 0.000s
    OK
    ```
___
<small class="edited"><i>Última edición: 6 de Octubre de 2018</i></small>