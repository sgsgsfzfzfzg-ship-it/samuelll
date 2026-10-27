// practica9204.cpp
// Lee notas (0.0 a 5.0) hasta el centinela 9.9. Acumula por separado
// las que ganan (>= 3.0) y las que pierden (< 3.0) y al final imprime
// la cantidad y el promedio de cada grupo.
#include <iostream>
using namespace std;

int main() {
    double nota, acum_per = 0, acum_gan = 0, prom_per = 0, prom_gan = 0;
    int con_per = 0, con_gan = 0;

    cout << "Ingrese una nota (9.9 para terminar): ";
    cin >> nota;
    while (nota != 9.9) {
        if (nota > 5.0 || nota < 0.0) {
            cout << "Nota es invalida" << endl;
        } else {
            if (nota >= 3.0) {
                acum_gan = acum_gan + nota;
                con_gan = con_gan + 1;
            } else {
                acum_per = acum_per + nota;
                con_per = con_per + 1;
            }
        }
        cout << "Ingrese una nota (9.9 para terminar): ";
        cin >> nota;
    }

    // Se evita dividir entre cero si un grupo no tiene notas.
    if (con_gan > 0) {
        prom_gan = acum_gan / con_gan;
    }
    if (con_per > 0) {
        prom_per = acum_per / con_per;
    }

    cout << "Cantidad que ganaron: " << con_gan << endl;
    cout << "Cantidad que perdieron: " << con_per << endl;
    cout << "Promedio de los que ganaron: " << prom_gan << endl;
    cout << "Promedio de los que perdieron: " << prom_per << endl;
    return 0;
}
