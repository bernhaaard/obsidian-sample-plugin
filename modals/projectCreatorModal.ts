import { App, Modal, Setting, Notice } from 'obsidian';

export default class ProjectCreationModal extends Modal {
  projectData: {
    title: string;
    area: string;
    status: string;
    deadline: string | null;
    tags: string;
    priority: string;
    goals: string;
  } = {
    title: '',
    area: 'personal',
    status: 'planning',
    deadline: null,
    tags: '',
    priority: 'medium',
    goals: ''
  };

  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass('project-modal')
    contentEl.createEl("h2", { text: "Add new Project" });

    const container = contentEl.createDiv()
    container.addClass('container');

    // Column 1
    const column1 = container.createDiv();
    column1.addClass('modal-column');

    new Setting(column1)
      .setName('Title')
      .addText(text => text.onChange(value => this.projectData.title = value));

    new Setting(column1)
      .setName('Area')
      .addDropdown(dropdown => dropdown
        .addOptions({ personal: 'Personal', work: 'Work', uni: 'Uni' })
        .onChange(value => this.projectData.area = value));

    new Setting(column1)
      .setName('Status')
      .addDropdown(dropdown => dropdown
        .addOptions({ planning: 'Planning', inProgress: 'In Progress', onHold: 'On Hold', completed: 'Completed' })
        .onChange(value => this.projectData.status = value));
        
    new Setting(column1)
      .setName('Priority')
      .addDropdown(dropdown => dropdown
        .addOptions({ high: 'High', medium: 'Medium', low: 'Low' })
        .onChange(value => this.projectData.priority = value));
    // Column 2
    const column2 = container.createDiv();
    column2.addClass('modal-column');

    new Setting(column2)
      .setName('Deadline')
      .addText(text => {
        text.inputEl.type = 'date';
        text.onChange(value => this.projectData.deadline = value)
      });

    new Setting(column2)
      .setName('Tags')
      .addText(text => text.onChange(value => this.projectData.tags = value));


    new Setting(column2)
      .setName('Goals')
      .addTextArea(text => text.onChange(value => this.projectData.goals = value));

    // Submit button
    contentEl.createEl('button', { text: 'Create Project' }, (button) => {
      button.addClass('mod-cta');
      button.onClickEvent(() => this.onSubmit());
    });
  }

  onClose() {
    this.contentEl.empty();
  }

  async onSubmit() {
    // Validate data
    if (!this.projectData.title) {
      new Notice('Project title is required.');
      return;
    }

    // Format title for folder name
    const formattedName = this.projectData.title.replace(/\s/g, '-').toLowerCase();
    // Define paths
    const projectFolder = `/Projects/${this.projectData.area}-${formattedName}`;
    const projectFilePath = `${projectFolder}/Project Description.md`;

    // Create folder and file
    await this.app.vault.createFolder(projectFolder);
    let fileContent = `---
title: ${this.projectData.title}
area: ${this.projectData.area}
status: ${this.projectData.status}
deadline: ${this.projectData.deadline}
tags: ${this.projectData.tags}
priority: ${this.projectData.priority}
goals: ${this.projectData.goals}
time spent:
---
# ${this.projectData.title}
## Project Goals
- Goal 1 
- Goal 2
## Milestones 
- [ ] Milestone 1 - Due Date 
- [ ] Milestone 2 - Due Date
## Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Notes
- 
## Meeting Notes 
- Meeting on YYYY-MM-DD
## References
- External Resource
- Related Document
`;

    await this.app.vault.create(projectFilePath, fileContent);
    this.close();
    new Notice('Project created successfully.');
  }
}
