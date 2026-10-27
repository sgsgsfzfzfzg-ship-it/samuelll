// Samuel Munoz Vargas
// practica304 - serie de fibonacci, 200 terminos
#include<iostream>
#include<iomanip>
#include<stdlib.h>
using namespace std;

int main(){
    double ant=0,act=1,sig;
    int i;
    cout<<fixed<<setprecision(0);
    for(i=1;i<=200;i++){
        cout<<ant<<endl;
        sig=ant+act;
        ant=act;
        act=sig;
    }
    system("pause");
    return 0;
}
