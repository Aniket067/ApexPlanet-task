class NotesApp {
    constructor() {
        this.notes = [];
        this.currentNoteId = null;
        this.autoSaveTimer = null;
        this.searchTimeout = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.loadNotes();
        this.bindEvents();
        this.updateUI();
        this.showWelcomeMessage();
    }

    /**
     * Load notes from localStorage
     */
    loadNotes() {
        try {
            const savedNotes = localStorage.getItem('notesflow_notes');
            this.notes = savedNotes ? JSON.parse(savedNotes) : [];
            
            // If no notes exist, create a welcome note
            if (this.notes.length === 0) {
                this.createWelcomeNote();
            }
        } catch (error) {
            console.error('Error loading notes from localStorage:', error);
            this.notes = [];
            this.showStatus('Error loading notes', 'error');
        }
    }

    /**
     * Save notes to localStorage
     */
    saveNotes() {
        try {
            localStorage.setItem('notesflow_notes', JSON.stringify(this.notes));
            this.showStatus('Saved', 'saved');
            return true;
        } catch (error) {
            console.error('Error saving notes to localStorage:', error);
            this.showStatus('Save failed', 'error');
            return false;
        }
    }

    /**
     * Create welcome note for first-time users
     */
    createWelcomeNote() {
        const welcomeNote = {
            id: Date.now(),
            title: 'Welcome to NotesFlow! 🎉',
            content: `Welcome to NotesFlow - your modern note-taking companion!

✨ Getting Started:
• Click "New Note" to create your first note
• Use the search box to find notes quickly
• Your notes are automatically saved to your browser's local storage
• Use Ctrl/Cmd + S to save manually
• Use Ctrl/Cmd + N to create a new note

🎨 Features:
• Beautiful responsive design that works on all devices
• Real-time search functionality
• Auto-save every 2 seconds
• Modern glassmorphism UI
• Smooth animations and transitions

📱 Mobile Friendly:
This app is fully responsive and works great on phones and tablets!

🔒 Privacy:
All your notes are stored locally in your browser. Nothing is sent to any servers.

Happy note-taking! 📝`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.push(welcomeNote);
        this.saveNotes();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Button events
        document.getElementById('addNoteBtn').addEventListener('click', () => this.createNote());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveCurrentNote());
        
        // Input events
        document.getElementById('searchBox').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('noteTitleInput').addEventListener('input', () => this.handleAutoSave());
        document.getElementById('noteContent').addEventListener('input', () => this.handleAutoSave());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Prevent data loss on page unload
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 's':
                    e.preventDefault();
                    this.saveCurrentNote();
                    break;
                case 'n':
                    e.preventDefault();
                    this.createNote();
                    break;
                case 'f':
                    e.preventDefault();
                    document.getElementById('searchBox').focus();
                    break;
            }
        }
        
        // ESC to clear search
        if (e.key === 'Escape') {
            const searchBox = document.getElementById('searchBox');
            if (searchBox.value) {
                searchBox.value = '';
                this.searchNotes('');
            }
        }
    }

    /**
     * Create a new note
     */
    createNote() {
        const newNote = {
            id: Date.now(),
            title: 'Untitled Note',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.unshift(newNote);
        this.currentNoteId = newNote.id;
        
        if (this.saveNotes()) {
            this.updateUI();
            this.loadNoteIntoEditor(newNote);
            
            // Focus on title input and select text
            const titleInput = document.getElementById('noteTitleInput');
            titleInput.focus();
            titleInput.select();
        }
    }

    /**
     * Delete a note with confirmation
     */
    deleteNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        const confirmMessage = `Are you sure you want to delete "${note.title}"?\n\nThis action cannot be undone.`;
        
        if (confirm(confirmMessage)) {
            this.notes = this.notes.filter(n => n.id !== noteId);
            
            // If deleting current note, clear editor
            if (this.currentNoteId === noteId) {
                this.currentNoteId = null;
                this.clearEditor();
            }
            
            if (this.saveNotes()) {
                this.updateUI();
                this.showStatus('Note deleted', 'saved');
            }
        }
    }

    /**
     * Save the currently selected note
     */
    saveCurrentNote() {
        if (!this.currentNoteId) {
            this.showStatus('No note selected', 'error');
            return false;
        }

        const title = document.getElementById('noteTitleInput').value.trim();
        const content = document.getElementById('noteContent').value;

        const noteIndex = this.notes.findIndex(note => note.id === this.currentNoteId);
        if (noteIndex === -1) {
            this.showStatus('Note not found', 'error');
            return false;
        }

        // Update note data
        this.notes[noteIndex].title = title || 'Untitled Note';
        this.notes[noteIndex].content = content;
        this.notes[noteIndex].updatedAt = new Date().toISOString();
        
        if (this.saveNotes()) {
            this.updateUI();
            return true;
        }
        
        return false;
    }

    /**
     * Handle auto-save with debouncing
     */
    handleAutoSave() {
        if (!this.currentNoteId) return;
        
        this.showStatus('Saving...', 'saving');
        
        // Clear existing timer
        clearTimeout(this.autoSaveTimer);
        
        // Set new timer for auto-save
        this.autoSaveTimer = setTimeout(() => {
            this.saveCurrentNote();
        }, 2000);
    }

    /**
     * Handle search with debouncing
     */
    handleSearch(query) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchNotes(query);
        }, 300);
    }

    /**
     * Search notes by title and content
     */
    searchNotes(query) {
        if (!query.trim()) {
            this.renderNotesList(this.notes);
            return;
        }

        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderNotesList(filteredNotes);
    }

    /**
     * Load a note into the editor
     */
    loadNoteIntoEditor(note) {
        document.getElementById('noteTitleInput').value = note.title;
        document.getElementById('noteContent').value = note.content;
        
        // Show editor, hide empty state
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('noteTitleInput').style.display = 'block';
        document.getElementById('noteContent').style.display = 'block';
        
        // Enable save button
        document.getElementById('saveBtn').disabled = false;
    }

    /**
     * Clear the editor
     */
    clearEditor() {
        document.getElementById('noteTitleInput').value = '';
        document.getElementById('noteContent').value = '';
        
        // Hide editor, show empty state
        document.getElementById('emptyState').style.display = 'flex';
        document.getElementById('noteTitleInput').style.display = 'none';
        document.getElementById('noteContent').style.display = 'none';
        
        // Disable save button
        document.getElementById('saveBtn').disabled = true;
        
        // Clear any status
        this.clearStatus();
    }

    /**
     * Select and load a note
     */
    selectNote(noteId) {
        // Save current note if there are changes
        if (this.currentNoteId && this.hasUnsavedChanges()) {
            this.saveCurrentNote();
        }
        
        this.currentNoteId = noteId;
        const note = this.notes.find(n => n.id === noteId);
        
        if (note) {
            this.loadNoteIntoEditor(note);
            this.updateUI();
        }
    }

    /**
     * Check if current note has unsaved changes
     */
    hasUnsavedChanges() {
        if (!this.currentNoteId) return false;
        
        const currentNote = this.notes.find(n => n.id === this.currentNoteId);
        if (!currentNote) return false;
        
        const currentTitle = document.getElementById('noteTitleInput').value.trim() || 'Untitled Note';
        const currentContent = document.getElementById('noteContent').value;
        
        return currentNote.title !== currentTitle || currentNote.content !== currentContent;
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
            }
            return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
        }
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString();
    }

    /**
     * Render the notes list
     */
    renderNotesList(notesToRender = this.notes) {
        const notesList = document.getElementById('notesList');
        
        if (notesToRender.length === 0) {
            notesList.innerHTML = `
                <div style="text-align: center; color: #bdc3c7; padding: 20px;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">📝</div>
                    <div>No notes found</div>
                    <div style="font-size: 0.9rem; margin-top: 5px;">Try adjusting your search</div>
                </div>
            `;
            return;
        }

        notesList.innerHTML = '';
        
        notesToRender.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = `note-item ${note.id === this.currentNoteId ? 'active' : ''}`;
            noteElement.onclick = () => this.selectNote(note.id);
            
            // Truncate content for preview
            const preview = note.content.length > 100 
                ? note.content.substring(0, 100) + '...' 
                : note.content || 'No content';
            
            noteElement.innerHTML = `
                <button class="delete-btn" title="Delete note">×</button>
                <div class="note-title">${this.escapeHtml(note.title)}</div>
                <div class="note-preview">${this.escapeHtml(preview)}</div>
                <div class="note-date">${this.formatDate(note.updatedAt)}</div>
            `;
            
            // Add delete button event listener
            const deleteBtn = noteElement.querySelector('.delete-btn');
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteNote(note.id);
            };
            
            notesList.appendChild(noteElement);
        });
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Update the entire UI
     */
    updateUI() {
        this.renderNotesList();
        this.updateStats();
    }

    /**
     * Update stats display
     */
    updateStats() {
        const noteCount = this.notes.length;
        document.getElementById('noteCount').textContent = `${noteCount} note${noteCount !== 1 ? 's' : ''}`;
        
        const selectedNote = this.currentNoteId ? this.notes.find(n => n.id === this.currentNoteId) : null;
        document.getElementById('selectedNote').textContent = selectedNote ? 'Selected' : '';
    }

    /**
     * Show status message
     */
    showStatus(message, type = 'saved') {
        // Remove existing status
        this.clearStatus();
        
        const saveBtn = document.getElementById('saveBtn');
        const statusSpan = document.createElement('span');
        statusSpan.className = `status-indicator status-${type}`;
        statusSpan.textContent = message;
        statusSpan.id = 'statusIndicator';
        
        saveBtn.parentNode.appendChild(statusSpan);
        
        // Auto-clear after 3 seconds for non-error messages
        if (type !== 'error' && type !== 'saving') {
            setTimeout(() => this.clearStatus(), 3000);
        }
    }

    /**
     * Clear status message
     */
    clearStatus() {
        const existingStatus = document.getElementById('statusIndicator');
        if (existingStatus) {
            existingStatus.remove();
        }
    }

    /**
     * Show welcome message for new users
     */
    showWelcomeMessage() {
        // Check if this is first visit
        const hasVisited = localStorage.getItem('notesflow_visited');
        if (!hasVisited) {
            localStorage.setItem('notesflow_visited', 'true');
            setTimeout(() => {
                alert('Welcome to NotesFlow! 🎉\n\nYour notes are automatically saved to your browser\'s local storage.\n\nTip: Use Ctrl/Cmd + N to create a new note quickly!');
            }, 1000);
        }
    }

    /**
     * Export notes as JSON
     */
    exportNotes() {
        try {
            const dataStr = JSON.stringify(this.notes, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `notesflow-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.showStatus('Notes exported', 'saved');
        } catch (error) {
            console.error('Export failed:', error);
            this.showStatus('Export failed', 'error');
        }
    }

    /**
     * Import notes from JSON file
     */
    importNotes(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedNotes = JSON.parse(e.target.result);
                
                if (Array.isArray(importedNotes)) {
                    // Merge with existing notes (avoid duplicates by ID)
                    const existingIds = new Set(this.notes.map(n => n.id));
                    const newNotes = importedNotes.filter(n => !existingIds.has(n.id));
                    
                    this.notes = [...newNotes, ...this.notes];
                    this.saveNotes();
                    this.updateUI();
                    this.showStatus(`Imported ${newNotes.length} notes`, 'saved');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                console.error('Import failed:', error);
                this.showStatus('Import failed', 'error');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Clear all notes (with confirmation)
     */
    clearAllNotes() {
        if (this.notes.length === 0) {
            this.showStatus('No notes to clear', 'error');
            return;
        }

        const confirmMessage = `Are you sure you want to delete ALL ${this.notes.length} notes?\n\nThis action cannot be undone. Consider exporting your notes first.`;
        
        if (confirm(confirmMessage)) {
            this.notes = [];
            this.currentNoteId = null;
            this.clearEditor();
            
            if (this.saveNotes()) {
                this.updateUI();
                this.showStatus('All notes cleared', 'saved');
            }
        }
    }

    /**
     * Get storage usage statistics
     */
    getStorageStats() {
        try {
            const notesData = localStorage.getItem('notesflow_notes');
            const sizeInBytes = new Blob([notesData || '']).size;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);
            
            return {
                noteCount: this.notes.length,
                storageSize: `${sizeInKB} KB`,
                lastBackup: localStorage.getItem('notesflow_last_backup') || 'Never'
            };
        } catch (error) {
            console.error('Failed to get storage stats:', error);
            return null;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notesApp = new NotesApp();
});

// Additional utility functions

/**
 * Add export/import functionality to the UI
 */
function addAdvancedFeatures() {
    // Create export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export';
    exportBtn.className = 'export-btn';
    exportBtn.onclick = () => window.notesApp.exportNotes();
    
    // Create import button and file input
    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import';
    importBtn.className = 'import-btn';
    
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.style.display = 'none';
    importInput.onchange = (e) => {
        if (e.target.files[0]) {
            window.notesApp.importNotes(e.target.files[0]);
        }
    };
    
    importBtn.onclick = () => importInput.click();
    
    // Add buttons to sidebar
    const sidebar = document.querySelector('.sidebar');
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'advanced-controls';
    buttonContainer.style.cssText = 'display: flex; gap: 10px; margin-bottom: 15px;';
    
    buttonContainer.appendChild(exportBtn);
    buttonContainer.appendChild(importBtn);
    buttonContainer.appendChild(importInput);
    
    sidebar.insertBefore(buttonContainer, document.getElementById('searchBox'));
}

// Call this function after DOM loads if you want export/import features
// Uncomment the line below to enable:
// document.addEventListener('DOMContentLoaded', addAdvancedFeatures);

/**
 * Add dark mode toggle
 */
function addDarkModeToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '🌙';
    toggleBtn.className = 'dark-mode-toggle';
    toggleBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255,255,255,0.2);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        cursor: pointer;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    toggleBtn.onclick = () => {
        document.body.classList.toggle('dark-mode');
        toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('notesflow_dark_mode', document.body.classList.contains('dark-mode'));
    };
    
    // Load saved preference
    if (localStorage.getItem('notesflow_dark_mode') === 'true') {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️';
    }
    
    document.body.appendChild(toggleBtn);
}

// Uncomment to enable dark mode toggle:
// document.addEventListener('DOMContentLoaded', addDarkModeToggle);