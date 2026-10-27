// practica803.cpp
// Sumadora: acumula los numeros ingresados hasta que se ingrese un 0.
#include <iostream>
using namespace std;

int main() {
    double num, suma = 0;

    do {
        cout << "Ingrese un numero (0 para terminar): ";
        cin >> num;
        suma = suma + num;
    } while (num != 0);

    cout << "La suma total es: " << suma << endl;
    return 0;
}
