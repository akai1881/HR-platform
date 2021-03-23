import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addDepartment,
	editDepartment,
	deleteUser,
	closeNewDepartmentDialog,
	closeEditDepartmentDialog
} from './store/contactsSlice';

const defaultFormState = {
	id: '',
	name: ''
};

function ContactDialog() {
	const dispatch = useDispatch();
	const departmentDialog = useSelector(({ contactsApp }) => contactsApp.contacts.departmentDialog);
	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (departmentDialog.type === 'edit' && departmentDialog.data) {
			setForm({ ...departmentDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
	}, [departmentDialog.data, departmentDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */

		console.log('THIS IS CONTACTS DIALOG DATA', departmentDialog.data);
		if (departmentDialog.props.open) {
			initDialog();
		}
	}, [departmentDialog.props.open, initDialog]);

	function closeComposeDialog() {
		if (departmentDialog.type === 'edit') {
			return dispatch(closeEditDepartmentDialog());
		}

		return dispatch(closeNewDepartmentDialog());
	}

	function canBeSubmitted() {
		return form.name.length > 0;
	}

	function handleSubmit(event) {
		event.preventDefault();
		setForm({
			...form
		});
		console.log(form);
		dispatch(editDepartment(form));
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(deleteUser(form.id));
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
			{...departmentDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Изменить Отдел
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">assignment</Icon>
						</div>

						<TextField
							className="mb-24"
							label="Название отдела"
							autoFocus
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
						/>
					</div>
				</DialogContent>

				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button
							variant="contained"
							color="primary"
							type="submit"
							onClick={handleSubmit}
							disabled={!canBeSubmitted()}
						>
							Save
						</Button>
					</div>
					<IconButton onClick={handleRemove}>
						<Icon>delete</Icon>
					</IconButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default ContactDialog;
