import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import ContactsMultiSelectMenu from './ContactsMultiSelectMenu';
import ContactsTable from './ContactsTable';
import { closeDialog, openDialog } from 'app/store/fuse/dialogSlice';
import { Button, DialogActions, DialogTitle } from '@material-ui/core';

import { selectContacts, deleteUser } from './store/contactsSlice';

function ContactsList(props) {
	const userRole = useSelector(({ auth }) => auth.user.role);
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const usersData = useSelector(({ contactsApp }) => contactsApp.contacts.users);
	const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
	const user = useSelector(({ contactsApp }) => contactsApp.user);
	const [filteredData, setFilteredData] = useState(null);
	const params = useParams();
	const history = useHistory();
	const [data, setData] = useState(null);

	const handleRedirectEdit = profile => {
		history.push(`/apps/employee/set/${profile.id}`);
	};

	React.useEffect(() => {
		console.log(usersData);
	}, [usersData]);

	const handleDeleteUser = config => {
		dispatch(
			openDialog({
				children: (
					<>
						<DialogTitle id="alert-dialog-title">Вы уверены, что хотите удалить сотрудника?</DialogTitle>
						<DialogActions>
							<Button onClick={() => dispatch(closeDialog())} color="primary">
								Нет, отменить
							</Button>
							<Button
								onClick={() => {
									dispatch(closeDialog());
									dispatch(deleteUser(config));
								}}
								color="primary"
								autoFocus
							>
								Да, я уверен
							</Button>
						</DialogActions>
					</>
				)
			})
		);
	};

	const columns = React.useMemo(
		() => [
			{
				accessor: 'avatar',
				Cell: ({ row }) => {
					return <Avatar className="mx-8" alt={row.original.firstName} src={row.original.avatarFile} />;
				},
				className: 'justify-center',
				width: 64,
				sortable: false
			},
			{
				Header: 'Имя',
				accessor: 'firstName',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Фамилия',
				accessor: 'lastName',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Отдел',
				accessor: 'department.name',
				sortable: true
			},
			{
				Header: 'Почта',
				accessor: 'email',
				sortable: true
			},
			{
				Header: 'Номер телефона',
				accessor: 'phone1',
				sortable: true
			},
			{
				Header: 'Роль',
				accessor: 'role',
				sortable: true
			},
			{
				id: 'action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{userRole == 'admin' ? (
							<>
								<IconButton
									onClick={ev => {
										ev.stopPropagation();
										handleRedirectEdit(row.original);
									}}
								>
									<Icon>edit</Icon>
								</IconButton>
								<IconButton
									onClick={ev => {
										ev.stopPropagation();
										handleDeleteUser({ id: row.original.id, params });
									}}
								>
									<Icon>delete</Icon>
								</IconButton>
							</>
						) : null}
					</div>
				)
			}
		],
		[dispatch, user.starred]
	);

	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			if (_searchText.length === 0) {
				return contacts;
			}
			return FuseUtils.filterArrayByString(contacts, _searchText);
		}

		if (contacts) {
			setFilteredData(getFilteredArray(contacts, searchText));
		}
	}, [contacts, searchText]);

	if (!filteredData) {
		return null;
	}

	const handleRedirectToProfile = id => {
		history.push(`/pages/profile/${id}`);
	};

	// usersData.length === 0

	if (usersData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					Сотрудники отсутвуют
				</Typography>
			</div>
		);
	}

	return (
		<ContactsTable
			columns={columns}
			data={usersData}
			onRowClick={(ev, row) => {
				if (row) {
					handleRedirectToProfile(row.original.id);
				}
			}}
		/>
	);
}

export default ContactsList;
