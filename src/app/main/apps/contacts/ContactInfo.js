import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useForm, useDeepCompareEffect } from '@fuse/hooks';
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import { orange } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { saveProduct, newProduct, getProduct } from '../store/productSlice';
import reducer from '../store';

const useStyles = makeStyles(theme => ({
	inputWrapper: {
		display: 'flex',
		justifyContent: 'space-between'
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
			marginBottom: '20px'
		}
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
		transitionTimingFunction: theme.transitions.easing.easeInOut
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
	}
}));

function Product(props) {
	const dispatch = useDispatch();
	const product = useSelector(({ eCommerceApp }) => eCommerceApp.product);
	const theme = useTheme();

	const classes = useStyles(props);
	const [tabValue, setTabValue] = useState(0);
	const { form, handleChange, setForm } = useForm(null);
	const routeParams = useParams();

	useDeepCompareEffect(() => {
		function updateProductState() {
			const { productId } = routeParams;

			if (productId === 'new') {
				dispatch(newProduct());
			} else {
				dispatch(getProduct(routeParams));
			}
		}

		updateProductState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if ((product && !form) || (product && form && product.id !== form.id)) {
			setForm(product);
		}
	}, [form, product, setForm]);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	function handleChipChange(value, name) {
		setForm(
			_.set(
				{ ...form },
				name,
				value.map(item => item.value)
			)
		);
	}

	function setFeaturedImage(id) {
		setForm(_.set({ ...form }, 'featuredImageId', id));
	}

	function handleUploadChange(e) {
		const file = e.target.files[0];
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = () => {
			setForm(
				_.set({ ...form }, `images`, [
					{
						id: FuseUtils.generateGUID(),
						url: `data:${file.type};base64,${btoa(reader.result)}`,
						type: 'image'
					},
					...form.images
				])
			);
		};

		reader.onerror = () => {
			console.log('error on load image');
		};
	}

	function canBeSubmitted() {
		return form.name.length > 0 && !_.isEqual(product, form);
	}

	if ((!product || (product && routeParams.productId !== product.id)) && routeParams.productId !== 'new') {
		return <FuseLoading />;
	}

	return (
		<FusePageCarded
			classes={{
				toolbar: 'p-0',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				form && (
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

							<div className="flex items-center max-w-full">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									{form.images.length > 0 && form.featuredImageId ? (
										<img
											className="w-32 sm:w-48 rounded"
											src={_.find(form.images, { id: form.featuredImageId }).url}
											alt={form.name}
										/>
									) : (
										<img
											className="w-32 sm:w-48 rounded"
											src="assets/images/ecommerce/product-image-placeholder.png"
											alt={form.name}
										/>
									)}
								</FuseAnimate>
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'Новый сотрудник'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Информация о сотруднике</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button
								className="whitespace-no-wrap normal-case"
								variant="contained"
								color="secondary"
								disabled={!canBeSubmitted()}
								onClick={() => dispatch(saveProduct(form))}
							>
								Save
							</Button>
						</FuseAnimate>
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
					<Tab className="h-64 normal-case" label="Inventory" />
					<Tab className="h-64 normal-case" label="Shipping" />
				</Tabs>
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
						{tabValue === 0 && (
							<div className={classes.inputWrapper}>
								<div className={classes.inputCol}>
									<TextField
										className={classes.inputField}
										error={form.name === ''}
										required
										label="Имя"
										autoFocus
										id="name"
										name="name"
										value={form.name}
										onChange={handleChange}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										required
										onChange={handleChange}
										label="Фамилия"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Отчество"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										required
										onChange={handleChange}
										label="Номер телефона 1"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Номер телефона 2"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Номер телефона 3"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Email"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Дата рождения"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Адрес"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Фотография"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>
								</div>
								<div className={classes.inputCol}>
									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Отдел"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Команда"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Team Lead"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Пасспорт ID"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Первый день работы"
										type="text"
										value={form.description}
										variant="outlined"
										size="medium"
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Положение (женат/замужем/холос)"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Ранг"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Банк"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Номер кредитной карта"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className={classes.inputField}
										id="description"
										name="description"
										onChange={handleChange}
										label="Лицевой счет"
										type="text"
										value={form.description}
										variant="outlined"
										fullWidth
									/>
								</div>
								{/* <FuseChipSelect
									className="mt-8 mb-24"
									value={form.categories.map(item => ({
										value: item,
										label: item
									}))}
									onChange={value => handleChipChange(value, 'categories')}
									placeholder="Select multiple categories"
									textFieldProps={{
										label: 'Categories',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									isMulti
								/>

								<FuseChipSelect
									
									value={form.tags.map(item => ({
										value: item,
										label: item
									}))}
									onChange={value => handleChipChange(value, 'tags')}
									placeholder="Select multiple tags"
									textFieldProps={{
										label: 'Tags',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									isMulti
								/> */}
							</div>
						)}
						{tabValue === 1 && (
							<div>
								<div className="flex justify-center sm:justify-start flex-wrap -mx-8">
									<label
										htmlFor="button-file"
										className={clsx(
											classes.productImageUpload,
											'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
										)}
									>
										<input
											accept="image/*"
											className="hidden"
											id="button-file"
											type="file"
											onChange={handleUploadChange}
										/>
										<Icon fontSize="large" color="action">
											cloud_upload
										</Icon>
									</label>
									{form.images.map(media => (
										<div
											onClick={() => setFeaturedImage(media.id)}
											onKeyDown={() => setFeaturedImage(media.id)}
											role="button"
											tabIndex={0}
											className={clsx(
												classes.productImageItem,
												'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5',
												media.id === form.featuredImageId && 'featured'
											)}
											key={media.id}
										>
											<Icon className={classes.productImageFeaturedStar}>star</Icon>
											<img className="max-w-none w-auto h-full" src={media.url} alt="product" />
										</div>
									))}
								</div>
							</div>
						)}
						{tabValue === 2 && (
							<div>
								<TextField
									className="mt-8 mb-16"
									label="Tax Excluded Price"
									id="priceTaxExcl"
									name="priceTaxExcl"
									value={form.priceTaxExcl}
									onChange={handleChange}
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>
									}}
									type="number"
									variant="outlined"
									autoFocus
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									label="Tax Included Price"
									id="priceTaxIncl"
									name="priceTaxIncl"
									value={form.priceTaxIncl}
									onChange={handleChange}
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>
									}}
									type="number"
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									label="Tax Rate"
									id="taxRate"
									name="taxRate"
									value={form.taxRate}
									onChange={handleChange}
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>
									}}
									type="number"
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									label="Compared Price"
									id="comparedPrice"
									name="comparedPrice"
									value={form.comparedPrice}
									onChange={handleChange}
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>
									}}
									type="number"
									variant="outlined"
									fullWidth
									helperText="Add a compare price to show next to the real price"
								/>
							</div>
						)}
						{tabValue === 3 && (
							<div>
								<TextField
									className="mt-8 mb-16"
									required
									label="SKU"
									autoFocus
									id="sku"
									name="sku"
									value={form.sku}
									onChange={handleChange}
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									label="Quantity"
									id="quantity"
									name="quantity"
									value={form.quantity}
									onChange={handleChange}
									variant="outlined"
									type="number"
									fullWidth
								/>
							</div>
						)}
						{tabValue === 4 && (
							<div>
								<div className="flex -mx-4">
									<TextField
										className="mt-8 mb-16 mx-4"
										label="Width"
										autoFocus
										id="width"
										name="width"
										value={form.width}
										onChange={handleChange}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className="mt-8 mb-16 mx-4"
										label="Height"
										id="height"
										name="height"
										value={form.height}
										onChange={handleChange}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className="mt-8 mb-16 mx-4"
										label="Depth"
										id="depth"
										name="depth"
										value={form.depth}
										onChange={handleChange}
										variant="outlined"
										fullWidth
									/>
								</div>

								<TextField
									className="mt-8 mb-16"
									label="Weight"
									id="weight"
									name="weight"
									value={form.weight}
									onChange={handleChange}
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									label="Extra Shipping Fee"
									id="extraShippingFee"
									name="extraShippingFee"
									value={form.extraShippingFee}
									onChange={handleChange}
									variant="outlined"
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>
									}}
									fullWidth
								/>
							</div>
						)}
					</div>
				)
			}
			innerScroll
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(Product);
react