// practica9201.cpp
// Escribe las tablas de multiplicar desde 1 hasta n.
#include <iostream>
using namespace std;

int main() {
    int n;

    cout << "Hasta que tabla desea ver? ";
    cin >> n;

    for (int i = 1; i <= n; i++) {
        cout << endl << "Tabla del " << i << endl;
        for (int j = 1; j <= 10; j++) {
            cout << i << " x " << j << " = " << i * j << endl;
        }
    }
    return 0;
}
