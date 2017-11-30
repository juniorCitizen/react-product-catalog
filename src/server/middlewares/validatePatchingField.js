const permittedFields = {
  carousels: [],
  companies: ['title', 'address', 'telephone', 'fax', 'website'],
  contacts: ['email', 'name', 'mobile'],
  countries: [],
  labels: [],
  photos: [],
  products: ['name', 'specification', 'description'],
  registrations: [],
  series: ['name'],
  tags: ['color']
}

const modelLookup = {
  carousels: 'Carousels',
  companies: 'Companies',
  contacts: 'Contacts',
  countries: 'Countries',
  labels: 'Labels',
  photos: 'Photos',
  products: 'Products',
  registrations: 'Registrations',
  series: 'Series',
  tags: 'Tags'
}

const normalizeId = {
  carousels: id => parseInt(id),
  companies: id => id.toUpperCase(),
  contacts: id => id.toUpperCase(),
  countries: id => id.toLowerCase(),
  labels: id => id.toUpperCase(),
  photos: id => id.toUpperCase(),
  products: id => id.toUpperCase(),
  registrations: id => id.toUpperCase(),
  series: id => id.toUpperCase(),
  tags: id => parseInt(id)
}

module.exports = (req, res, next) => {
  let modelReference = req.params.modelReference
  if (!(modelReference in modelLookup)) {
    // modelReference is not an existing model
    res.status(400)
    let error = new Error(`${modelReference} is not an existing model`)
    return next(error)
  }
  let fieldReference = req.params.fieldReference
  let position = permittedFields[modelReference].indexOf(fieldReference)
  if (position !== -1) {
    let recordId = req.body.id
    req.patchingData = {
      model: modelLookup[modelReference],
      id: normalizeId[modelReference](recordId),
      field: fieldReference,
      value: req.body.value || null
    }
    return next()
  } else {
    // if nothing matches
    res.status(400)
    let error = new Error(`Request did not specify field that's valid for patching on ${modelReference} model`)
    return next(error)
  }
}
