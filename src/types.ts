export type schedule = {
  id: number;
  hash: string;
  day: number;
  hour: number;
  intervals: number;
  weekFlags: number;
  teacher: number;
  room: number;
  subject: number;
  type: string;
  group: number;
  degree: number;
  semester: number;
  speciality: number;
};

export type room = {
  id: number;
  hash: string;
  name: string;
};

export type title = {
  id: number;
  hash: string;
  name: string;
};

export type degree = {
  id: number;
  hash: string;
  name: string;
};

export type subject = {
  id: number;
  hash: string;
  name: string;
  shortName: string;
};

export type teacher = {
  id: number;
  hash: string;
  name: string;
  surname: string;
  initials: string;
  title: number;
};

export type speciality = {
  id: number;
  hash: string;
  name: string;
};

export type schedules = schedule[];
export type rooms = room[];
export type titles = title[];
export type degrees = degree[];
export type subjects = subject[];
export type teachers = teacher[];
export type specialities = speciality[];

export type update = {
  id: number;
  hash: string;
  date: string;
  diff: any; //do diff if necessary
  data: {
    rooms: rooms;
    titles: titles;
    degrees: degrees;
    subjects: subjects;
    teachers: teachers;
    schedules: schedules;
  };
};

export interface colSpan {
  col: number;
  row: number;
  rowSpan?: number;
  colSpan?: number;
  verticalAlignment?: string;
  alignment?: string;
}
export interface groupChoice {
  lab: { title: string; value: number }[];
  exercise: { title: string; value: number }[];
  workshop: { title: string; value: number }[];
  language: { title: string; value: number }[];
  PE: { title: string; value: number }[];
}
