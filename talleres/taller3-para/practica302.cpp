// practica302.cpp
// Muestra los multiplos de 5 que hay entre 1 y un numero leido.
#include <iostream>
using namespace std;

int main() {
    int n;

    cout << "Ingrese un numero: ";
    cin >> n;

    cout << "Multiplos de 5 entre 1 y " << n << ":" << endl;
    for (int i = 5; i <= n; i = i + 5) {
        cout << i << endl;
    }
    return 0;
}
