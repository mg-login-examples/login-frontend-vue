// Note values in this store object should never be changed
// This store is used by all cucumber tests where such data is required that is different for every test run
import casual from 'casual'

const RandomValueStore = {
  'random > my quote > create quote': casual.sentence,
  'random > my quote > to edit quote': casual.sentence,
  'random > my quote > edited quote': casual.sentence,
  'random > my quote > delete quote': casual.sentence,
  'random > all quotes > like quote': casual.sentence,
  'random > all quotes > unlike quote': casual.sentence,
  'random > user notes > create note': casual.sentence,
  'random > user notes > edit note': casual.sentence
}

const WebpageValueStore = {
  'webpage > all quotes > like quote': undefined,
  'webpage > all quotes > unlike quote': undefined,
  'webpage > user notes > view note 1': undefined,
  'webpage > user notes > view note 2': undefined,
  'webpage > user notes > edit note 1': undefined,
  'webpage > user notes > edit note 2': undefined
}

const ExternalValueStore = {
  'external > signup > email': 'de8c1334-5620-4e58-bd9e-ad5ab8599749@mailslurp.com',
  'external > signup > account id': 'de8c1334-5620-4e58-bd9e-ad5ab8599749',
  'external > signup > verification code': ''
}

export function getValueFromStore(key: string) {
  if (key in RandomValueStore) {
    return RandomValueStore[key]
  } else if (key in WebpageValueStore) {
    return WebpageValueStore[key]
  } else if (key in ExternalValueStore) {
    return ExternalValueStore[key]
  }
  return key
}

export function setValueInStore(key: string, value: string) {
  if (key in WebpageValueStore) {
    WebpageValueStore[key] = value
  } else if (key in ExternalValueStore) {
    ExternalValueStore[key] = value
  }
}
