// practica805.cpp
// Adivinar un numero secreto (7). El ciclo se repite hasta que
// el usuario acierte.
#include <iostream>
using namespace std;

int main() {
    int intento, secreto = 7;

    do {
        cout << "Adivine el numero secreto (entre 1 y 10): ";
        cin >> intento;
        if (intento != secreto) {
            cout << "Incorrecto. Sigue intentando!" << endl;
        }
    } while (intento != secreto);

    cout << "Felicidades! Adivinaste el numero secreto." << endl;
    return 0;
}
