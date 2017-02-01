import { Promise } from 'es6-promise'
import * as localforage from 'localforage'

export function addEvent(event: any): Promise<ReadonlyArray<any>> {

  return localforage.getItem('myEvents').then((storedCustomEvents: ReadonlyArray<any>) => {
    const oldCustomEvents = (storedCustomEvents || [])
    const newCustomEvents = oldCustomEvents.concat(event)

    return localforage.setItem('myEvents', newCustomEvents)
  })
}

export function addReminder(event: any): Promise<ReadonlyArray<any>> {

  return localforage.getItem('reminders').then((storedReminders: ReadonlyArray<any>) => {
    const oldReminders = (storedReminders || [])
    const newReminders = oldReminders.concat(event)

    return localforage.setItem('reminders', newReminders)
  })
}

export function getEvents(): Promise<ReadonlyArray<any>> {
  return localforage.getItem('myEvents').then(storedEvents => {
    return (storedEvents || [])
  })
}

export function getReminders(): Promise<ReadonlyArray<any>> {
  return localforage.getItem('reminders').then(storedReminders => {
    return (storedReminders || [])
  })
}

export function removeEvent(title: string): Promise<ReadonlyArray<any>> {
  return localforage.getItem('myEvents').then((storedCustomEvents: ReadonlyArray<any>) => {
    const oldCustomEvents = (storedCustomEvents || [])
    const newCustomEvents = oldCustomEvents.filter(({title: existingTitle}) => existingTitle !== title)

    return localforage.setItem('myEvents', newCustomEvents)
  })
}
