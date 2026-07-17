export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

class ToastState {
	toasts = $state<Toast[]>([]);

	add(message: string, type: ToastType = 'info') {
		const id = crypto.randomUUID();
		this.toasts.push({ id, message, type });
		setTimeout(() => {
			this.remove(id);
		}, 3000); // Закрываем через 3 секунды
	}

	success(message: string) {
		this.add(message, 'success');
	}

	error(message: string) {
		this.add(message, 'error');
	}

	remove(id: string) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}
}

export const toast = new ToastState();
