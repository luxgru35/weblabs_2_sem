import { Event } from '../../../types/event';
import styles from './EventList.module.scss';

interface EventListProps {
  events: Event[];
}

const EventList = ({ events }: EventListProps) => {
  if (events.length === 0) {
    return <p>No events available.</p>;
  }

  return (
    <ul className={styles.eventList}>
      {events.map((event) => (
        <li key={event.id} className={styles.eventItem}>
          <h2 className={styles.eventName}>{event.name}</h2>
          <p className={styles.eventDescription}>{event.description}</p>
          <p className={styles.eventDate}>Date: {event.date}</p>
        </li>
      ))}
    </ul>
  );
};

export default EventList;