export type AdminConfirmVariant = 'default' | 'danger'

export interface AdminConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: AdminConfirmVariant
}

interface AdminConfirmState {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  variant: AdminConfirmVariant
}

const state = reactive<AdminConfirmState>({
  open: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'default',
})

let resolveFn: ((value: boolean) => void) | null = null

export function useAdminConfirm() {
  function confirm(options: AdminConfirmOptions): Promise<boolean> {
    if (resolveFn) {
      resolveFn(false)
      resolveFn = null
    }

    state.title = options.title
    state.message = options.message
    state.confirmLabel = options.confirmLabel ?? 'Confirm'
    state.cancelLabel = options.cancelLabel ?? 'Cancel'
    state.variant = options.variant ?? 'default'
    state.open = true

    return new Promise((resolve) => {
      resolveFn = resolve
    })
  }

  function accept() {
    resolveFn?.(true)
    resolveFn = null
    state.open = false
  }

  function cancel() {
    resolveFn?.(false)
    resolveFn = null
    state.open = false
  }

  return {state, confirm, accept, cancel}
}
