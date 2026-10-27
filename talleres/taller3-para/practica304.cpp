// practica304.cpp
// Imprime los primeros 200 terminos de la serie de Fibonacci:
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
// Cada termino es la suma de los dos anteriores.
//
// A partir del termino 94 los numeros no caben ni en un
// unsigned long long, asi que se guardan como texto (string) y se
// suman digito por digito, como se hace a mano.
#include <iostream>
#include <string>
using namespace std;

// Suma dos numeros escritos como texto, de derecha a izquierda,
// llevando el acarreo.
string sumar(string a, string b) {
    string resultado = "";
    int i = a.length() - 1;
    int j = b.length() - 1;
    int lleva = 0;

    while (i >= 0 || j >= 0 || lleva > 0) {
        int digito = lleva;
        if (i >= 0) {
            digito = digito + (a[i] - '0');
            i--;
        }
        if (j >= 0) {
            digito = digito + (b[j] - '0');
            j--;
        }
        resultado = char('0' + digito % 10) + resultado;
        lleva = digito / 10;
    }
    return resultado;
}

int main() {
    string ant = "0", act = "1", sig;

    for (int i = 1; i <= 200; i++) {
        cout << "Termino " << i << ": " << ant << endl;
        sig = sumar(ant, act);
        ant = act;
        act = sig;
    }
    return 0;
}
