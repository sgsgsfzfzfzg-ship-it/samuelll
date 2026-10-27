// Samuel Munoz Vargas
// practica9204 - notas que ganan y pierden
#include<iostream>
#include<stdlib.h>
using namespace std;

int main(){
    double nota,acum_per=0,acum_gan=0,prom_per,prom_gan;
    int con_per=0,con_gan=0;
    cout<<"Ingrese la nota (9.9 para terminar): ";
    cin>>nota;
    while(nota!=9.9){
        if(nota>5.0 || nota<0.0){
            cout<<"nota es invalida"<<endl;
        }
        else{
            if(nota>=3.0){
                acum_gan=acum_gan+nota;
                con_gan=con_gan+1;
            }
            else{
                acum_per=acum_per+nota;
                con_per=con_per+1;
            }
        }
        cout<<"Ingrese la nota (9.9 para terminar): ";
        cin>>nota;
    }
    prom_gan=acum_gan/con_gan;
    prom_per=acum_per/con_per;
    cout<<"Ganaron: "<<con_gan<<endl;
    cout<<"Perdieron: "<<con_per<<endl;
    cout<<"Promedio de los que ganaron: "<<prom_gan<<endl;
    cout<<"Promedio de los que perdieron: "<<prom_per<<endl;
    system("pause");
    return 0;
}
