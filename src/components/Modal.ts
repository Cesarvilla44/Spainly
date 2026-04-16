// Componente Modal mejorado con TypeScript (sin JSX)
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

export class Modal {
    private props: ModalProps;
    private modalId: string;

    constructor(props: ModalProps, modalId: string = 'modal') {
        this.props = props;
        this.modalId = modalId;
    }

    public render(): string {
        const { isOpen, title, content } = this.props;
        
        if (!isOpen) return '';

        return `
            <div id="${this.modalId}" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 relative">
                    <button onclick="app.closeModal('${this.modalId}')" 
                            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                    <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        ${title}
                    </h3>
                    <div class="text-gray-600 dark:text-gray-300">
                        ${content}
                    </div>
                </div>
            </div>
        `;
    }

    public show(): void {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    public hide(): void {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }
}

export default Modal;
