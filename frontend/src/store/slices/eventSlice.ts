// store/slices/eventSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@api/eventService';
import { Event } from '../../types/event';

interface EventsState {
  items: Event[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  isModalOpen: boolean;
  editingEvent: Event | null;
  eventToDelete: string | null;
  showDeleteConfirm: boolean;
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: "все",
  isModalOpen: false,
  editingEvent: null,
  eventToDelete: null,
  showDeleteConfirm: false,
};

// ===== Async Thunks =====
export const loadEvents = createAsyncThunk<Event[], void, { rejectValue: string }>(
  'events/loadEvents',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEvents();
    } catch {
      return rejectWithValue('Ошибка при загрузке мероприятий');
    }
  }
);

export const addEvent = createAsyncThunk<Event, Omit<Event, 'id'>, { rejectValue: string }>(
  'events/addEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      return await createEvent(eventData);
    } catch {
      return rejectWithValue('Ошибка при создании мероприятия');
    }
  }
);

export const updateEventThunk = createAsyncThunk<
  Event,
  { id: string; eventData: Partial<Event> },
  { rejectValue: string }
>(
  'events/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      return await updateEvent(id, eventData);
    } catch {
      return rejectWithValue('Ошибка при обновлении мероприятия');
    }
  }
);

export const removeEvent = createAsyncThunk<string, string, { rejectValue: string }>(
  'events/removeEvent',
  async (id, { rejectWithValue }) => {
    try {
      await deleteEvent(id);
      return id;
    } catch {
      return rejectWithValue('Ошибка при удалении мероприятия');
    }
  }
);

// ===== Slice =====
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.editingEvent = null;
    },
    startEditing(state, action: PayloadAction<Event>) {
      state.editingEvent = action.payload;
    },
    stopEditing(state) {
      state.editingEvent = null;
    },
    setDeleteConfirmation(state, action: PayloadAction<string | null>) {
      state.eventToDelete = action.payload;
      state.showDeleteConfirm = Boolean(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateEventThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeEvent.fulfilled, (state, action) => {
        state.items = state.items.filter(event => event.id !== action.payload);
      });
  },
});

export const {
  setCategory,
  openModal,
  closeModal,
  startEditing,
  stopEditing,
  setDeleteConfirmation,
} = eventsSlice.actions;

export default eventsSlice.reducer;
