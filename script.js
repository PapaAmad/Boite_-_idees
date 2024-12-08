
class IdeaBox {
    constructor() {
        this.binId = '67561333e41b4d34e46214bb'; // Remplacez par le BIN_ID obtenu
        this.apiKey = '$2a$10$BSxL6Ex5.uKkPPZRy3uLxOYDJZtQO/ulO6d6pSteA7D04v3X9Uphy'; // Remplacez par votre API Key JSONbin
        this.endpoint = `https://api.jsonbin.io/v3/b/${this.binId}`;

        this.ideas = [];
        this.form = document.querySelector('.idea-form');
        this.input = document.querySelector('.idea-input');
        this.submitBtn = document.querySelector('.submit-btn');
        this.ideasList = document.querySelector('.ideas-list');
        
        this.init();
    }
    
    async init() {
        await this.fetchIdeas(); // Récupère les idées depuis JSONbin
        this.renderIdeas();

        this.submitBtn.addEventListener('click', () => this.addIdea());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.addIdea();
            }
        });
    }
    
    async fetchIdeas() {
        try {
            const res = await fetch(this.endpoint, {
                headers: {
                    'X-Master-Key': this.apiKey,
                }
            });
            const data = await res.json();
            this.ideas = data.record || [];
        } catch (err) {
            console.error('Erreur lors de la récupération des idées :', err);
            this.ideas = [];
        }
    }

    async addIdea() {
        const content = this.input.value.trim();
        if (!content) return;
        
        const idea = {
            id: Date.now(),
            content,
            date: new Date().toLocaleString('fr-FR')
        };
        
        this.ideas.unshift(idea);

        // Après avoir ajouté une idée localement, on met à jour sur JSONbin
        await this.saveIdeas();
        this.renderIdeas();
        this.input.value = '';
    }
    
    async saveIdeas() {
        try {
            await fetch(this.endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(this.ideas)
            });
        } catch (err) {
            console.error('Erreur lors de la sauvegarde des idées :', err);
        }
    }
    
    renderIdeas() {
        this.ideasList.innerHTML = this.ideas.map(idea => `
            <div class="idea-card">
                <div class="idea-header">
                    <div class="idea-date">${idea.date}</div>
                </div>
                <div class="idea-content">${this.escapeHtml(idea.content)}</div>
            </div>
        `).join('');
    }
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new IdeaBox();
});
