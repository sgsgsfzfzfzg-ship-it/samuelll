// practica9209.cpp
// Imprime cada termino y la sumatoria de los primeros N terminos de
// la serie 1/2, 3/4, 5/8, 7/16, 9/32, ...
// El numerador aumenta de 2 en 2 y el denominador se duplica.
#include <iostream>
using namespace std;

int main() {
    double num = 1, den = 2, ter, sum = 0;
    int n, cont = 0;

    cout << "Cuantos terminos desea sumar? ";
    cin >> n;

    while (cont < n) {
        ter = num / den;
        sum = sum + ter;
        cout << "Termino " << cont + 1 << ": " << num << "/" << den
             << " = " << ter << endl;
        num = num + 2;
        den = den * 2;
        cont = cont + 1;
    }

    cout << "La sumatoria es: " << sum << endl;
    return 0;
}
