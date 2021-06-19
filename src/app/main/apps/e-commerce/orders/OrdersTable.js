import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import OrdersStatus from '../order/OrdersStatus';
import { changeUserStatus, getUsersData } from '../store/ordersSlice';
import OrdersTableHead from './OrdersTableHead';
import { DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@material-ui/core';
import { getDepartments } from '../../contacts/store/contactsSlice';
import { closeDialog, openDialog } from '../../../../store/fuse/dialogSlice';
import DialogContentText from '@material-ui/core/DialogContentText';
import { openEditTimeDialog, closeEditTimeDialog } from '../store/ordersSlice';

import Button from '@material-ui/core/Button';

function OrdersTable(props) {
	const dispatch = useDispatch();
	const orders = useSelector(({ eCommerceApp }) => eCommerceApp.orders.users);
	const { dayId } = useParams();
	const departments = useSelector(({ eCommerceApp }) => eCommerceApp.contacts.departments);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState([]);
	const [users, setUsers] = useState(null);
	const [page, setPage] = useState(0);
	const [time, setTime] = useState(new Date());
	const [anchorEl, setAnchorEl] = useState(null);
	const [anchorEl2, setAnchorEl2] = useState(null);
	const [filteredData, setFilteredData] = useState(null);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [id, setId] = useState('');
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});

	useEffect(() => {
		// dispatch(getOrders()).then(() => setLoading(false));
		dispatch(getUsersData(dayId));
		dispatch(getDepartments());
	}, [dispatch]);

	useEffect(() => {
		// if (searchText.length !== 0) {
		// 	setData(FuseUtils.filterArrayByString(orders, searchText));
		// 	setPage(0);
		// } else {
		// }
		if (orders.length > 0) {
			setLoading(false);
			setFilteredData(orders);
		}
		console.log('this is orders', orders);
	}, [orders]);

	function handleClick(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}

	function handleClose2() {
		setAnchorEl2(null);
	}

	function filterByDepartment(event) {
		const { name } = event.target.dataset;

		if (name === 'all') {
			setFilteredData(orders);
			handleClose();
			return;
		}

		const data = orders.filter(item => item.department === name);
		setFilteredData(data);
		handleClose();
	}

	function handleRequestSort(event, property) {
		console.log(event, property);
		const id = property;

		if (property === 'department') {
			setAnchorEl(event.currentTarget);
			return;
		}

		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	function formatTimes(date) {
		return new Date(date).toLocaleTimeString();
	}

	function handleRedirect(id) {
		props.history.push(`/pages/profile/${id}`);
	}

	function getUserShiftStatus(user) {
		console.log(user);
		if (!user.hasScanned) {
			return 'Не сканировал(а)';
		}

		if (user.isLate) {
			return 'Опоздал(а)';
		}

		return 'Во время';
	}

	function handleCheck(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	function handleClickStatus(e, id) {
		e.stopPropagation();
		setId(id);
		setAnchorEl2(e.currentTarget);
	}

	function changeStatus(e) {
		const data = e.target.dataset.name;

	}

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<div className='w-full flex flex-col'>
			<FuseScrollbars className='flex-grow overflow-x-auto'>
				<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
					<MenuItem onClick={filterByDepartment} data-name='all'>
						Все
					</MenuItem>
					{departments &&
					departments.map(department => (
						<MenuItem onClick={filterByDepartment} data-name={department.name} key={department.id}>
							{department.name}
						</MenuItem>
					))}
				</Menu>
				<Menu
					id='simple-men2'
					anchorEl={anchorEl2}
					keepMounted
					open={Boolean(anchorEl2)}
					onClose={handleClose2}
				>
					<MenuItem onClick={changeStatus} name='false' data-name='false'>
						Во время
					</MenuItem>
					<MenuItem onClick={changeStatus} name='true' data-name='true'>
						Опоздал
					</MenuItem>
				</Menu>
				{orders.length > 0 ? (
					<Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
						<OrdersTableHead
							numSelected={selected.length}
							order={order}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={orders.length}
						/>

						<TableBody>
							{_.orderBy(
								filteredData,
								[
									o => {
										switch (order.id) {
											case 'hasScanned': {
												return o.hasScanned;
											}
											default: {
												return o[order.id];
											}
										}
									}
								],
								[order.direction]
							).map(n => {
								const isSelected = selected.indexOf(n.id) !== -1;
								// console.log(n.firstName);
								return (
									<TableRow
										className='h-64 cursor-pointer'
										hover
										role='checkbox'
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										onClick={() => handleRedirect(n.id)}
									>
										<TableCell className='p-4 md:p-16' component='th' scope='row'>
											{n.firstName} {n.lastName}
										</TableCell>

										<TableCell className='p-4 md:p-16' component='th' scope='row'>
											{n.phone}
										</TableCell>

										<TableCell className='p-4 md:p-16' component='th' scope='row'>
											{n.department}
										</TableCell>

										<TableCell
											className='p-4 md:p-16'
											component='th'
											scope='row'
											data-value={n.id}
											onClick={e => handleClickStatus(e, n.id)}
										>
											<OrdersStatus name={getUserShiftStatus(n)} />
											{!!n.minutesLate && ` на ${n.minutesLate} мин.`}
										</TableCell>

										<TableCell className='p-4 md:p-16' component='th' scope='row'>
											{n.date}
										</TableCell>

										<TableCell className='p-4 md:p-16' component='th' scope='row'>
											{n.dueTime}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				) : null}
			</FuseScrollbars>

			<TablePagination
				className='flex-shrink-0 border-t-1'
				component='div'
				count={orders.length}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label': 'Previous Page'
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page'
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	);
}

export default withRouter(OrdersTable);

// {filteredData.length > 0 ? filteredData.map(n => {
//   const isSelected = selected.indexOf(n.id) !== -1;
//   console.log(n.firstName);
//   return (
//     <TableRow
//       className="h-64 cursor-pointer"
//       hover
//       role="checkbox"
//       aria-checked={isSelected}
//       tabIndex={-1}
//       key={n.id}
//       selected={isSelected}
//       onClick={event => handleRedirect(n)}
//     >
//       <TableCell className="p-4 md:p-16" component="th" scope="row">
//         {n.firstName} {n.lastName}
//       </TableCell>
//
//       {/* <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
// 											{n.lastName}
// 										</TableCell> */}
//
//       <TableCell className="p-4 md:p-16" component="th" scope="row">
//         {n.phone}
//       </TableCell>
//
//       <TableCell className="p-4 md:p-16" component="th" scope="row">
//         {n.department}
//       </TableCell>
//
//       <TableCell className="p-4 md:p-16" component="th" scope="row">
//         <OrdersStatus name={n.isLate}/>
//       </TableCell>
//
//       <TableCell className="p-4 md:p-16" component="th" scope="row">
//         {n.time} | {n.date}
//       </TableCell>
//     </TableRow>
//   );
// }) : (
//   <Typography color="textSecondary" variant="h5" align="center">
//     Сотрудники отсутвуют
//   </Typography>
// )}
