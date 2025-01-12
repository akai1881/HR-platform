import FuseAnimate from '@fuse/core/FuseAnimate';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { Fab } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { openEditDepartmentDialog, openNewDepartmentDialog } from './store/contactsSlice';
import DepartmentDialog from './DepartmentDialog';

const useStyles = makeStyles(theme => ({
	listItem: {
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 40,
		width: 'calc(100% - 16px)',
		borderRadius: '0 20px 20px 0',
		paddingLeft: 24,
		paddingRight: 12,
		'&.active': {
			backgroundColor: theme.palette.secondary.main,
			color: `${theme.palette.secondary.contrastText}!important`,
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: 'inherit'
			}
		},
		'& .list-item-icon': {
			marginRight: 16
		}
	},
	tooltip: {
		width: '30px',
		cursor: 'pointer !important',
		height: '30px',
		pointerEvents: 'auto',
		minHeight: '20px'
	}
}));

function ContactsSidebarContent(props) {
	const departments = useSelector(({ contactsApp }) => contactsApp.contacts.departments);
	const userRole = useSelector(({ auth }) => auth.user.role);
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const history = useHistory();

	const handleRedirect = () => {
		history.push('/apps/employee/set/new');
	};

	const handleEditClick = (e, data) => {
		e.preventDefault();
		e.stopPropagation();

		dispatch(openEditDepartmentDialog(data));
	};

	return (
		<div className="p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4">
			<Paper className="rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
				{userRole == 'admin' ? (
					<>
						<div className="pt-20 pl-20 pr-20">
							<Button
								variant="contained"
								color="primary"
								className="w-full"
								component={Link}
								to={'/apps/employee/set/new'}
							>
								Новый сотрудник
							</Button>
						</div>

						<div className="p-20">
							<Button
								variant="contained"
								color="primary"
								className="w-full"
								onClick={ev => dispatch(openNewDepartmentDialog())}
							>
								Добавить отдел
							</Button>
						</div>
					</>
				) : null}

				<List className="pt-0">
					<ListItem
						button
						component={NavLinkAdapter}
						to="/apps/contacts/all"
						activeClassName="active"
						className={classes.listItem}
					>
						<Icon className="list-item-icon text-16" color="action">
							people
						</Icon>
						<ListItemText className="truncate" primary="Все сотрудники" disableTypography />
					</ListItem>
					{userRole === 'admin' ? (
						<ListItem
							button
							component={NavLinkAdapter}
							to={`/apps/contacts/admin`}
							activeClassName="active"
							className={classes.listItem}
						>
							<Icon className="list-item-icon text-16" color="action">
								admin_panel_settings
							</Icon>
							<ListItemText className="truncate" primary="Администраторы" disableTypography />
						</ListItem>
					) : null}

					{departments &&
						departments.map(dep => (
							<ListItem
								key={`${dep.id}-department`}
								button
								component={NavLinkAdapter}
								to={`/apps/contacts/${dep.id}`}
								activeClassName="active"
								className={classes.listItem}
							>
								<Icon className="list-item-icon text-16" color="action">
									star
								</Icon>
								<ListItemText className="truncate" primary={`${dep.name}`} disableTypography />
								{/* <Fab
									color="secondary"
									aria-label="add"
									onClick={e => handleEditClick(e, { name: dep.name, id: dep.id })}
									className={`absolute right-0 ${classes.tooltip} z-999`}
								>
									<Icon style={{ fontSize: '1.9rem' }}>edit</Icon>
								</Fab> */}
							</ListItem>
						))}
				</List>
			</Paper>
			<DepartmentDialog />
		</div>
	);
}

export default ContactsSidebarContent;
