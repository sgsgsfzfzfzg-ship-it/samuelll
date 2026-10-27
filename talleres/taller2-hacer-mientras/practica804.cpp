// practica804.cpp
// Validacion de rango: pedir una nota hasta que este entre 0.0 y 5.0.
// La nota es real (float), no entera, porque puede tener decimales.
// El ciclo se repite MIENTRAS la nota este FUERA del rango.
#include <iostream>
using namespace std;

int main() {
    float nota;

    do {
        cout << "Ingrese una nota entre 0.0 y 5.0: ";
        cin >> nota;
        if (nota < 0 || nota > 5) {
            cout << "Error: La nota debe estar entre 0.0 y 5.0" << endl;
        }
    } while (nota < 0 || nota > 5);

    cout << "Nota registrada con exito: " << nota << endl;
    return 0;
}
