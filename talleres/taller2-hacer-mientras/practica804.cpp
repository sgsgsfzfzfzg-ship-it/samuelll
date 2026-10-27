// Samuel Munoz Vargas
// practica804 - validar nota entre 0.0 y 5.0
#include<iostream>
#include<stdlib.h>
using namespace std;

int main(){
    float nota;
    do{
        cout<<"Ingrese una nota entre 0.0 y 5.0: ";
        cin>>nota;
        if(nota<0 || nota>5){
            cout<<"Error: La nota debe estar entre 0.0 y 5.0"<<endl;
        }
    }while(nota<0 || nota>5);
    cout<<"Nota registrada con exito: "<<nota<<endl;
    system("pause");
    return 0;
}
