// handling input errors
export function isPropertyType(propertyType: any) {
  if (propertyType.trim().length == 0) {
    return 'Fill in the property type information!'
  } else if (propertyType.trim().length > 20) {
    return 'attribute type can be entered up to 20 characters'
  }
  else {
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
  } else if (name.trim().length < 3) {
    return 'The length of the name must be at least 3 characters!'
  }
  else {
    return ''
  }
}

export function isPrice(price: number) {
  if (price < 0) {
    return 'The price of money cannot be negative!'
  } else if (price < 100000 && price > 0) {
    return 'Minimum price is 100000 VND!'
  }else if(price > 100000){
    return ''
  }
  else {
    return 'Fill in price information! (cannot be zero)'
  }
}