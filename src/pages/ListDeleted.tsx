import { RefresherEventDetail } from '@ionic/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonSearchbar, IonTabBar, IonTitle, IonToolbar } from '@ionic/react';
import { save } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { deleteApartment, getAllApartment, getApartmentById, insertApartment, updateApartment } from '../databaseHandler';
import { Apartment } from '../models';
import './Home.css';

const Home: React.FC = () => {

    const [allApartment, setAllApartment] = useState<Apartment[]>([]);
    const [refreshState, setRefreshState] = useState(false)
    const [data, setData] = useState(true)

    async function fetchData() {
        const resultFromDB = await getAllApartment();
        const a = resultFromDB.filter((e) => {
            return e.exist == false
        })
        if(a.length == 0){
            setData(false)
        }
        console.log(a)
        setAllApartment(a);
    }

    async function Restore(id: any) {
        const r = await getApartmentById(id) as Apartment
        r.exist = true
        await insertApartment(r)
        setRefreshState(!refreshState)
        alert('Restore already!')
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
                    <IonTitle>List deleted</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent>
                    </IonRefresherContent>
                </IonRefresher>
                <IonList>
                    {data ===false &&
                    <h1 className='nothingDelele'>No records have been deleted!</h1>
                    }
                    {allApartment.map(a =>
                            <IonItem key={a.id} className='cl'>
                                <IonLabel>
                                    <img src={URL.createObjectURL(a.picture)} width='200' height='150' />
                                    <h2 >Creator Name: {a.creatorName}</h2>
                                    <h2 >Property Type: {a.propertyType}</h2>
                                    <h2 >Bedroom: {a.bedroom}</h2>
                                    <h2 >Furniture Types: {a.furnitureTypes}</h2>
                                    <h2 >Price: {a.price}</h2>
                                    <h2 >Notes: {a.notes}</h2>
                                    <h2 >State notes: {a.stateNotes}</h2>
                                    
                                    <IonButton slot='start' onClick={() => Restore(a.id)} size='default' >Restore</IonButton>
                                    <IonButton slot='end' onClick={() => Delete(a.id)} size='default'>Force Delete</IonButton>
                                </IonLabel>
                            </IonItem>
                    )}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Home;


