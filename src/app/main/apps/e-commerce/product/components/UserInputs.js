import React, { useState, useEffect, useCallback, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@material-ui/core';
import { TimePicker } from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
	inputCol: {
		display: 'flex',
		flexDirection: 'column',
		width: '50%',
		'&:not(:last-child)': {
			marginRight: '20px'
		}
	},
	inputField: {
		'&:not(:last-child)': {
			marginBottom: '20px'
		}
	}
}));

const inputs = [
	{
		id: 'firstName',
		name: 'firstName',
		label: 'Имя',
		type: 'text'
	},
	{
		id: 'lastName',
		name: 'lastName',
		label: 'Фамилия',
		type: 'text'
	},
	{
		id: 'patronymic',
		name: 'patronymic',
		label: 'Отчество',
		type: 'text'
	},
	{
		id: 'birthday',
		name: 'birthday',
		label: 'Дата рождения',
		type: 'date',
		props: {
			InputLabelProps: {
				shrink: true
			}
		}
	},
	{
		id: 'department-select',
		name: 'department',
		label: 'Отдел',
		type: 'select',
		variants: [
			{
				value: 'javascript',
				label: 'JavaScript'
			},
			{
				value: 'python',
				label: 'Python'
			}
		]
	},
	{
		id: 'phone1',
		name: 'phone1',
		label: 'Телефон 1',
		type: 'text'
	},
	{
		id: 'phone2',
		name: 'phone2',
		label: 'Телефон 2',
		type: 'text'
	},
	{
		id: 'phone2',
		name: 'phone2',
		label: 'Телефон 2',
		type: 'text'
	},
	{
		id: 'dueTime',
		name: 'dueTime',
		label: 'Время прихода',
		type: 'date'
	},
	{
		id: 'email',
		name: 'email',
		label: 'Email',
		type: 'text'
	},
	{
		id: 'adress',
		name: 'adress',
		label: 'Адрес',
		type: 'text'
	},
	{
		id: 'team',
		name: 'team',
		label: 'Команда',
		type: 'text'
	},
	{
		id: 'teamLeader',
		name: 'teamLeader',
		label: 'Тимлид',
		type: 'text'
	},
	{
		id: 'passportId',
		name: 'passportId',
		label: 'Паспорт',
		type: 'text'
	},
	{
		id: 'firstDayAtJob',
		name: 'firstDayAtJob',
		label: 'Первый день работы',
		type: 'date',
		props: {
			InputLabelProps: {
				shrink: true
			}
		}
	},
	{
		id: 'maritalStatus',
		name: 'maritalStatus',
		label: 'Cемейное положение',
		type: 'text'
	},
	{
		id: 'rank',
		name: 'rank',
		label: 'Ранг',
		type: 'text'
	}
];

// phone1: '',
// 	phone2: '',
// 	phone3: '',
// 	email: '',
// 	birthday: '',
// 	adress: '',
// 	avatar: '',
// 	department: '',
// 	team: '',
// 	teamLeader: '',
// 	passportId: '',
// 	firstDayAtJob: '',
// 	maritalStatus: '',
// 	rank: '',
// 	bank: '',
// 	creditCardNumber: '',
// 	accountNumber: ''
const handleChange = () => {};

