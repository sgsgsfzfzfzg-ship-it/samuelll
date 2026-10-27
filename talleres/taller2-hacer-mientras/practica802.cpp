// practica802.cpp
// Menu de opciones interactivo: saludar, frase celebre del dia,
// valor del dolar en pesos y salir. Se repite hasta elegir 4.
#include <iostream>
using namespace std;

int main() {
    int opcion;

    do {
        cout << endl;
        cout << "----- MENU PRINCIPAL -----" << endl;
        cout << "1. Saludar" << endl;
        cout << "2. Mostrar frase celebre del dia" << endl;
        cout << "3. Mostrar el valor en pesos del dolar" << endl;
        cout << "4. Salir" << endl;
        cout << "Elija una opcion: ";

        // Si el usuario escribe letras en vez de un numero, se limpia
        // la entrada y se toma como opcion invalida.
        if (!(cin >> opcion)) {
            cin.clear();
            cin.ignore(10000, '\n');
            opcion = 0;
        }

        switch (opcion) {
            case 1:
                cout << "Hola! Que tengas un excelente dia." << endl;
                break;
            case 2:
                cout << "Hoy es un gran dia para programar." << endl;
                break;
            case 3:
                cout << "El valor en pesos del dolar hoy es: 9999" << endl;
                break;
            case 4:
                cout << "Saliendo del programa..." << endl;
                break;
            default:
                cout << "Opcion invalida. Intente de nuevo." << endl;
        }
    } while (opcion != 4);

    return 0;
}
