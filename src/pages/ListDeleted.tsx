import { RefresherEventDetail } from '@ionic/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonSearchbar, IonTabBar, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { save } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { deleteApartment, getAllApartment, getApartmentById, insertApartment, updateApartment } from '../databaseHandler';
import { Apartment } from '../models';
import './Home.css';

const Home: React.FC = () => {

    const [allApartmentDeleted, setAllApartmentDeleted] = useState<Apartment[]>([]);
    const [refreshState, setRefreshState] = useState(false)
    const [data, setData] = useState(true)
    const [present] = useIonAlert();

    async function fetchData() {
        const resultFromDB = await getAllApartment();
        const dataDeleted = resultFromDB.filter((e) => {
            return e.exist == false
        })
        if(dataDeleted.length == 0){
            setData(false)
        }
        setAllApartmentDeleted(dataDeleted);
    }

    async function Restore(id: any) {
        const restoreData = await getApartmentById(id) as Apartment
        restoreData.exist = true
        await insertApartment(restoreData)
        setRefreshState(!refreshState)
        alert(`Restore already for ${restoreData.creatorName}!`)
    }
    
    async function Delete(id: any) {
        await deleteApartment(id)
        alert('Delete successfully!')
        setRefreshState(!refreshState)
    }

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        setData(true)
        fetchData();
        setTimeout(() => {
            event.detail.complete();
        }, 1500);
    }

    useEffect(() => {
        fetchData();
    }, [refreshState])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className ='title'>List Deleted</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent>
                    </IonRefresherContent>
                </IonRefresher>
                <IonList>
                    {data ===false &&
                    <h1 className='nothingDelete'>No records have been deleted!</h1>
                    }
                    {allApartmentDeleted.map(a =>
                            <IonItem key={a.id} className='homeList'>
                                <IonLabel>
                                    <img src={URL.createObjectURL(a.picture)} width='200' height='150' />
                                    <h2 >Property Type: {a.propertyType}</h2>
                                    <h2 >Bedroom: {a.bedroom}</h2>
                                    <h2 >Furniture Types: {a.furnitureTypes}</h2>
                                    <h2 >Price: {a.price} VND</h2>
                                    <h2 >Notes: {a.notes}</h2>
                                    <h2 >State notes: {a.stateNotes}</h2>
                                    <h2 >Creator Name: {a.creatorName}</h2>
                                    <IonButton expand='block' onClick={() => Restore(a.id)} size='default'>Restore</IonButton>
                                    <IonButton expand='block' onClick= {() => present({ cssClass: 'confirmMes',
                                        header: 'This action will be unrecoverable, are you sure to delete it?',
                                        buttons: ['Cancel',{ text: 'Ok', handler: () => Delete(a.id) }]})
                                        }size='default'>Force Delete</IonButton>
                                </IonLabel>
                            </IonItem>
                    )}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Home;

