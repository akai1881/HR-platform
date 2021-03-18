import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from 'react';
import withReducer from 'app/store/withReducer';
import reducer from 'app/main/apps/e-commerce/store';
import AboutTab from './tabs/AboutTab';
import ProjectsTab from './tabs/ProjectsTab';
import PhotosVideosTab from './tabs/PhotosVideosTab';
import TimelineTab from './tabs/TimelineTab';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from 'app/main/apps/e-commerce/store/productSlice';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import FuseLoading from '@fuse/core/FuseLoading';

const useStyles = makeStyles(theme => ({
	layoutHeader: {
		height: 320,
		minHeight: 320,
		[theme.breakpoints.down('md')]: {
			height: 240,
			minHeight: 240
		}
	}
}));

function ProfilePage() {
	const classes = useStyles();
	const userData = useSelector(({ eCommerceApp }) => eCommerceApp.product.user);
	const authedUser = useSelector(({ auth }) => auth.user);
	const theme = useTheme();
	const [selectedTab, setSelectedTab] = useState(0);
	const dispatch = useDispatch();
	const params = useParams();
	const history = useHistory();
	const [user, setUser] = useState(null);

	const { profileId } = params;

	useEffect(() => {
		dispatch(getUserData(profileId));
	}, [params, dispatch]);

	useEffect(() => {
		setUser(userData);
	}, [userData]);

	function handleTabChange(event, value) {
		setSelectedTab(value);
	}

	if (!user) {
		return <FuseLoading />;
	}

	if (user.id !== profileId) {
		return <FuseLoading />;
	}

	const { projects } = user;

	return (
		user && (
			<FusePageSimple
				classes={{
					header: classes.layoutHeader,
					toolbar: 'px-16 sm:px-24'
				}}
				header={
					<div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
						<div
							style={{ height: '70%' }}
							className="flex flex-1 flex-col items-center justify-center md:flex-col md:items-start md:justify-between h-2/3"
						>
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									role="button"
									color="inherit"
									onClick={() => history.goBack()}
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Назад</span>
								</Typography>
							</FuseAnimate>
							<div className="flex flex-row items-end">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									<Avatar className="w-96 h-96" src={user.avatarFile} />
								</FuseAnimate>
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography
										className="md:mx-24 text-24 md:text-32 my-8 md:my-0"
										variant="h4"
										color="inherit"
									>
										{`${user.lastName} ${user.firstName}`}
									</Typography>
								</FuseAnimate>
							</div>
						</div>

						{authedUser.uid === profileId || authedUser.role === 'admin' ? (
							<div className="flex items-center justify-end">
								<Button
									className="normal-case"
									variant="contained"
									color="primary"
									component={Link}
									to={`/apps/employee/set/${user.id}`}
									aria-label="Send Message"
								>
									<Icon color="inherit" className="mr-5">
										edit
									</Icon>
									Изменить данные
								</Button>
							</div>
						) : null}
					</div>
				}
				contentToolbar={
					<Tabs
						value={selectedTab}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="off"
						classes={{
							root: 'h-64 w-full'
						}}
					>
						<Tab
							classes={{
								root: 'h-64'
							}}
							label="Информаци о сотруднике"
						/>
						<Tab
							classes={{
								root: 'h-64'
							}}
							label="Проекты"
						/>
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24">
						{selectedTab === 0 && <AboutTab user={user} authedUser={authedUser} profileId={profileId} />}
						{selectedTab === 1 && <ProjectsTab projects={projects} />}
					</div>
				}
			/>
		)
	);
}

export default withReducer('eCommerceApp', reducer)(ProfilePage);
