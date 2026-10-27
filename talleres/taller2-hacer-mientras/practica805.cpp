// Samuel Munoz Vargas
// practica805 - adivinar el numero secreto
#include<iostream>
#include<stdlib.h>
using namespace std;

int main(){
    int intento,secreto=7;
    do{
        cout<<"Adivine el numero secreto (entre 1 y 10): ";
        cin>>intento;
        if(intento!=secreto){
            cout<<"Incorrecto. Sigue intentando!"<<endl;
        }
    }while(intento!=secreto);
    cout<<"Felicidades! Adivinaste el numero secreto."<<endl;
    system("pause");
    return 0;
}
