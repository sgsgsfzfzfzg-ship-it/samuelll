// Samuel Munoz Vargas
// practica303 - factorial de N numeros
#include<iostream>
#include<stdlib.h>
using namespace std;

int main(){
    int n,num,i,k;
    long long fact;
    cout<<"Cuantos numeros va a ingresar? ";
    cin>>n;
    for(k=1;k<=n;k++){
        cout<<"Ingrese un numero: ";
        cin>>num;
        fact=1;
        for(i=1;i<=num;i++){
            fact=fact*i;
        }
        cout<<"El factorial de "<<num<<" es: "<<fact<<endl;
    }
    system("pause");
    return 0;
}
