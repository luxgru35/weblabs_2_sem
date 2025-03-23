import { useEffect, useState } from 'react';
import { fetchEvents } from '@api/eventService';
import styles from './Events.module.scss';
import EventList from './components/EventList';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        setError('Failed to fetch events.');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className={styles.eventsPage}>
      <h1>Events</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <EventList events={events} />
    </div>
  );
};

export default Events;