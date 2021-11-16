import { RefresherEventDetail } from '@ionic/core';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonSearchbar, IonTabBar, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { getAllApartment, getApartmentById, insertApartment, updateApartment } from '../databaseHandler';
import { Apartment } from '../models';
import './Home.css';

const Home: React.FC = () => {

    const [stateNotes, setStateNotes] = useState('')
    const [allApartment, setAllApartment] = useState<Apartment[]>([]);
    const [refreshState, setRefreshState] = useState(false)

    async function fetchData() {
        const resultFromDB = await getAllApartment();
        const apartmentExist = resultFromDB.filter((e) => e.exist == true)
        setAllApartment(apartmentExist)
    }

    async function searchData(data: string) {
        const resultFromDB = await getAllApartment();
        const apartmentExist = resultFromDB.filter((e) => e.exist == true)
        const searchData = apartmentExist.filter((e) =>
            e.creatorName.toLowerCase().includes(data.toLowerCase())
        )
        setAllApartment(searchData)
    }

    async function save(id: number) {
        const r = await getApartmentById(id) as Apartment
        r.stateNotes = stateNotes
        await insertApartment(r)
        alert(`Notes already done for ${r.creatorName}`)
        setRefreshState(!refreshState)
    }

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        fetchData();
        setTimeout(() => {
            event.detail.complete();
        }, 1500);
    }

    useEffect(() => {
        fetchData()
    }, [, refreshState])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className='title'>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent>
                    </IonRefresherContent>
                </IonRefresher>
                <IonSearchbar onIonChange={e => searchData(e.detail.value!)} placeholder='Search with name'></IonSearchbar>
                <IonList>
                    {allApartment.map(a =>
                        <>
                            <IonItem key={a.id} className='homeList' routerLink={'/details/' + a.id} lines='none'>
                                <IonLabel>
                                    <img src={URL.createObjectURL(a.picture)} width='200' height='150' />
                                    <h2>Price: {a.price} VND</h2>
                                    <h2 >Creator Name: {a.creatorName}</h2>
                                    <h2>State Notes:{a.stateNotes} </h2>
                                </IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonInput onIonChange={e => setStateNotes(e.detail.value!)} placeholder='Enter state notes'></IonInput>
                                <IonButton onClick={() => save(a.id!)} size='default'>Save Status</IonButton>
                                {/* The function returns void. void is not assingable to onClick which expects a function. */}
                            </IonItem>
                        </>
                    )}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Home;


