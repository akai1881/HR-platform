import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeEditTimeDialog } from '../store/ordersSlice';

const defaultFormState = {
	id: '',
	name: ''
};

function TimeDialog() {
	const dispatch = useDispatch();
	const timeDialog = useSelector(({ eCommerceApp }) => eCommerceApp.orders.timeDialog);
	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		setForm({ ...timeDialog.data });

	}, [timeDialog.data, timeDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */

		console.log('THIS IS CONTACTS DIALOG DATA', timeDialog.data);
		if (timeDialog.props.open) {
			initDialog();
		}
	}, [timeDialog.props.open, initDialog]);

	function closeComposeDialog() {

		return dispatch(closeEditTimeDialog());
	}

	function canBeSubmitted() {
		return form.name.length > 0;
	}

	function handleSubmitUser(event) {
		event.preventDefault();
		if (timeDialog.type === 'new') {
			// dispatch(addDepartment(form));
		} else {
			setForm({
				...form
			});
			// dispatch(editUser(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		// dispatch(deleteUser(form.id));
		closeComposeDialog();
	}

	function handleTestChange(e) {
		console.log(e.target.value);
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...timeDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth='xs'
		>
			<AppBar position='static' elevation={1}>
				<Toolbar className='flex w-full'>
					<Typography variant='subtitle1' color='inherit'>
						{timeDialog.type === 'new' ? 'Новый Отдел' : 'Изменить название Отдела'}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmitUser} className='flex flex-col md:overflow-hidden'>
				<DialogContent classes={{ root: 'p-24' }}>
					<div className='flex'>
						<div className='min-w-48 pt-20'>
							<Icon color='action'>assignment</Icon>
						</div>

						<TextField
							className='mb-24'
							label='Название отдела'
							autoFocus
							id='name'
							name='name'
							value={form.name}
							onChange={handleChange}
							variant='outlined'
							required
							fullWidth
						/>
					</div>
				</DialogContent>
				<DialogActions className='justify-between p-8'>
					<div className='px-16'>
						<Button
							variant='contained'
							color='primary'
							type='submit'
							onClick={handleSubmitUser}
							disabled={!canBeSubmitted()}
						>
							Save
						</Button>
					</div>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default TimeDialog;
