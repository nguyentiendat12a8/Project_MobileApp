
export function isPropertyType(propertyType: any) {
  if (propertyType.trim().length == 0) {
    return 'Fill in the property type information!'
  } else {
    return ''
  }
}

export function isBedroom(bedroom: any) {
  if (bedroom.trim().length == 0) {
    return 'Select bedroom information!'
  } else {
    return ''
  }
}

export function isName(name: any) {
  if (name.trim().length == 0) {
    return 'Fill in the name information!'
  } else {
    return ''
  }
}

export function isPrice(price: number) {
 if ( price > 0){
  return ''
  }
  else if (price < 0){
    return 'The price of money cannot be negative!'
  }
  else {
    return 'Fill in price information! (cannot be zero)'
  }
}