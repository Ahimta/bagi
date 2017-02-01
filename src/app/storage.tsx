import { Promise } from 'es6-promise'
import IBagiEvent from './types/IBagiEvent'
import * as localforage from 'localforage'

export function addEvent(event: IBagiEvent): Promise<IBagiEvent[]> {

  return localforage.getItem('myEvents').then((storedCustomEvents: ReadonlyArray<IBagiEvent>) => {
    const oldCustomEvents = (storedCustomEvents || [])
    const newCustomEvents = oldCustomEvents.concat(event)

    return localforage.setItem('myEvents', newCustomEvents)
  })
}

export function addReminder(event: IBagiEvent): Promise<IBagiEvent[]> {

  return localforage.getItem('reminders').then((storedReminders: ReadonlyArray<IBagiEvent>) => {
    const oldReminders = (storedReminders || [])
    const newReminders = oldReminders.concat(event)

    return localforage.setItem('reminders', newReminders)
  })
}

export function getEvents(): Promise<IBagiEvent[]> {
  return localforage.getItem('myEvents').then(storedEvents => {
    return (storedEvents || [])
  })
}

export function getReminders(): Promise<IBagiEvent[]> {
  return localforage.getItem('reminders').then(storedReminders => {
    return (storedReminders || [])
  })
}

export function removeEvent(title: string): Promise<IBagiEvent[]> {
  return localforage.getItem('myEvents').then((storedCustomEvents: ReadonlyArray<IBagiEvent>) => {
    const oldCustomEvents = (storedCustomEvents || [])
    const newCustomEvents = oldCustomEvents.filter(({title: existingTitle}) => existingTitle !== title)

    return localforage.setItem('myEvents', newCustomEvents)
  })
}
