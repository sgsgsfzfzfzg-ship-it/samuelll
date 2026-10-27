// practica301.cpp
// Lee dos numeros y calcula la sumatoria de los numeros contenidos
// entre ellos (incluyendo los extremos). Funciona aunque el primero
// sea mayor que el segundo.
#include <iostream>
using namespace std;

int main() {
    int a, b, menor, mayor, suma = 0;

    cout << "Ingrese el primer numero: ";
    cin >> a;
    cout << "Ingrese el segundo numero: ";
    cin >> b;

    if (a < b) {
        menor = a;
        mayor = b;
    } else {
        menor = b;
        mayor = a;
    }

    for (int i = menor; i <= mayor; i++) {
        suma = suma + i;
    }

    cout << "La sumatoria de los numeros entre " << menor << " y "
         << mayor << " es: " << suma << endl;
    return 0;
}
