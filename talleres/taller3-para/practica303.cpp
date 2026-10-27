// practica303.cpp
// Lee N numeros y calcula el factorial de cada uno.
// n! = 1 * 2 * 3 * ... * n   y   0! = 1
// Se usa unsigned long long, que alcanza hasta 20! sin desbordarse.
#include <iostream>
using namespace std;

int main() {
    int n, num;
    unsigned long long fact;

    cout << "Cuantos numeros va a ingresar? ";
    cin >> n;

    for (int k = 1; k <= n; k++) {
        cout << "Ingrese el numero " << k << ": ";
        cin >> num;

        if (num < 0 || num > 20) {
            cout << "Solo se calcula el factorial de numeros entre 0 y 20" << endl;
        } else {
            fact = 1;
            for (int i = 1; i <= num; i++) {
                fact = fact * i;
            }
            cout << num << "! = " << fact << endl;
        }
    }
    return 0;
}
