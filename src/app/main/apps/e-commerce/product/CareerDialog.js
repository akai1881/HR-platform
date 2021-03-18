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
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeEditCareerDialog, closeNewCareerDialog } from '../store/productSlice';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const defaultFormState = {
	startedAt: '',
	status: true,
	endedAt: '',
	type: 'career',
	position: '',
	company: ''
};

const schema = Yup.object().shape({
	position: Yup.string().required('Это обязательное поле'),
	company: Yup.string().required('Это обязательное поле'),
	startedAt: Yup.string().required('Это обязательное поле')
	// status: Yup.string().required('Это обязательное поле')
	// endedAt: Yup.string().required('Это обязательное поле')
});

function CareerDialog({ getCareer }) {
	const dispatch = useDispatch();
	const careerDialog = useSelector(({ eCommerceApp }) => eCommerceApp.product.careerDialog);
	const [birthday, setBirthday] = useState('');
	const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(schema)
	});
	const [values, setValues] = useState(null);
	const [activeStatus, setActiveStatus] = useState(true);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (careerDialog.type === 'edit' && careerDialog.data) {
			setValues({ ...careerDialog.data });
		}

		if (careerDialog.type === 'edit' && careerDialog.data && careerDialog.data.endedAt) {
			setValues({ ...careerDialog.data });
			setActiveStatus(false);
		}

		/**
		 * Dialog type: 'new'
		 */
		if (careerDialog.type === 'new') {
			setValues({ ...defaultFormState });
		}
	}, [careerDialog.data, careerDialog.type]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */

		console.log('THIS IS CONTACTS DIALOG DATA', careerDialog.data);
		if (careerDialog.props.open) {
			initDialog();
		}
	}, [careerDialog.props.open, initDialog]);

	function closeComposeDialog() {
		if (careerDialog.type === 'edit') {
			return dispatch(closeEditCareerDialog());
		}
		return dispatch(closeNewCareerDialog());
	}

	function canBeSubmitted() {
		// return form.attainment.length > 0;
	}

	useEffect(() => {
		if (!careerDialog.props.open) {
			setActiveStatus(true);
		}
	}, [careerDialog.props.open]);

	function handleSubmitCareer(data) {
		console.log('CLICKED');
		if (careerDialog.type === 'new') {
			// dispatch(addUser(form));
			getCareer({
				...data,
				status: activeStatus,
				id: FuseUtils.generateGUID(),
				type: 'career'
			});
		} else {
			getCareer({
				...data,
				status: activeStatus,
				id: careerDialog.data.id,
				type: 'career'
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
			{...careerDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{careerDialog.type === 'new' ? 'Новая Карьера' : 'Изменить Карьеру'}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit(handleSubmitCareer)} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<TextField
							className="mb-24"
							label="Позиция"
							autoFocus
							inputRef={register}
							error={errors.position && errors.position}
							helperText={errors.position && errors.position.message}
							id="position"
							name="position"
							defaultValue={values ? values.position : ''}
							variant="outlined"
							required
							fullWidth
						/>
					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							label="Компания"
							id="company"
							error={errors.company && errors.company}
							helperText={errors.company && errors.company.message}
							inputRef={register}
							defaultValue={values ? values.company : ''}
							name="company"
							variant="outlined"
							fullWidth
						/>
					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							id="startedAt"
							error={errors.startedAt && errors.startedAt}
							label="Начало"
							helperText={errors.startedAt && errors.startedAt.message}
							inputRef={register}
							defaultValue={values ? values.startedAt : ''}
							name="startedAt"
							type="date"
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
							fullWidth
						/>
					</div>

					<div className="flex">
						<FormControl
							variant="outlined"
							className="mb-20"
							fullWidth
							required
							// error={errors.status && errors.status}
						>
							<InputLabel id="status">Статус</InputLabel>
							<Select
								input={
									<OutlinedInput name="status" id="status-select" labelWidth={'status'.length * 8} />
								}
								value={activeStatus.toString()}
								onChange={e => setActiveStatus(() => e.target.value === 'true')}
							>
								<MenuItem value={'true'}>По настоящее время</MenuItem>
								<MenuItem value={'false'}>Завершено</MenuItem>
							</Select>
							{/* <FormHelperText>{errors.status && errors.status.message}</FormHelperText> */}
						</FormControl>
					</div>

					{!activeStatus ? (
						<div className="flex">
							<TextField
								className="mb-24"
								id="endedAt"
								// error={activeStatus && errors.endedAt && errors.endedAt}
								// helperText={errors.endedAt && errors.endedAt.message}
								label="Конец"
								inputRef={register}
								defaultValue={values ? values.endedAt : ''}
								name="endedAt"
								type="date"
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								fullWidth
							/>
						</div>
					) : null}
				</DialogContent>

				{careerDialog.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit(handleSubmitCareer)}
								type="submit"
							>
								Add
							</Button>
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSubmit(handleSubmitCareer)}
							>
								Save
							</Button>
						</div>
						<IconButton onClick={handleRemove}>
							<Icon>delete</Icon>
						</IconButton>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default CareerDialog;
