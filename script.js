const correctPassword = 'drivedata';
        const passwordForm = document.getElementById('passwordForm');
        const passwordPrompt = document.getElementById('passwordPrompt');
        const mainContent = document.getElementById('mainContent');
        const errorMessage = document.getElementById('errorMessage');

        passwordForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const passwordInput = document.getElementById('password').value;
            if (passwordInput === correctPassword) {
                passwordPrompt.classList.add('hidden');
                mainContent.classList.remove('hidden');
                fetchFilesAndFolders();
            } else {
                errorMessage.classList.remove('hidden');
            }
        });

        const webAppUrl = 'https://script.google.com/macros/s/AKfycby4U6iEtjiHk5vcFBurFNapipkQH3XbZVewSWVeSrTECMyovB_883dTyXe5_VxZIcjo/exec'; // Replace with your actual web app URL

        async function fetchFilesAndFolders() {
            showLoading(true);
            try {
                const response = await fetch(`${webAppUrl}?action=getAllFilesAndFolders`, {
                    method: 'GET',
                    mode: 'cors',
                });
                const data = await response.json();
                showLoading(false);
                if (Array.isArray(data)) {
                    displayFileTree(data);
                } else {
                    showError('Failed to load files and folders. Please try again later.');
                }
            } catch (error) {
                showLoading(false);
                showError('Error fetching files and folders: ' + error.message);
            }
        }

        function showLoading(isLoading) {
            const loadingElement = document.getElementById('loading');
            const fileTreeElement = document.getElementById('file-tree');
            if (isLoading) {
                loadingElement.classList.remove('hidden');
                fileTreeElement.classList.add('hidden');
            } else {
                loadingElement.classList.add('hidden');
                fileTreeElement.classList.remove('hidden');
            }
        }

        function showError(message) {
            const fileTreeElement = document.getElementById('file-tree');
            fileTreeElement.innerHTML = `<p class="text-red-500">${message}</p>`;
            fileTreeElement.classList.remove('hidden');
        }

        function displayFileTree(items) {
            const fileTreeElement = document.getElementById('file-tree');
            fileTreeElement.innerHTML = '';

            const tree = buildTree(items);
            const treeHtml = renderTree(tree);
            fileTreeElement.innerHTML = treeHtml;

            // Add event listeners for folder toggling
            document.querySelectorAll('.folder-toggle').forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const content = toggle.nextElementSibling;
                    content.classList.toggle('hidden');
                    toggle.textContent = content.classList.contains('hidden') ? '▶' : '▼';
                });
            });
        }

        function buildTree(items) {
            const tree = {};
            items.forEach(item => {
                const parts = item.path.split('/').filter(Boolean);
                let currentLevel = tree;
                parts.forEach((part, index) => {
                    if (!currentLevel[part]) {
                        currentLevel[part] = index === parts.length - 1 ? item : {};
                    }
                    currentLevel = currentLevel[part];
                });
            });
            return tree;
        }

        function renderTree(node, indent = 0) {
            let html = '';
            for (const [name, item] of Object.entries(node)) {
                const isFile = item.type === 'file';
                const indentSpace = '  '.repeat(indent);
                if (isFile) {
                    html += `${indentSpace}<div class="py-1">
                        <span class="text-blue-500">📄</span>
                        <a href="${item.url}" class="ml-1 text-blue-500 hover:underline" target="_blank">${name}</a>
                    </div>`;
                } else {
                    html += `${indentSpace}<div class="py-1">
                        <span class="folder-toggle cursor-pointer">▼</span>
                        <span class="ml-1 font-semibold">📁 ${name}</span>
                        <div class="ml-4">
                            ${renderTree(item, indent + 1)}
                        </div>
                    </div>`;
                }
            }
            return html;
        }
//Copy restriction
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

document.addEventListener('copy', function (e) {
    e.preventDefault();
    alert('Copying text is not allowed on this page.');
});

//DMR win&Max
document.addEventListener('keydown', function (e) {
    // Disable F12 key (developer tools)
    if (e.keyCode === 123) {
        e.preventDefault();
    }
    // Disable Ctrl+Shift+I and Ctrl+Shift+J (developer tools) for Windows
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) {
        e.preventDefault();
    }
    // Disable Command+Option+I and Command+Option+J (developer tools) for macOS
    if (e.metaKey && e.altKey && (e.keyCode === 73 || e.keyCode === 74)) {
        e.preventDefault();
    }
    // Disable Ctrl+U (view source) for Windows
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
    }
    // Disable Command+Option+U (view source) for macOS
    if (e.metaKey && e.altKey && e.keyCode === 85) {
        e.preventDefault();
    }
});

//Screenshot restriction to some extent
document.addEventListener('keyup', function (e) {
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots can not be taken.');
    }
});

//Ctr+P restriction win&Mac
document.addEventListener('keydown', function (e) {
    // Check for Ctrl+P on Windows and Command+P on macOS
    if ((e.ctrlKey && e.key === 'p') || (e.metaKey && e.key === 'p')) {
        e.preventDefault();
        alert('Printing is disabled on this page.');
    }
});

//script to disable right click on the page
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });
});
