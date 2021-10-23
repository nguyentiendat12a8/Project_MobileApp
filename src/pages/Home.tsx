import { RefresherEventDetail } from '@ionic/core';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonSearchbar, IonTabBar, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { getAllApartment, getApartmentById, insertApartment, updateApartment } from '../databaseHandler';
import { Apartment } from '../models';
import './Home.css';

const Home: React.FC = () => {

    const [stateNotes, setStateNotes] = useState('')
    const [allApartment, setAllApartment] = useState<Apartment[]>([]);
    const [search, setSearch] = useState('')
    const [refreshState, setRefreshState] = useState(false)

    async function fetchData() {
        const resultFromDB = await getAllApartment();
        const a = resultFromDB.filter((e) => {
            return e.exist == true
        })
        setAllApartment(a);

        if (search.trim()) {
            var searchData = []
            searchData = allApartment.filter((e) => {
                return e.creatorName.toLowerCase().startsWith(search.toLowerCase());
            })
            setAllApartment(searchData)
        }
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
        fetchData();
    }, [search,refreshState])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent>
                    </IonRefresherContent>
                </IonRefresher>
                <IonSearchbar onIonChange={e => setSearch(e.detail.value!)} placeholder='Search with name'></IonSearchbar>
                <IonList>
                    {allApartment.map(a =>
                        <>
                            <IonItem key={a.id} className='cl' routerLink={'/details/' + a.id} lines='none'>
                                <IonLabel>
                                    <img src={URL.createObjectURL(a.picture)} width='200' height='150' />
                                    <h2 >Creator Name: {a.creatorName}</h2>
                                    <h2>State Notes:{a.stateNotes} </h2>
                                </IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonInput onIonChange={e => setStateNotes(e.detail.value!)} placeholder='Enter state notes'></IonInput>
                                <IonButton onClick={() => save(a.id!)} size ='default'>Save Status</IonButton>
                                {/* you are calling the function. The function returns void. void is not assingable to onClick which expects a function. */}
                            </IonItem>
                        </>
                    )}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Home;


