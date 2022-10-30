import axios from "axios";
import prompts from "prompts";
// import chalk from "chalk";
import { table } from "table";
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import { schedules, subject, subjects, update } from "./types.js";

const configPath = "./config.json";

let server = false;

// try {
const API_URL = "https://schedule.wvffle.net";

const { data: updates } = await axios.get(API_URL + "/updates");

const latestUpdate = updates[1];

const latestUpdateHash = latestUpdate.hash;

const { data: update }: { data: update } = await axios.get(
  API_URL + "/updates/" + latestUpdateHash
);
server = true;
// } catch (error) {
//   console.error(error);
// }
// const { data: update }: { data: update } = JSON.parse(
//   (await readFile("./data.json")).toString()
// );
// console.log(update);

let schedules: schedules = update.data.schedules;

const degrees = update.data.degrees;

let degreeChoices: { title: string; value: number }[] = [];

degrees.forEach((d) => {
  if (d.id == 6 || d.id == 8 || d.id == 16) return;
  let choice = {
    title: "",
    value: 0,
  };
  choice.title = d.name;
  choice.value = d.id;
  degreeChoices.push(choice);
});

// console.log(degreeChoices);

const { degree } = await prompts({
  type: "select",
  name: "degree",
  message: "Wybierz kierunek:",
  choices: degreeChoices,
});

schedules = schedules.filter((s) => {
  return s.degree == degree;
});

// const today = new Date().getDay();
const isSummer = new Date().getMonth() < 9 && new Date().getMonth() > 1;
// console.log(isSummer);

const semesterChoices = isSummer
  ? [
      { title: "2", value: 2 },
      { title: "4", value: 4 },
      { title: "6", value: 6 },
    ]
  : [
      { title: "1", value: 1 },
      { title: "3", value: 3 },
      { title: "5", value: 5 },
      { title: "7", value: 7 },
    ];

const { semester } = await prompts({
  type: "select",
  name: "semester",
  message: "Wybierz semestr:",
  choices: semesterChoices,
});

schedules = schedules.filter((s) => {
  return s.semester == semester;
});
// console.log(schedules);

const groups = {
  lab: new Set<number>(),
  exercise: new Set<number>(),
  workshop: new Set<number>(),
  language: new Set<number>(),
  PE: new Set<number>(),
};

schedules.forEach((s) => {
  if (s.type === "P" || s.type === "Ps") groups.workshop.add(s.group);
  if (s.type === "Ćw") groups.exercise.add(s.group);
  if (s.type === "L") groups.lab.add(s.group);
  if (s.type === "J") groups.language.add(s.group);
  if (s.type === "Wf") groups.PE.add(s.group);
});

interface groupChoice {
  lab: { title: string; value: number }[];
  exercise: { title: string; value: number }[];
  workshop: { title: string; value: number }[];
  language: { title: string; value: number }[];
  PE: { title: string; value: number }[];
}

const groupChoice: groupChoice = {
  lab: [],
  exercise: [],
  workshop: [],
  language: [],
  PE: [],
};

groups.lab.forEach((lab: number) => {
  console.log(lab, typeof lab);
  groupChoice.lab.push({ title: lab.toString(), value: lab });
});
groups.exercise.forEach((ex) => {
  groupChoice.exercise.push({ title: ex.toString(), value: ex });
});
groups.workshop.forEach((w) => {
  groupChoice.workshop.push({ title: w.toString(), value: w });
});
groups.language.forEach((lan) => {
  groupChoice.language.push({ title: lan.toString(), value: lan });
});
groups.PE.forEach((pe) => {
  groupChoice.PE.push({ title: pe.toString(), value: pe });
});

const { lab } = groupChoice.lab.length
  ? await prompts({
      type: "select",
      name: "lab",
      message: "Wybierz grupę laboratorium:",
      choices: groupChoice.lab.sort((a, b) => a.value - b.value),
    })
  : { lab: undefined };

const { exercise } = groupChoice.exercise.length
  ? await prompts({
      type: "select",
      name: "exercise",
      message: "Wybierz grupę ćwiczeniową:",
      choices: groupChoice.exercise.sort((a, b) => a.value - b.value),
    })
  : { exercise: undefined };

const { workshop } = groupChoice.workshop.length
  ? await prompts({
      type: "select",
      name: "workshop",
      message: "Wybierz grupę PS:",
      choices: groupChoice.workshop.sort((a, b) => a.value - b.value),
    })
  : { workshop: undefined };

const { language } = groupChoice.language.length
  ? await prompts({
      type: "select",
      name: "language",
      message: "Wybierz grupę językową:",
      choices: groupChoice.language.sort((a, b) => a.value - b.value),
    })
  : { language: undefined };

const { PE } = groupChoice.PE.length
  ? await prompts({
      type: "select",
      name: "PE",
      message: "Wybierz grupę wf:",
      choices: groupChoice.PE.sort((a, b) => a.value - b.value),
    })
  : { PE: undefined };

const config = { degree, semester, lab, exercise, workshop, language, PE };

await writeFile(configPath, JSON.stringify(config));

// console.log(lab, workshop, exercise, language, PE);

// schedules = schedules.filter()
schedules = schedules.filter((s) => {
  return (
    s.type == "W" ||
    (s.type == "L" && s.group == lab) ||
    ((s.type == "Ps" || s.type == "P") && s.group == workshop) ||
    (s.type == "Ćw" && s.group == exercise) ||
    (s.type == "J" && s.group == language) ||
    (s.type == "Wf" && s.group == PE)
  );
});
// console.log(schedules);
const subjects: subjects = update.data.subjects;
const plan: (subject | undefined)[] = [];
schedules.forEach((s) => {
  plan.push(subjects.find((sub) => sub.id === s.subject));
});

const planTable = [];
// console.log(plan);
const days = [
  " ",
  "poniedziałek",
  "wtorek",
  "środa",
  "czwartek",
  "piątek",
  "sobota",
  "niedziela",
];

const hours = {
  "1": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "2": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "3": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "4": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "5": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "6": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "7": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "8": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "9": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "10": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "11": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "12": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "13": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
  "14": ["8:20 - 9:15", "-", "-", "-", "-", "-", "-", "-"],
};

// console.log(hours);
planTable.push(days);

schedules.forEach((lesson) => {
  hours[lesson.hour.toString() as keyof typeof hours][lesson.day] =
    lesson.id.toString();
});

for (const [key, value] of Object.entries(hours)) {
  planTable.push(value);
}
console.log(table(planTable));
