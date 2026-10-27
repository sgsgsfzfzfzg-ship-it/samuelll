// Samuel Munoz Vargas
// practica301 - sumatoria de los numeros entre dos numeros
#include<iostream>
#include<stdlib.h>
using namespace std;

int main(){
    int a,b,i,suma=0;
    cout<<"Ingrese el primer numero (el menor): ";
    cin>>a;
    cout<<"Ingrese el segundo numero (el mayor): ";
    cin>>b;
    for(i=a;i<=b;i++){
        suma=suma+i;
    }
    cout<<"La sumatoria es: "<<suma<<endl;
    system("pause");
    return 0;
}
