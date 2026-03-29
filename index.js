let students = [];
        let isAnimating = false;

        // Cargar estudiantes desde localStorage
        window.addEventListener('DOMContentLoaded', () => {
            const saved = localStorage.getItem('ploufStudents');
            if (saved) {
                students = JSON.parse(saved);
                renderStudents();
            }
            // Botón para abrir el modal según lo desee el usuario
            const btn = document.getElementById('openUpdateBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    showUpdateModal();
                });
            }
        });

        // Mostrar modal de actualizaciones
        function showUpdateModal() {
            const modal = document.getElementById('updateModal');
            if (modal) {
                modal.style.display = 'block';
            }
        }

        // Ocultar modal
        function hideUpdateModal() {
            const modal = document.getElementById('updateModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }

        // Cerrar cuando el usuario hace clic en la X o fuera del modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn') || e.target.id === 'updateModal') {
                hideUpdateModal();
            }
        });


        // Guardar estudiantes en localStorage
        function saveStudents() {
            localStorage.setItem('ploufStudents', JSON.stringify(students));
        }

        // Agregar uno o más estudiantes
        function addStudent() {
            const input = document.getElementById('studentInput');
            const text = input.value.trim();

            if (text === '') {
                input.style.borderColor = 'var(--primary)';
                setTimeout(() => input.style.borderColor = 'var(--secondary)', 300);
                return;
            }

            // Separar por comas, saltos de línea o punto y coma
            const names = text.split(/[,;\n]+/)
                .map(name => name.trim())
                .filter(name => name !== '');

            let added = 0;
            let duplicates = 0;

            names.forEach(name => {
                if (!students.includes(name)) {
                    students.push(name);
                    added++;
                } else {
                    duplicates++;
                }
            });

            input.value = '';
            saveStudents();
            renderStudents();
            input.focus();

            // Mostrar mensaje si hay duplicados
            if (duplicates > 0) {
                showNotification(`${added} alumno(s) agregado(s) • ${duplicates} duplicado(s) ignorado(s)`);
            } else if (added > 1) {
                showNotification(`¡${added} alumnos agregados!`);
            } else if (added === 1) {
                showNotification(`¡Alumno agregado!`);
            }
        }

        // Mostrar notificación
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Eliminar un estudiante
        function removeStudent(index) {
            students.splice(index, 1);
            saveStudents();
            renderStudents();
        }

        // Vaciar completamente la lista
        function clearStudents() {
            if (!confirm('¿Deseas eliminar todos los estudiantes?')) return;
            students = [];
            saveStudents();
            renderStudents();
            const resultSection = document.getElementById('resultSection');
            if (resultSection) {
                resultSection.innerHTML = '<p class="empty-state">Agrega a los alumnos...</p>';
            }
        }

        // Mostrar estudiantes
        function renderStudents() {
            const list = document.getElementById('studentsList');
            const ploufBtn = document.getElementById('ploufBtn');
            const clearBtn = document.getElementById('clearBtn');

            if (students.length === 0) {
                list.innerHTML = '';
                if (ploufBtn) ploufBtn.disabled = true;
                if (clearBtn) clearBtn.disabled = true;
                return;
            }

            list.innerHTML = students.map((student, index) => `
                <div class="student-tag" id="student-${index}">
                    <span class="student-name">${student}</span>
                    <button class="btn-remove" onclick="removeStudent(${index})">✕</button>
                </div>
            `).join('');

            if (ploufBtn) ploufBtn.disabled = false;
            if (clearBtn) clearBtn.disabled = false;
        }

        // Animación Pika Pika
        async function startPlouf() {
            if (isAnimating || students.length === 0) return;

            isAnimating = true;
            const ploufBtn = document.getElementById('ploufBtn');
            if (ploufBtn) ploufBtn.disabled = true;

            // Obtener elemento de audio y reproducir música
            const audio = document.getElementById('selectionMusic');
            if (audio) {
                audio.currentTime = 0; // Reiniciar desde el inicio
                audio.play().catch(e => {
                    console.log('No se pudo reproducir el audio:', e);
                    // Continuar sin música si hay un error
                });
            }

            // Limpiar resalte anterior
            document.querySelectorAll('.student-tag').forEach(tag => tag.classList.remove('highlight'));

            const resultSection = document.getElementById('resultSection');
            if (resultSection) {
                resultSection.innerHTML = '<p class="winner-text loading">🎲</p>';
            }

            try {
                // Animación rápida de selección
                const cycles = 15;
                const delay = 100;

                for (let i = 0; i < cycles; i++) {
                    const randomIndex = Math.floor(Math.random() * students.length);
                    highlightStudent(randomIndex);
                    await sleep(delay + (i * 10)); // Desaceleración progresiva
                }

                // Selección final
                const winnerIndex = Math.floor(Math.random() * students.length);
                const winner = students[winnerIndex];

                highlightStudent(winnerIndex);
                await sleep(500);

                // Detener la música cuando se muestra el resultado
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }

                // Mostrar ganador
                if (resultSection) {
                    resultSection.innerHTML = `
                        <p class="winner-text">el resultado...</p>
                        <p class="winner-name">${winner}</p>
                    `;
                }

                // Eliminar ganador para que no pueda ser seleccionado nuevamente
                students.splice(winnerIndex, 1);
                saveStudents();
                renderStudents();

                // Lanzar confeti
                createConfetti();
            } finally {
                // Reiniciar estado de animación y botón
                setTimeout(() => {
                    document.querySelectorAll('.student-tag').forEach(tag => {
                        tag.classList.remove('highlight');
                    });
                    if (ploufBtn) ploufBtn.disabled = students.length === 0;
                    isAnimating = false;
                }, 1000);
            }
        }

        // Resaltar un estudiante
        function highlightStudent(index) {
            document.querySelectorAll('.student-tag').forEach(tag => {
                tag.classList.remove('highlight');
            });
            const tag = document.getElementById(`student-${index}`);
            if (tag) {
                tag.classList.add('highlight');
            }
        }

        // Función utilitaria de retraso
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Permitir agregar con Ctrl+Enter o Shift+Enter
        document.getElementById('studentInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
                e.preventDefault();
                addStudent();
            }
        });

        // Función para crear confeti
        function createConfetti() {
            const colors = ['#6b86ff', '#ecce22', '#176d7c', '#A78BFA', '#ff6868'];
            const confettiPieces = 50;

            for (let i = 0; i < confettiPieces; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
                confetti.style.animationDelay = (Math.random() * 0.5) + 's';
                document.body.appendChild(confetti);

                // Eliminar confeti después de la animación
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
        }