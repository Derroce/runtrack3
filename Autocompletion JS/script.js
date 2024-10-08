document.addEventListener('DOMContentLoaded', function() {
    let timer;
    const searchInput = document.getElementById('main-search');
    const autocompleteResults = document.getElementById('autocomplete-results');

    searchInput.addEventListener('input', function() {  // Changé de 'keyup' à 'input'
        clearTimeout(timer);
        timer = setTimeout(() => {
            var search_term = this.value.trim();  // Ajout de .trim() pour enlever les espaces
            
            // Vérification si le terme de recherche est vide
            if (search_term === '') {
                autocompleteResults.innerHTML = '';  // Vide les résultats
                return;  // Arrête l'exécution de la fonction ici
            }

            fetch(`autocomplete.php?search_term=${encodeURIComponent(search_term)}`)
                .then(response => response.json())
                .then(data => {
                    displayResults(data);
                })
                .catch(error => {
                    console.error("Erreur AJAX : ", error);
                });
        }, 300);
    });

    function displayResults(results) {
        autocompleteResults.innerHTML = '';
        if (results.length === 0) {
            return;
        }

        const exactMatches = document.createElement('ul');
        exactMatches.className = 'list-group mb-2';
        const partialMatches = document.createElement('ul');
        partialMatches.className = 'list-group';

        results.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            const a = document.createElement('a');
            a.href = `element.php?id=${item.id}&nom=${encodeURIComponent(item.nom)}`;
            a.textContent = item.nom;
            a.className = 'text-decoration-none';
            li.appendChild(a);

            if (item.match_type === 0) {
                exactMatches.appendChild(li);
            } else {
                partialMatches.appendChild(li);
            }
        });

        if (exactMatches.children.length > 0) {
            const exactTitle = document.createElement('h6');
            exactTitle.textContent = 'Correspondances exactes';
            autocompleteResults.appendChild(exactTitle);
            autocompleteResults.appendChild(exactMatches);
        }

        if (partialMatches.children.length > 0) {
            const partialTitle = document.createElement('h6');
            partialTitle.textContent = 'Correspondances partielles';
            autocompleteResults.appendChild(partialTitle);
            autocompleteResults.appendChild(partialMatches);
        }
    }
});
