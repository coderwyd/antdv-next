const _ValidateStatuses = ['success', 'warning', 'error', 'validating', ''] as const
export type ValidateStatus = (typeof _ValidateStatuses)[number]
