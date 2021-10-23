
import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { deleteApartment, getApartmentById, insertApartment, updateApartment } from '../databaseHandler';
import { useHistory, useParams } from 'react-router';

import { Apartment } from '../models';
import { takePicture } from '../pictureHandler';
import { isBedroom, isName, isPrice, isPropertyType } from '../checkError';

interface IdParam {
  id: string
}

const Detail: React.FC = () => {
  const [propertyType, setpropertyType] = useState('')
  const [price, setPrice] = useState(Number)
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date().toString())
  const [creatorName, setCreatorName] = useState('')
  const [bedroom, setBedroom] = useState('')
  const [furnitureTypes, setFurnitureTypes] = useState('')
  const [stateNotes, setStateNotes] = useState('')
  const [exist, setExist] = useState(true)
  const [picture, setPicture] = useState('')
  const { id } = useParams<IdParam>()
  const history = useHistory()

  const [checkPropertyType, setCheckPropertyType] = useState(false)
  const [checkBedroom, setCheckBedroom] = useState(false)
  const [checkPrice, setCheckPrice] = useState(false)
  const [checkName, setCheckName] = useState(false)

  async function handleUpdate() {
    setCheckPropertyType(true)
    setCheckBedroom(true)
    setCheckPrice(true)
    setCheckName(true)
    if (isPropertyType(propertyType).length == 0 && isBedroom(bedroom).length == 0 &&
      isPrice(price).length == 0 && isName(creatorName).length == 0) {
      const response = await fetch(picture)
      const fileContent = await response.blob()
      const newRoom = {
        id: Number.parseInt(id), propertyType: propertyType, picture: fileContent, bedroom: bedroom, price: price, furnitureTypes: furnitureTypes,
        notes: notes, creatorName: creatorName, date: date, stateNotes: stateNotes, exist: exist
      }
      await updateApartment(newRoom)
      alert('done!')
      history.goBack()
    } else {
      alert('Enter information in the format')
    }
  }

  async function handleDelete() {
    const r = await getApartmentById(Number.parseInt(id)) as Apartment
    r.exist = false
    await insertApartment(r)
    alert('done')
    history.goBack()
  }

  const onBlurPropertyType = () => {
    setCheckPropertyType(true)
  }
  const onBlurBedroom = () => {
    setCheckBedroom(true)
  }
  const onBlurPrice = () => {
    setCheckPrice(true)
  }
  const onBlurName = () => {
    setCheckName(true)
  }

  async function fetchData() {
    const resultFromDB = await getApartmentById(Number.parseInt(id)) as Apartment
    setCreatorName(resultFromDB.creatorName)
    setpropertyType(resultFromDB.propertyType)
    setPrice(resultFromDB.price)
    setNotes(resultFromDB.notes)
    setDate(resultFromDB.date)
    setBedroom(resultFromDB.bedroom)
    setFurnitureTypes(resultFromDB.furnitureTypes)
    setStateNotes(resultFromDB.stateNotes)
    setPicture(URL.createObjectURL(resultFromDB.picture))
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Apartment Option</IonTitle>
          <IonButtons>
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonItem>
          <IonLabel position='stacked'><h1>Property type</h1></IonLabel>
          <IonInput value={propertyType} onIonChange={e => setpropertyType(e.detail.value!)} onBlur={onBlurPropertyType} placeholder='Enter type'></IonInput>
          {checkPropertyType && isPropertyType(propertyType).length > 0 &&
            <p className='checkError'>{isPropertyType(propertyType)}</p>
          }
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Bedroom</h1></IonLabel>
          <IonSelect value={bedroom} onIonChange={e => setBedroom(e.detail.value!)} onBlur={onBlurBedroom} placeholder='Select the bedroom type'>
            <IonSelectOption value='one'>One</IonSelectOption>
            <IonSelectOption value='two'>Two</IonSelectOption>
            <IonSelectOption value='studio'>Studio</IonSelectOption>
          </IonSelect>
          {checkBedroom && isBedroom(bedroom).length > 0 &&
            <p className='checkError'>{isBedroom(bedroom)}</p>
          }
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Furniture Types</h1></IonLabel>
          <IonInput value={furnitureTypes} onIonChange={e => setFurnitureTypes(e.detail.value!)} placeholder='Enter furniture types'></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Monthly rent price</h1></IonLabel>
          <IonInput value={price} onIonChange={e => setPrice(Number.parseInt(e.detail.value!))} onBlur={onBlurPrice} placeholder='Enter price'></IonInput>
          {checkPrice && isPrice(price).length > 0 &&
            <p className='checkError'>{isPrice(price)}</p>
          }
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Notes (optional) </h1></IonLabel>
          <IonInput value={notes} onIonChange={e => setNotes(e.detail.value!)} placeholder='Enter notes'></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Picture</h1></IonLabel>
          <IonButton onClick={async () => { setPicture(await takePicture()) }}>Select</IonButton>
          <img src={picture} width='140' height='110'></img>
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>State Notes (optional) </h1></IonLabel>
          <IonInput value={stateNotes} onIonChange={e => setStateNotes(e.detail.value!)} placeholder='Enter state notes'></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Name of the reporter</h1></IonLabel>
          <IonInput value={creatorName} onIonChange={e => setCreatorName(e.detail.value!)} onBlur={onBlurName} placeholder='Enter name'></IonInput>
          {checkName && isName(creatorName).length > 0 &&
            <p className='checkError'>{isName(creatorName)}</p>
          }
        </IonItem>
        <IonItem>
          <IonLabel><h1>Date time</h1></IonLabel>
          <IonDatetime displayFormat="HH:mm DD-MM-YYYY" value={date} onIonChange={e => setDate(e.detail.value!)}></IonDatetime>
        </IonItem>
        <IonButton onClick={handleUpdate} expand='block'>Update</IonButton>
        <IonButton onClick={handleDelete} expand='block'>Delete</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Detail;
