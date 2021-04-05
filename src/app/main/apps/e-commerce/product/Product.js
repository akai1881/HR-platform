import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageCarded from '@fuse/core/FusePageCarded';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import orange from '@material-ui/core/colors/orange';
import Icon from '@material-ui/core/Icon';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { defaultValues } from 'app/main/apps/e-commerce/product/constants';
import { registerUser, getUserData, editUserData, setToNull } from '../store/productSlice';
import reducer from '../store';
import Avatar from '@material-ui/core/Avatar';
import ProjectDialog from './ProjectDialog';
import CareerDialog from './CareerDialog';
import FileInput from './components/FileInput';
import TestUserInputs from './components/TestUserInputs';
import blankAvatar from 'assets/blankAvatar.png';
import firebaseServices from 'app/services/firebaseService/firebaseService';
import { getDepartments } from 'app/main/apps/contacts/store/contactsSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
import CareerTab from './tabs/CareerTab';
import ProjectTab from './tabs/ProjectTab';
import FuseUtils from '@fuse/utils';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Skeleton } from '@material-ui/lab';
import { firstColumn } from './constants';

const useStyles = makeStyles(theme => ({
	inputWrapper: {
		display: 'flex'
	},
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
			marginBottom: '10px'
		}
	},
	imageContainer: {
		marginRight: '20px',
		'& div': {
			position: 'sticky',
			top: '0px'
		}
	},
	skeletonLoader: {
		width: '100%',
		'&:not(:last-child)': {
			marginBottom: '20px'
		}
	},
	imagePreview: {
		width: '200px',
		height: '200px',
		padding: '20px',
		border: '1px solid #d8d8d8',
		borderRadius: '5px',
		position: 'relative'
	},
	imageDelete: {
		display: 'block',
		position: 'absolute',
		right: '10px',
		top: '5px',
		cursor: 'pointer',
		transition: '0.3s linear',
		'&:hover': {
			color: 'red'
		}
	},
	imageNone: {
		display: 'none'
	},
	productImageFeaturedStar: {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},
	productImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		border: '1px solid rgba(0, 0, 0, 0.23)'
	},
	productImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& $productImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& $productImageFeaturedStar': {
				opacity: 1
			},
			'&:hover $productImageFeaturedStar': {
				opacity: 1
			}
		}
	},
	root: {
		maxWidth: 345
	},
	media: {
		height: 140
	}
}));

// password: Yup.string().min(8, 'Минимальная длинна 8 символов').required('Это обязательное поле'),
// role: Yup.string().required('Выберите роль')

// password: Yup.string().when('$exists', {
// 	is: exist => exist,
// 	then: Yup.string().min(8, 'Минимальная длинна 8 символов').required('Это обязательное поле'),
// 	otherwise: Yup.string()
// }),
// role: Yup.string().when('$exists', {
// 	is: exist => exist,
// 	then: Yup.string().required('Это обязательное поле'),
// 	otherwise: Yup.string()
// })

// password: Yup.string().when('role', {
// 	is: exist => !exist,
// 	then: Yup.string().min(8, 'Минимальная длинна 8 символов').required('Это обязательное поле'),
// 	otherwise: Yup.string()
// }),
// role: Yup.string().when('password', {
// 	is: exist => !exist,
// 	then: Yup.string().required('Это обязательное поле'),
// 	otherwise: Yup.string()
// })
// }[['role', 'password']]

const schema = Yup.object().shape({
	firstName: Yup.string().required('Это обязательное поле'),
	lastName: Yup.string().required('Это обязательное поле'),
	email: Yup.string().email('Введите валидный email').required('Это обязательное поле'),
	phone1: Yup.number()
		.typeError('Поле должно содержать только числа')
		.positive('Поле должно содержать только положительные числа')
		.required('Это обязательное поле')
});

