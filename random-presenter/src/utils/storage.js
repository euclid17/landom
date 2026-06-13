const STUDENTS_KEY = 'gacha_students';
const SECRET_ORDER_KEY = 'gacha_secret_order';
const PICKED_STUDENTS_KEY = 'gacha_picked_students';

export const getStudents = () => {
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveStudents = (students) => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const getSecretOrder = () => {
  const data = localStorage.getItem(SECRET_ORDER_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSecretOrder = (order) => {
  localStorage.setItem(SECRET_ORDER_KEY, JSON.stringify(order));
};

export const getPickedStudents = () => {
  const data = localStorage.getItem(PICKED_STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePickedStudents = (students) => {
  localStorage.setItem(PICKED_STUDENTS_KEY, JSON.stringify(students));
};

export const resetPickedStudents = () => {
  localStorage.removeItem(PICKED_STUDENTS_KEY);
};
