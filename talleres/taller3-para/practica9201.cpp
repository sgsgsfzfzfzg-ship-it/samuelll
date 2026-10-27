// Samuel Munoz Vargas
// practica9201 - tablas de multiplicar
#include<iostream>
#include<stdlib.h>
using namespace std;

int main(){
    int n,i,j;
    cout<<"Hasta que tabla? ";
    cin>>n;
    for(i=1;i<=n;i++){
        cout<<"Tabla del "<<i<<endl;
        for(j=1;j<=10;j++){
            cout<<i<<" x "<<j<<" = "<<i*j<<endl;
        }
    }
    system("pause");
    return 0;
}
