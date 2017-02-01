import EventType from './EventType'

interface IBagiEvent {
  readonly date: Date;
  readonly title: string;
  readonly type: EventType;
}

export default IBagiEvent
