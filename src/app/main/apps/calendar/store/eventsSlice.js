import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import firebaseService from 'app/services/firebaseService/firebaseService';

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export const getEvents = createAsyncThunk('calendarApp/events/getEvents', async () => {
	const response = await axios.get('/api/calendar-app/events');
	const data = await response.data;

	return data;
});

export const getEmployeeShifts = createAsyncThunk('calendarApp/events/getEmployeeShifts', async () => {
	const shiftsRef = await firebaseService.database.collection('shifts').get();

	return shiftsRef.docs.map(doc => ({
		...doc.data(),
		time: doc.data().time.toDate().toJSON()
	}));

	// const usersRef = await shiftsRef.collection('users').get();

	// const usersData = await usersRef.docs.map(doc => ({ ...doc.data() }));

	// const shifts = await shiftsRef.get();

	// const shiftsData = await shifts.docs.map(doc => ({ ...doc.data() }));

	// console.log({
	// 	usersData,
	// 	shiftsData
	// });
});

export const addEvent = createAsyncThunk('calendarApp/events/addEvent', async (newEvent, { dispatch }) => {
	const response = await axios.post('/api/calendar-app/add-event', {
		newEvent
	});
	const data = await response.data;

	return data;
});

export const updateEvent = createAsyncThunk('calendarApp/events/updateEvent', async (event, { dispatch }) => {
	const response = await axios.post('/api/calendar-app/update-event', { event });
	const data = await response.data;

	return data;
});

export const removeEvent = createAsyncThunk('calendarApp/events/remove-event', async (eventId, { dispatch }) => {
	const response = await axios.post('/api/calendar-app/remove-event', { eventId });
	const data = await response.data;

	return data.id;
});

const eventsAdapter = createEntityAdapter({});

export const {
	selectAll: selectEvents,
	selectIds: selectEventIds,
	selectById: selectEventById
} = eventsAdapter.getSelectors(state => state.calendarApp.events);

const eventsSlice = createSlice({
	name: 'calendarApp/events',
	initialState: eventsAdapter.getInitialState({
		eventDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewEventDialog: {
			prepare: event => {
				const payload = {
					type: 'new',
					props: {
						open: true
					},
					data: {
						start: moment(event.start).format(dateFormat).toString(),
						end: moment(event.end).format(dateFormat).toString()
					}
				};
				return { payload };
			},
			reducer: (state, action) => {
				state.eventDialog = action.payload;
			}
		},
		openEditEventDialog: {
			prepare: event => {
				const payload = {
					type: 'edit',
					props: {
						open: true
					},
					data: {
						...event,
						start: moment(event.start).format(dateFormat).toString(),
						end: moment(event.end).format(dateFormat).toString()
					}
				};
				return { payload };
			},
			reducer: (state, action) => {
				state.eventDialog = action.payload;
			}
		},
		closeNewEventDialog: (state, action) => {
			state.eventDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		closeEditEventDialog: (state, action) => {
			state.eventDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		// [getEvents.fulfilled]: eventsAdapter.setAll,
		[getEmployeeShifts.fulfilled]: eventsAdapter.setAll,
		[addEvent.fulfilled]: eventsAdapter.addOne,
		[updateEvent.fulfilled]: eventsAdapter.upsertOne,
		[removeEvent.fulfilled]: eventsAdapter.removeOne
	}
});

export const {
	openNewEventDialog,
	closeNewEventDialog,
	openEditEventDialog,
	closeEditEventDialog
} = eventsSlice.actions;

export default eventsSlice.reducer;
