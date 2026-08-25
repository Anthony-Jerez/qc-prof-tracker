import { mockCourses } from './professorMock'

const GRADE_KEYS = [
  'a_plus', 'a', 'a_minus',
  'b_plus', 'b', 'b_minus',
  'c_plus', 'c', 'c_minus',
  'd_plus', 'd', 'f', 'w', 'inc',
]

const RAW_TERMS = [
  { term: 'Fall 2021', avgGpa: 2.94, grades: { a_plus: 6, a: 18, a_minus: 14, b_plus: 17, b: 20, b_minus: 13, c_plus: 10, c: 9, c_minus: 5, d_plus: 3, d: 2, f: 4, w: 10, inc: 1 } },
  { term: 'Spring 2022', avgGpa: 3.01, grades: { a_plus: 9, a: 22, a_minus: 16, b_plus: 19, b: 23, b_minus: 14, c_plus: 11, c: 9, c_minus: 5, d_plus: 2, d: 2, f: 3, w: 9, inc: 1 } },
  { term: 'Fall 2022', avgGpa: 2.88, grades: { a_plus: 7, a: 19, a_minus: 15, b_plus: 18, b: 21, b_minus: 15, c_plus: 12, c: 11, c_minus: 6, d_plus: 3, d: 3, f: 5, w: 13, inc: 2 } },
  { term: 'Spring 2023', avgGpa: 3.12, grades: { a_plus: 12, a: 26, a_minus: 18, b_plus: 21, b: 24, b_minus: 15, c_plus: 11, c: 8, c_minus: 4, d_plus: 2, d: 1, f: 3, w: 8, inc: 1 } },
  { term: 'Fall 2023', avgGpa: 3.08, grades: { a_plus: 11, a: 27, a_minus: 20, b_plus: 24, b: 27, b_minus: 17, c_plus: 13, c: 10, c_minus: 5, d_plus: 3, d: 2, f: 4, w: 10, inc: 1 } },
  { term: 'Spring 2024', avgGpa: 3.20, grades: { a_plus: 15, a: 32, a_minus: 22, b_plus: 25, b: 26, b_minus: 16, c_plus: 12, c: 9, c_minus: 4, d_plus: 2, d: 1, f: 3, w: 9, inc: 1 } },
  { term: 'Fall 2024', avgGpa: 3.16, grades: { a_plus: 14, a: 30, a_minus: 23, b_plus: 27, b: 29, b_minus: 18, c_plus: 14, c: 10, c_minus: 5, d_plus: 3, d: 2, f: 4, w: 11, inc: 1 } },
  { term: 'Spring 2025', avgGpa: 3.30, grades: { a_plus: 20, a: 38, a_minus: 26, b_plus: 28, b: 27, b_minus: 15, c_plus: 11, c: 8, c_minus: 4, d_plus: 2, d: 1, f: 2, w: 7, inc: 1 } },
  { term: 'Fall 2025', avgGpa: 3.34, grades: { a_plus: 22, a: 41, a_minus: 27, b_plus: 30, b: 29, b_minus: 16, c_plus: 12, c: 9, c_minus: 4, d_plus: 2, d: 1, f: 2, w: 8, inc: 1 } },
]

function withDerivedFields(rawTerm) {
  const total = GRADE_KEYS.reduce((sum, key) => sum + rawTerm.grades[key], 0)
  return {
    ...rawTerm,
    total,
    withdrawalRate: rawTerm.grades.w / total,
  }
}

export function getMockCourseData(subject, nbr) {
  const known = mockCourses.find((c) => c.subject === subject && c.nbr === nbr)
  const terms = RAW_TERMS.map(withDerivedFields)

  const totalStudents = terms.reduce((sum, t) => sum + t.total, 0)
  const totalWithdrawals = terms.reduce((sum, t) => sum + t.grades.w, 0)
  const weightedGpa =
    terms.reduce((sum, t) => sum + t.avgGpa * t.total, 0) / totalStudents

  return {
    courseName: known?.courseName ?? `${subject} ${nbr}`,
    overall: {
      avgGpa: known?.avgGpa ?? weightedGpa,
      withdrawalRate: totalWithdrawals / totalStudents,
      rating: known?.rating ?? 4.0,
    },
    terms,
  }
}
