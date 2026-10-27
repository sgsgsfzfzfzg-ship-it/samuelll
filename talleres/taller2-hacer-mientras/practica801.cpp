// Samuel Munoz Vargas
// practica801 - validar contrasena
#include<iostream>
#include<stdlib.h>
using namespace std;

int main(){
    int clave;
    do{
        cout<<"Ingrese su contrasena numerica: ";
        cin>>clave;
        if(clave!=1234){
            cout<<"Contrasena incorrecta. Intente de nuevo."<<endl;
        }
    }while(clave!=1234);
    cout<<"Acceso concedido!"<<endl;
    system("pause");
    return 0;
}
