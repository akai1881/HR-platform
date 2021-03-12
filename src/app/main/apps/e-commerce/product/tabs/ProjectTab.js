import React from 'react';
import FuseMessage from '@fuse/core/FuseMessage';
import { Button, Icon } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { openNewProjectDialog } from 'app/main/apps/e-commerce/store/productSlice';
import ProjectCard from 'app/main/apps/e-commerce/product/components/ProjectCard';

function ProjectTab({ projects, deleteProject }) {
	const dispatch = useDispatch();

	return (
		<div className="p-16">
			<FuseMessage />
			<div className="p-20 mb-20">
				<Button
					variant="contained"
					color="primary"
					className="w-3/12"
					onClick={ev => dispatch(openNewProjectDialog())}
				>
					Добавить проект
					<Icon fontSize="small" color="inherit" className="ml-9">
						add_circle_outline
					</Icon>
				</Button>
			</div>
			<div className="flex flex-wrap p-10">
				{projects.map(project => (
					<ProjectCard key={project.id} project={project} handleDelete={deleteProject} menu={true} />
				))}
			</div>
		</div>
	);
}

export default ProjectTab;
