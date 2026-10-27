// Samuel Munoz Vargas
// practica302 - multiplos de 5
#include<iostream>
#include<stdlib.h>
using namespace std;

int main(){
    int n,i;
    cout<<"Ingrese un numero: ";
    cin>>n;
    for(i=1;i<=n;i++){
        if(i%5==0){
            cout<<i<<endl;
        }
    }
    system("pause");
    return 0;
}
