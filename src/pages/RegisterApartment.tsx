import { DatetimeOptions } from '@ionic/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInfiniteScroll, IonInput, IonItem, IonLabel, IonPage, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { getAllApartment, insertApartment } from '../databaseHandler';
import { takePicture } from '../pictureHandler';
import { isName, isBedroom, isPrice, isPropertyType } from '../checkError'
import './Home.css';


const Register: React.FC = () => {
  const [propertyType, setpropertyType] = useState('')
  const [price, setPrice] = useState(Number)
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date().toString())
  const [creatorName, setCreatorName] = useState('')
  const [bedroom, setBedroom] = useState('')
  const [furnitureTypes, setFurnitureTypes] = useState('')
  const [stateNotes, setStateNotes] = useState('')
  const [exist, setexist] = useState(true)
  const [picture, setPicture] = useState('assets/Blank.jpg')

  const [checkPropertyType, setCheckPropertyType] = useState(false)
  const [checkBedroom, setCheckBedroom] = useState(false)
  const [checkPrice, setCheckPrice] = useState(false)
  const [checkName, setCheckName] = useState(false)

  async function clickHandler() {

    setCheckPropertyType(true)
    setCheckBedroom(true)
    setCheckPrice(true)
    setCheckName(true)
    
    if (isPropertyType(propertyType).length == 0 &&  isBedroom(bedroom).length == 0 &&
    isPrice(price).length == 0 && isName(creatorName).length ==0) {
      const allApartment = await getAllApartment()
      for (const aparment of allApartment) {
        if (aparment.creatorName === creatorName) {
          if (aparment.propertyType === propertyType && aparment.price === price)
            return alert('Data already exists')
        }
      }
      const response = await fetch(picture)
      const fileContent = await response.blob()
      const newRoom = {
        propertyType: propertyType, picture: fileContent, bedroom: bedroom, price: price, furnitureTypes: furnitureTypes,
        notes: notes, creatorName: creatorName, date: date, stateNotes: stateNotes, exist: exist
      }
      await insertApartment(newRoom).then(() => {
        setTimeout(()=>{
          alert('insert done!')
        },500)
      })
    }
    else alert('Enter information in the format')
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle><big>Add Apartment</big> </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonItem>
          <IonLabel position='stacked'><h1>Property type</h1></IonLabel>
          <IonInput onIonChange={e => setpropertyType(e.detail.value!)} onBlur={onBlurPropertyType} placeholder='Enter type'></IonInput>
          {checkPropertyType && isPropertyType(propertyType).length > 0 &&
            <p className ='checkError'>{isPropertyType(propertyType)}</p>
          }
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Bedroom</h1></IonLabel>
          <IonSelect onIonChange={e => setBedroom(e.detail.value!)} onBlur={onBlurBedroom} placeholder='Select the bedroom type'>
            <IonSelectOption value='one'>One</IonSelectOption>
            <IonSelectOption value='two'>Two</IonSelectOption>
            <IonSelectOption value='studio'>Studio</IonSelectOption>
          </IonSelect>
          {checkBedroom &&  isBedroom(bedroom).length > 0 &&
            <p className ='checkError'>{ isBedroom(bedroom)}</p>
          }
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Furniture Types</h1></IonLabel>
          <IonInput onIonChange={e => setFurnitureTypes(e.detail.value!)} placeholder='Enter furniture types'></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Monthly rent price</h1></IonLabel>
          <IonInput onIonChange={e => setPrice(Number.parseInt(e.detail.value!))} onBlur={onBlurPrice} placeholder='Enter price'></IonInput>
          {checkPrice && isPrice(price).length > 0 &&
            <p className ='checkError'>{isPrice(price)}</p>
          }
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Notes (optional)</h1> </IonLabel>
          <IonInput onIonChange={e => setNotes(e.detail.value!)} placeholder='Enter notes'></IonInput>
        </IonItem>
        <IonItem>
        <IonLabel position='stacked'><h1>Picture</h1> </IonLabel>
          <IonButton onClick={async () => { setPicture(await takePicture()) }}>Select</IonButton>
          <img src = {picture} width = '140' height ='110'></img>
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'><h1>Name of the reporter</h1></IonLabel>
          <IonInput onIonChange={e => setCreatorName(e.detail.value!)} onBlur={onBlurName} placeholder='Enter name'></IonInput>
          {checkName && isName(creatorName).length > 0 &&
            <p className ='checkError'>{isName(creatorName)}</p>
          }
        </IonItem>
        <IonItem>
          <IonLabel><h1>Date time</h1></IonLabel>
          <IonDatetime displayFormat="HH:mm DD-MM-YYYY" value={date} onIonChange={e => setDate(e.detail.value!)}></IonDatetime>
        </IonItem>
        <IonButton onClick={clickHandler} expand='block'>Register</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