function Product(props) {
	const routeParams = useParams();
	const { userId } = routeParams;

	const dispatch = useDispatch();
	const user = useSelector(({ eCommerceApp }) => eCommerceApp.product.user);
	const loader = useSelector(({ eCommerceApp }) => eCommerceApp.product.loading);
	const departments = useSelector(({ eCommerceApp }) => eCommerceApp.contacts.departments);
	const theme = useTheme();
	const [selectedDate, handleDateChange] = useState(new Date());
	const classes = useStyles(props);

	const [tabValue, setTabValue] = useState(0);
	const [image, setImage] = useState('');
	const { register, handleSubmit, control, errors } = useForm({
		resolver: yupResolver(schema)
	});
	const [avatarFile, setAvatarFile] = useState(blankAvatar);
	const [projects, setProjects] = useState(null);
	const [loadingData, setLoadingData] = useState(false);
	const [career, setCareer] = useState(null);
	const [role, setRole] = useState(null);
	const [userDepartment, setUserDepartment] = useState(null);
	const [savedValues, setSavedValues] = useState(null);
	const [loading, setLoading] = useState(false);
	const history = useHistory();

	useEffect(() => {
		dispatch(getDepartments());
		if (userId === 'new') {
			// if (userId === 'new' && authedUser.role !== 'admin') {
			// 	history.push('/apps/contacts/all');
			// 	return;
			// }
			console.log('THIS IS DEFAULT VALUES when data is new', savedValues);
			setSavedValues(defaultValues);
			setProjects(defaultValues.projects);
			setCareer(defaultValues.career);
			setAvatarFile(defaultValues.avatarFile);
			setUserDepartment('');
			setLoadingData(false);
		} else {
			console.log('THIS IS DEFAULT VALUES when data exists', savedValues);
			dispatch(getUserData(userId));
		}
	}, [routeParams, dispatch]);

	useEffect(() => {
		if (user && !loader && user.id == userId) {
			// if (userId !== authedUser.id) {
			// 	history.push('/apps/contacts/all');
			// 	return;
			// }
			console.log('THIS IS USER DATA FROM STORE', user);
			setSavedValues(user);
			setProjects(user.projects);
			setCareer(user.career);
			handleDateChange(user.dueTime);
			setAvatarFile(user.avatarFile);
			console.log('THIS IS LOADER', loader);
			setUserDepartment(user.department);
		}

		return () => dispatch(setToNull());
	}, [user, userId, loader]);

	function handleChangeTab(event, value) {
		setTabValue(value);
		console.log('TAB CHANGED VALUE', value);
	}

	function addUser(data) {
		const userData = {
			...data,
			avatarFile,
			dueTime: new Date(selectedDate),
			department: {
				id: userDepartment.id,
				name: userDepartment.name
			},
			uid: FuseUtils.generateGUID(),
			projects,
			career
		};
		console.log('THIS IS ADD USER', userData);
		// dispatch(registerUser(userData));
		// history.push('/apps/contacts/all');
	}

	async function editUser(data) {
		// console.log(selectedDate.toLocaleTimeString());
		const userData = {
			...data,
			avatarFile,
			dueTime: new Date(selectedDate),
			department: {
				id: userDepartment.id,
				name: userDepartment.name
			},
			id: savedValues.id,
			projects,
			career
		};

		console.log('THIS IS DATA', userData);
		await dispatch(editUserData(userData));
		await history.push('/apps/contacts/all');
	}

	function handleRemoveImage() {
		setImage('');
	}

	async function handleUploadPhoto(e) {
		const file = e.target.files[0];
		if (!file) {
			return;
		}
		const storageRef = firebaseServices.storage.ref();
		const fileRef = storageRef.child(file.name);
		try {
			setLoading(true);
			await fileRef.put(file);
			setAvatarFile(await fileRef.getDownloadURL());
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
			console.log('LOADING', loading);
		}
	}

	function handleUserCareerOrProfile(data) {
		const array = data.type === 'projects' ? projects : career;
		const foundIndex = array.findIndex(item => item.id === data.id);
		if (data.type === 'projects') {
			if (foundIndex !== -1) {
				const updatedArr = [...array];
				updatedArr[foundIndex] = data;
				setProjects(updatedArr);
				return;
			}
			setProjects(prev => [...prev, data]);
			return;
		}

		//This is for career array
		if (foundIndex !== -1) {
			const updatedArr = [...array];
			updatedArr[foundIndex] = data;
			setCareer(updatedArr);
			return;
		}
		setCareer(prev => [...prev, data]);
	}

	function handleDeleteCareerOrProject(data) {
		if (data.type === 'projects') {
			const newProjects = projects.filter(item => item.id !== data.id);
			setProjects(newProjects);
			return;
		}

		// This is for career
		const newCareer = career.filter(item => item.id !== data.id);
		setCareer(newCareer);
	}

	// if (userId === 'new' && authedUser.role !== 'admin') {
	// 	history.push('/apps/contacts/all');
	// }

	// if (loader) return <FuseLoading />;

	return (
		<FusePageCarded
			classes={{
				toolbar: 'p-0',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				savedValues && (
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/apps/contacts/all"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Сотрудники</span>
								</Typography>
							</FuseAnimate>
						</div>
						<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Typography className="text-16 sm:text-20 truncate">
									{savedValues.firstName !== ''
										? `${savedValues.firstName} ${savedValues.lastName}`
										: 'Новый сотрудник'}
								</Typography>
							</FuseAnimate>
						</div>
						{userId === 'new' ? (
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap normal-case"
									variant="contained"
									color="secondary"
									// disabled={!canBeSubmitted()}
									// onClick={() => dispatch(saveProduct(form))}
									onClick={handleSubmit(addUser)}
								>
									Добавить сотрудника
								</Button>
							</FuseAnimate>
						) : (
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap normal-case"
									variant="contained"
									color="secondary"
									// disabled={!canBeSubmitted()}
									// onClick={() => dispatch(saveProduct(form))}
									onClick={handleSubmit(editUser)}
								>
									Сохранить изменения
								</Button>
							</FuseAnimate>
						)}
					</div>
				)
			}
			contentToolbar={
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					classes={{ root: 'w-full h-64' }}
				>
					<Tab className="h-64 normal-case" label="Основная информация" />
					<Tab className="h-64 normal-case" label="Проекты" />
					<Tab className="h-64 normal-case" label="Карьера" />
				</Tabs>
			}
			content={
				savedValues ? (
					<div className="p-16 sm:p-24 max-w-full">
						<ProjectDialog getProject={handleUserCareerOrProfile} projects={projects} />
						<CareerDialog getCareer={handleUserCareerOrProfile} />
						{
							<div style={{ display: tabValue === 0 ? 'flex' : 'none' }} className={classes.inputWrapper}>
								<div className={classes.imageContainer}>
									<div>
										<div className={classes.imagePreview}>
											<Icon
												className={!image ? classes.imageNone : classes.imageDelete}
												color="action"
												onClick={handleRemoveImage}
											>
												delete
											</Icon>
											{loading ? (
												<div className="w-full h-full flex justify-center items-center">
													<CircularProgress />
												</div>
											) : (
												<Avatar className="w-full h-full" src={avatarFile} />
											)}
										</div>
										<FileInput
											text="Загрузить фотографию"
											id="img"
											classProp="10px"
											handleUploadChange={handleUploadPhoto}
										/>
									</div>
								</div>
								{departments.length > 0 ? (
									<TestUserInputs
										register={register}
										values={savedValues.firstName !== '' ? savedValues : ''}
										setDepartment={setUserDepartment}
										params={userId}
										control={control}
										selectedDate={selectedDate}
										handleDateChange={handleDateChange}
										departments={departments}
										errors={errors}
									/>
								) : null}
							</div>
						}
						{tabValue === 1 && (
							<>
								{projects && (
									<ProjectTab projects={projects} deleteProject={handleDeleteCareerOrProject} />
								)}
							</>
						)}
						{tabValue === 2 && (
							<>{career && <CareerTab career={career} deleteCareer={handleDeleteCareerOrProject} />}</>
						)}
					</div>
				) : (
					<div className="p-16 sm:p-24 max-w-full">
						{
							<div style={{ display: tabValue === 0 ? 'flex' : 'none' }} className={classes.inputWrapper}>
								<div className={classes.imageContainer}>
									<Skeleton variant="rect" width={200} height={200} animation="wave" />
								</div>
								<div className="flex flex-col w-1/3 mr-20">
									{firstColumn.map(item => (
										<Skeleton
											variant="rect"
											key={`${item.name}-${item.id}`}
											width="100%"
											height={50}
											className="mb-20"
											animation="wave"
										/>
									))}
								</div>
								<div className="flex flex-col w-1/3">
									{firstColumn.map(item => (
										<Skeleton
											variant="rect"
											key={`${item.name}-${item.id}`}
											width="100%"
											height={50}
											className="mb-20"
											animation="wave"
										/>
									))}
								</div>
							</div>
						}
					</div>
				)
			}
			innerScroll
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(Product);
