// import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import _ from '@lodash';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeEditProjectDialog, closeNewProjectDialog } from '../store/productSlice';
import FileInput from './components/FileInput';
import { useForm } from 'react-hook-form';
import firebaseServices from 'app/services/firebaseService/firebaseService';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@material-ui/core';

const defaultFormState = {
	id: '',
	title: '',
	startedAt: '',
	endedAt: '',
	link: '',
	github: '',
	description: ''
};

const schema = Yup.object().shape({
	title: Yup.string().required('Это обязательное поле')
});

function ProjectDialog({ getProject }) {
	const dispatch = useDispatch();
	const projectDialog = useSelector(({ eCommerceApp }) => eCommerceApp.product.projectDialog);
	const [image, setImage] = useState(null);
	const [cover, setCover] = useState(null);
	const [locale, setLocale] = useState('ru');
	const [activeStatus, setActiveStatus] = useState(true);
	const [loading, setLoading] = useState(false);
	const [values, setValues] = useState(null);
	const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(schema)
	});

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (projectDialog.type === 'edit' && projectDialog.data) {
			setValues({ ...projectDialog.data });
			setCover(projectDialog.data.cover);
		}

		/**
		 * Dialog type: 'new'
		 */
		if (projectDialog.type === 'new') {
			setValues({
				...defaultFormState
			});
			setCover(null);
		}
	}, [projectDialog.data, projectDialog.type]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (projectDialog.props.open) {
			initDialog();
		}
	}, [projectDialog.props.open, initDialog]);

	function closeComposeDialog() {
		if (projectDialog.type === 'edit') {
			return dispatch(closeEditProjectDialog());
		}
		return dispatch(closeNewProjectDialog());
	}

	async function onFileChange(e) {
		const file = e.target.files[0];
		const storageRef = firebaseServices.storage.ref();
		const fileRef = storageRef.child(file.name);
		try {
			setLoading(true);
			await fileRef.put(file);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
		setCover(await fileRef.getDownloadURL());
	}

	function handleSubmitProject(data) {
		if (projectDialog.type === 'new') {
			getProject({
				id: FuseUtils.generateGUID(),
				...data,
				activeStatus,
				type: 'projects',
				cover
			});
			closeComposeDialog();
			return;
		}

		getProject({
			id: projectDialog.data.id,
			...data,
			activeStatus,
			type: 'projects',
			cover
		});
		closeComposeDialog();
	}

	function handleRemoveImage() {
		setCover('');
	}

	function handleUploadChange(e) {
		let file = e.target.files[0];
		if (!file) {
			return;
		}

		const src = URL.createObjectURL(file);
		setImage(src);

		setCover(file);
	}

	function handleRemove() {
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...projectDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{projectDialog.type === 'new' ? 'Новый Проект' : 'Изменить Проект'}
					</Typography>
				</Toolbar>
				<div className="flex flex-col items-center justify-center pb-24">
					{projectDialog.type === 'edit' && (
						<Typography variant="h6" color="inherit" className="pt-8">
							{/* {form.firstName} */}
						</Typography>
					)}
				</div>
			</AppBar>
			<form noValidate className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<TextField
							className="mb-24"
							label="Название проекта"
							autoFocus
							error={errors.title}
							helperText={errors.title && errors.title.message}
							id="name"
							name="title"
							inputRef={register}
							defaultValue={values ? values.title : ''}
							variant="outlined"
							required
							fullWidth
						/>
					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							id="link"
							name="link"
							label="Ссылка на проект"
							type="text"
							inputRef={register}
							defaultValue={values ? values.link : ''}
							variant="outlined"
							fullWidth
						/>
					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							id="link"
							name="github"
							label="Ссылка на github"
							type="text"
							inputRef={register}
							defaultValue={values ? values.github : ''}
							variant="outlined"
							fullWidth
						/>
					</div>

					<div className="flex">
						<TextField
							id="projectDate"
							className="mb-24"
							label="Начало"
							name="startedAt"
							type="date"
							inputRef={register}
							defaultValue={values ? values.startedAt : ''}
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
							size="medium"
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
								id="endedAt"
								className="mb-24"
								label="Конец"
								name="endedAt"
								type="date"
								inputRef={register}
								defaultValue={values ? values.endedAt : ''}
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								size="medium"
							/>
						</div>
					) : null}

					<div className="flex">
						<TextField
							className="mb-24"
							id="description"
							name="description"
							label="Описание проекта"
							type="text"
							inputRef={register}
							defaultValue={values ? values.description : ''}
							multiline
							rows={5}
							variant="outlined"
							fullWidth
						/>
					</div>

					<div className="flex">
						<FileInput text="Загрузить обложку" id="cover" handleUploadChange={onFileChange} />
						{cover && (
							<>
								<div className="flex items-center justify-center overflow-hidden ml-20 w-1/3 h-80 rounded-8">
									<img className="max-w-none w-auto h-full" src={cover} alt="" />
								</div>

								<Icon className="w-20 h-20 cursor-pointer" color="action" onClick={handleRemoveImage}>
									delete
								</Icon>
							</>
						)}
					</div>
				</DialogContent>

				{projectDialog.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit(handleSubmitProject)}
								type="submit"
								disabled={loading}
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
								disabled={loading}
								onClick={handleSubmit(handleSubmitProject)}
							>
								Save
							</Button>
						</div>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default ProjectDialog;
