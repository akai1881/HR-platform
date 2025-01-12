import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { logoutUser } from 'app/auth/store/userSlice';

function UserMenu(props) {
	const dispatch = useDispatch();
	const user = useSelector(({ auth }) => auth.user);
	const userRole = useSelector(({ auth }) => auth.user.role);
	const routeParams = useParams();

	const [userMenu, setUserMenu] = useState(null);

	const userMenuClick = event => {
		setUserMenu(event.currentTarget);
	};

	React.useEffect(() => {
		console.log(user.avatarFile);
	}, []);

	const userMenuClose = () => {
		setUserMenu(null);
	};

	return (
		<>
			<Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={userMenuClick}>
				<div className="hidden md:flex flex-col mx-4 items-end">
					<Typography component="span" className="normal-case font-bold flex">
						{user.firstName} {user.lastName}
					</Typography>
					<Typography className="text-11 capitalize" color="textSecondary">
						{user.role.toString()}
						{(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
					</Typography>
				</div>

				{user.data.photoURL && user.role === 'admin' ? (
					<Avatar
						className="md:mx-4"
						alt="user photo"
						className="bg-transparent border-1 border-gray-50 w-60 h-60 p-1"
					>
						<img src={user.avatarFile} className="" alt="" />
					</Avatar>
				) : (
					<Avatar className="md:mx-4">
						<img src={user.avatarFile} alt="" />
					</Avatar>
				)}
			</Button>

			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>
				{!user.role || user.role.length === 0 ? (
					<>
						<MenuItem component={Link} to="/login" role="button">
							<ListItemIcon className="min-w-40">
								<Icon>lock</Icon>
							</ListItemIcon>
							<ListItemText primary="Login" />
						</MenuItem>
						<MenuItem component={Link} to="/register" role="button">
							<ListItemIcon className="min-w-40">
								<Icon>person_add</Icon>
							</ListItemIcon>
							<ListItemText primary="Register" />
						</MenuItem>
					</>
				) : (
					<>
						<MenuItem
							component={Link}
							to={`/pages/profile/${user.uid}`}
							onClick={userMenuClose}
							role="button"
						>
							<ListItemIcon className="min-w-40">
								<Icon>account_circle</Icon>
							</ListItemIcon>
							<ListItemText primary="Мой профиль" />
						</MenuItem>

						<MenuItem
							onClick={() => {
								dispatch(logoutUser());
								userMenuClose();
							}}
						>
							<ListItemIcon className="min-w-40">
								<Icon>exit_to_app</Icon>
							</ListItemIcon>
							<ListItemText primary="Выйти" />
						</MenuItem>
					</>
				)}
			</Popover>
		</>
	);
}

export default UserMenu;
