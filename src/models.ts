

export interface Apartment {
    id?:number,
    picture: Blob,
    propertyType: string,
    bedroom: string,
     price: number,
     furnitureTypes: string,
     notes: string,
     creatorName: string,
     date: string,
     stateNotes: string,
     exist: boolean,
}