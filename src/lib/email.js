export const QC_EMAIL_DOMAIN = 'qmail.cuny.edu'

const QC_EMAIL_PATTERN = new RegExp(`^[^\\s@]+@${QC_EMAIL_DOMAIN.replace('.', '\\.')}$`, 'i')

export function isQcEmail(email) {
  return QC_EMAIL_PATTERN.test(email.trim())
}
