// practica308.cpp
// Banco A.B.C.: lee los datos de las cuentas corrientes hasta que el
// numero de cuenta sea 0 y halla:
//  - cuanto dinero de los clientes tiene el banco (suma de saldos a favor)
//  - cuantos clientes tienen saldo a favor y cuantos en rojo
//  - cuantos clientes tienen saldo mayor a $500.000
//  - nombre y telefono del cliente que menos cheques ha girado
#include <iostream>
#include <string>
using namespace std;

const double SALDO_ALTO = 500000;

// Procedimiento: actualiza los contadores con los datos de un cliente.
// Los parametros con & se modifican y el cambio queda en el main.
void proceso(string nom, string tel, double saldo, int ncg,
             int &ncgx, int &csr, int &csf, double &asaldo,
             int &c500, string &nomx, string &telx) {
    if (ncg < ncgx) {
        ncgx = ncg;
        nomx = nom;
        telx = tel;
    }
    if (saldo < 0) {
        csr = csr + 1;
    } else {
        if (saldo > 0) {
            csf = csf + 1;
            asaldo = asaldo + saldo;
            if (saldo > SALDO_ALTO) {
                c500 = c500 + 1;
            }
        }
    }
}

int main() {
    int numcue, ncg, csr = 0, csf = 0, c500 = 0, ncgx = 9999;
    double saldo, asaldo = 0;
    string nomcli, tel, nomx = "", telx = "";

    cout << "Numero de cuenta (0 para terminar): ";
    cin >> numcue;
    while (numcue != 0) {
        cout << "Nombre del cliente: ";
        cin >> ws;               // descarta el salto de linea pendiente
        getline(cin, nomcli);    // permite nombres con espacios
        cout << "Telefono: ";
        cin >> tel;
        cout << "Saldo actual: ";
        cin >> saldo;
        cout << "Numero de cheques girados: ";
        cin >> ncg;

        proceso(nomcli, tel, saldo, ncg, ncgx, csr, csf, asaldo, c500, nomx, telx);

        cout << endl << "Numero de cuenta (0 para terminar): ";
        cin >> numcue;
    }

    cout << endl;
    cout << "Dinero de los clientes en el banco: $" << asaldo << endl;
    cout << "Clientes con saldo en rojo: " << csr << endl;
    cout << "Clientes con saldo a favor: " << csf << endl;
    cout << "Clientes con saldo mayor a $500.000: " << c500 << endl;
    if (nomx != "") {
        cout << "Cliente que menos cheques ha girado: " << nomx
             << " - Tel: " << telx << endl;
    }
    return 0;
}
