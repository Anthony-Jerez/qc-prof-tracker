const CUNY_EMAIL_REGEX = /^([a-z\-]+)\.([a-z\-]+)(\d+)@(qmail\.cuny\.edu|login\.cuny\.edu|stu-mail\.qc\.cuny\.edu)$/i

export function validateEmail(email) {
  if (!email.trim()) return 'Enter your student email.'
  if (!CUNY_EMAIL_REGEX.test(email.trim())) {
    return 'Use a valid Queens College email (e.g., first.last##@qmail.cuny.edu).'
  }
  return ''
}

export function extractNameFromEmail(email) {
  const match = email.trim().match(CUNY_EMAIL_REGEX)
  if (!match) return { firstName: '', lastName: '' }

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  
  return {
    firstName: capitalize(match[1]),
    lastName: capitalize(match[2])
  }
}

export function validatePassword(password) {
  if (password.length < 12) return 'Use at least 12 characters.'
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
    return 'Must include uppercase, lowercase, a number, and a symbol.'
  }
  return ''
}

export function validateConfirmPassword(password, confirmPassword) {
  if (password !== confirmPassword) return 'Passwords do not match.'
  return ''
}

// Consolidates both the regex check and the Supabase API call
export async function verifyOtpSubmit(supabase, email, otp, type) {
  if (!/^\d{6}$/.test(otp.trim())) {
    return { data: null, error: 'Enter the 6-digit code from your email.' }
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: otp.trim(),
    type,
  })

  return { data, error: error ? error.message : null }
}