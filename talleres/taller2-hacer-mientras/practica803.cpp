// Samuel Munoz Vargas
// practica803 - sumadora
#include<iostream>
#include<stdlib.h>
using namespace std;

int main(){
    float num,suma=0;
    do{
        cout<<"Ingrese un numero (0 para terminar): ";
        cin>>num;
        suma=suma+num;
    }while(num!=0);
    cout<<"La suma total es: "<<suma<<endl;
    system("pause");
    return 0;
}