function UserInputs({ values, onChange }) {
	const classes = useStyles();

	// const handleChange = useCallback(
	// 	(e, name = null) => {
	// 		onChange({
	// 			...values,
	// 			[name || e.target.name]: e.target.value
	// 		});
	// 	},
	// 	[values]
	// );

	const formRef = useRef(null);
	const handleSubmit = e => {
		if (e) e.preventDefault();
		if (!formRef?.current?.elements) return;
		const values = {};
		for (let e of formRef?.current?.elements) {
			if (e.tagName === 'INPUT') {
				values[e.name] = e.value;
			}
		}
		onChange(values);
	};

	useEffect(() => {
		// console.log('THIS IS WHEN TAB CHANGES VALUE', editData);
		console.log(values);
	}, [values]);

	return (
		<form onSubmit={handleSubmit} className="w-full flex">
			<div className={classes.inputCol}>
				{inputs.map(item => {
					if (item.type === 'select')
						return (
							<FormControl key={`${item.id}-select`} variant="outlined" className="mb-20" fullWidth>
								<InputLabel htmlFor={item.id} id={item.id + '__label'}>
									{item.label}
								</InputLabel>
								<Select
									input={
										<OutlinedInput
											name={item.name}
											id={item.id}
											labelWidth={'department'.length * 8}
										/>
									}
									defaultValue={values[item.name]}
									onChange={e => handleChange(e, item.name)}
								>
									{item.variants.map(variant => (
										<MenuItem key={`${item.id}-select-item-${variant.value}`} value={variant.value}>
											{variant.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						);

					if (item.type === 'date') {
						return <TimePicker clearable ampm={false} label="24 hours" name={item.name} />;
					}

					return (
						<TextField
							key={`${item.id}-inp`}
							className={classes.inputField}
							defaultValue={values[item.name]}
							onChange={handleChange}
							label={item.label}
							autoFocus
							type={item.type}
							id={item.id}
							name={item.name}
							variant="outlined"
							fullWidth
							{...item.props}
						/>
					);
				})}
			</div>
		</form>
	);
}

export default UserInputs;

/* <TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					// error={form.firstName === ''}
					label="Имя"
					autoFocus
					id="firstName"
					name="firstName"
					// inputRef={register}
					// defaultValue={editData.firstName}
					variant="outlined"
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="lastName"
					name="lastName"
					label="Фамилия"
					type="text"
					// inputRef={register}
					// defaultValue={editData.lastName}
					variant="outlined"
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="patronymic"
					name="patronymic"
					label="Отчество"
					type="text"
					// inputRef={register}
					// defaultValue={editData.patronymic}
					variant="outlined"
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="phone1"
					name="phone1"
					label="Номер телефона 1"
					type="text"
					// inputRef={register}
					// defaultValue={editData.phone1}
					variant="outlined"
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="phone2"
					name="phone2"
					label="Номер телефона 2"
					type="text"
					// inputRef={register}
					// defaultValue={editData.phone2}
					variant="outlined"
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="phone3"
					name="phone3"
					label="Номер телефона 3"
					type="text"
					// inputRef={register}
					// defaultValue={editData.phone3}
					variant="outlined"
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="email"
					name="email"
					label="Email"
					type="text"
					// inputRef={register}
					// defaultValue={editData.email}
					variant="outlined"
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="birthday"
					name="birthday"
					label="Дата рождения"
					type="date"
					// inputRef={register}
					// defaultValue={editData.birthday}
					InputLabelProps={{
						shrink: true
					}}
					variant="outlined"
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="adress"
					name="adress"
					label="Адрес"
					type="text"
					// inputRef={register}
					// defaultValue={editData.address}
					variant="outlined"
					fullWidth
				/>
			</div>

			<div className={classes.inputCol}>
				<FormControl variant="outlined" className="mb-20" fullWidth>
					<InputLabel id="department">Отдел</InputLabel>
					<Select
						input={
							<OutlinedInput
								name="department"
								id="department-select"
								labelWidth={'department'.length * 8}
							/>
						}
						value={select}
						onChange={e => handleChange(e, 'department')}
					>
						<MenuItem value={'javascript'}>JavaScript</MenuItem>
						<MenuItem value={'python'}>Python</MenuItem>
					</Select>
				</FormControl>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="team"
					name="team"
					label="Команда"
					type="text"
					// inputRef={register}
					// defaultValue={editData.team}
					variant="outlined"
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="teamLead"
					name="teamLeader"
					label="Team Lead"
					type="text"
					variant="outlined"
					// inputRef={register}
					// defaultValue={editData.teamLeader}
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="passportId"
					name="passportId"
					label="Пасспорт ID"
					type="text"
					variant="outlined"
					// inputRef={register}
					// defaultValue={editData.passportId}
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="firstDayAtJob"
					name="firstDayAtJob"
					label="Первый день работы"
					type="text"
					variant="outlined"
					// inputRef={register}
					// defaultValue={editData.firstDayAtJob}
					size="medium"
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="maritalStatus"
					name="maritalStatus"
					label="Положение (семейное)"
					type="text"
					variant="outlined"
					// inputRef={register}
					// defaultValue={editData.maritalStatus}
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="rank"
					name="rank"
					label="Ранг"
					type="text"
					variant="outlined"
					// inputRef={register}
					// defaultValue={editData.rank}
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="bank"
					name="bank"
					label="Банк"
					type="text"
					variant="outlined"
					// inputRef={register}
					// defaultValue={editData.bank}
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="creditCardNumber"
					name="creditCardNumber"
					label="Номер кредитной карта"
					type="text"
					variant="outlined"
					// inputRef={register}
					// defaultValue={editData.creditCardNumber}
					fullWidth
				/>

				<TextField
					className={classes.inputField}
					value={values.}
					onChange={handleChange}
					id="accountNumber"
					name="accountNumber"
					label="Лицевой счет"
					type="text"
					variant="outlined"
					// inputRef={register}
					// defaultValue={editData.accountNumber}
					fullWidth
				/> */
