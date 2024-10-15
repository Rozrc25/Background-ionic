import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
// import BGAction from './BGAction';

const Dashboard: React.FC = ()=>{
  
 
    return (
        <div>
           <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      {/* <BGAction/> */}
        <IonContent>
          <IonTitle>dashboard</IonTitle>
        </IonContent>
      </IonPage>
        </div>
    );
}

export default Dashboard;