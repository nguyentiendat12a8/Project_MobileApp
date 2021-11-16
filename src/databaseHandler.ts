import {openDB} from 'idb'
import { Apartment } from './models'

const DB_NAME ='Rental_Apartment'

initDB().then(()=>{
    console.log(DB_NAME+'was created')
})

export async function insertApartment(apartmentInfo:Apartment) {
    const db = await openDB(DB_NAME,1)
    db.put('apartment',apartmentInfo)
}

export async function updateApartment(apartmentInfo: Apartment) {
    const db = await openDB(DB_NAME,1)
    var apartment = await db.get('apartment',apartmentInfo.id!) as Apartment
    apartment.bedroom = apartmentInfo.bedroom
    apartment.stateNotes = apartmentInfo.stateNotes
    apartment.date = apartmentInfo.date
    apartment.furnitureTypes = apartmentInfo.furnitureTypes
    apartment.creatorName = apartmentInfo.creatorName
    apartment.notes = apartmentInfo.notes
    apartment.picture = apartmentInfo.picture
    apartment.price = apartmentInfo.price
    apartment.propertyType = apartmentInfo.propertyType
    apartment.exist = apartmentInfo.exist
    await db.put('apartment',apartment)
}

export async function getAllApartment() {
    const db = await openDB(DB_NAME,1)
    return db.getAll('apartment')
}

export async function deleteApartment(id: number) {
    const db = await openDB(DB_NAME,1)
    await db.delete('apartment', id)
}

export async function getApartmentById(id:number) {
    const db = await openDB(DB_NAME,1)
    return await db.get('apartment', id)
}

async function initDB() {
    const db = openDB(DB_NAME, 1, {
        upgrade(db){
            const store = db.createObjectStore('apartment', {
                keyPath: 'id',
                autoIncrement: true
            })
        }
    })
}