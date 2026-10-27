// practica801.cpp
// Validar una contrasena numerica: se pide la clave hasta que
// el usuario escriba la correcta (1234).
#include <iostream>
using namespace std;

int main() {
    int clave;

    do {
        cout << "Ingrese su contrasena numerica: ";
        cin >> clave;
        if (clave != 1234) {
            cout << "Contrasena incorrecta. Intente de nuevo." << endl;
        }
    } while (clave != 1234);

    cout << "Acceso concedido!" << endl;
    return 0;
}
