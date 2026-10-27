// Samuel Munoz Vargas
// practica308 - banco ABC
#include<iostream>
#include<stdlib.h>
#include<string>
using namespace std;

void proceso(string nomcli,string tel,double saldo,int ncg,int &ncgx,int &csr,int &csf,double &asaldo,int &c500,string &nomx,string &telx){
    if(ncg<ncgx){
        ncgx=ncg;
        nomx=nomcli;
        telx=tel;
    }
    if(saldo<0){
        csr=csr+1;
    }
    else{
        if(saldo>0){
            csf=csf+1;
            asaldo=asaldo+saldo;
            if(saldo>500000){
                c500=c500+1;
            }
        }
    }
}

int main(){
    int numcue,ncg,csr=0,csf=0,c500=0,ncgx=9999;
    double saldo,asaldo=0;
    string nomcli,tel,nomx,telx;
    cout<<"Numero de cuenta (0 para terminar): ";
    cin>>numcue;
    while(numcue!=0){
        cout<<"Nombre: ";
        cin>>nomcli;
        cout<<"Telefono: ";
        cin>>tel;
        cout<<"Saldo: ";
        cin>>saldo;
        cout<<"Cheques girados: ";
        cin>>ncg;
        proceso(nomcli,tel,saldo,ncg,ncgx,csr,csf,asaldo,c500,nomx,telx);
        cout<<"Numero de cuenta (0 para terminar): ";
        cin>>numcue;
    }
    cout<<"Dinero que tiene el banco: "<<asaldo<<endl;
    cout<<"Clientes en rojo: "<<csr<<endl;
    cout<<"Clientes con saldo a favor: "<<csf<<endl;
    cout<<"Clientes con saldo mayor a 500000: "<<c500<<endl;
    cout<<"Cliente que menos cheques giro: "<<nomx<<" tel: "<<telx<<endl;
    system("pause");
    return 0;
}
