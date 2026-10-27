// Samuel Munoz Vargas
// practica9209 - serie 1/2, 3/4, 5/8, 7/16 ...
#include<iostream>
#include<stdlib.h>
using namespace std;

int main(){
    float num=1,den=2,ter,sum=0;
    int n,cont=0;
    cout<<"Cuantos terminos? ";
    cin>>n;
    while(cont<n){
        ter=num/den;
        cout<<num<<"/"<<den<<" = "<<ter<<endl;
        sum=sum+ter;
        num=num+2;
        den=den*2;
        cont=cont+1;
    }
    cout<<"La sumatoria es: "<<sum<<endl;
    system("pause");
    return 0;
}
