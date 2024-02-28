import ProjectCreationModal from 'modals/projectCreatorModal';
import { Plugin } from 'obsidian';

export default class AddNewProjectPlugin extends Plugin {

	async onload() {
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('plus-square', 'Add new Project', () => {
			new ProjectCreationModal(this.app).open();
		})
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'add-new-project',
			name: 'Add new Project',
			callback: () => {
				new ProjectCreationModal(this.app).open();
			}
		});
	}
}