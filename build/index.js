import axios from "axios";
import prompts from "prompts";
import { table } from "table";
import { writeFile, readFile, rm } from "fs/promises";
import chalk from "chalk";
import { DateTime } from "luxon";
const configPath = "./config.json";
const today = new Date().getDay() - 1;
const days = [
    " ",
    chalk.bold("PONIEDZIAŁEK"),
    chalk.bold("WTOREK"),
    chalk.bold("ŚRODA"),
    chalk.bold("CZWARTEK"),
    chalk.bold("PIĄTEK"),
    chalk.bold("SOBOTA"),
    chalk.bold("NIEDZIELA"),
];
const october = DateTime.now().month > 9
    ? DateTime.now().set({ day: 1, month: 10 })
    : DateTime.now().minus({ year: 1 }).set({ day: 1, month: 10 });
const weeksSinceOctober = DateTime.now().weekNumber - october.weekNumber;
const isOdd = weeksSinceOctober % 2 == 1;
const isSummer = new Date().getMonth() < 9 && new Date().getMonth() > 1;
const API_URL = "https://schedule.wvffle.net";
const { data: updates } = await axios.get(API_URL + "/updates");
const latestUpdate = updates[0];
const latestUpdateHash = latestUpdate.hash;
const { data: update } = await axios.get(API_URL + "/updates/" + latestUpdateHash);
let config;
const helloTable = [
    [
        chalk.bgGreenBright.black.bold("Witaj w konsolowym generatorze planów lekcji!\nNiniejszy program poświęcony jest studentom wydziału Informatyki Politechniki Białostockiej.\nPoruszaj się za pomocą strzałek oraz przycisku Enter."),
    ],
];
const helloConfig = {
    columns: [{ width: 100, wrapWord: true, alignment: "center" }],
};
console.log(table(helloTable, helloConfig));
let isConfig = false;
loop: while (true) {
    let schedules = update.data.schedules;
    const degrees = update.data.degrees;
    try {
        config = JSON.parse((await readFile(configPath)).toString());
        isConfig = true;
    }
    catch (_) { }
    if (!isConfig) {
        let degreeChoices = [];
        degrees.forEach((d) => {
            if ([1, 5, 6, 8, 14, 15, 16, 19, 20].includes(d.id))
                return;
            degreeChoices.push({
                title: d.name,
                value: d.id,
            });
        });
        const { degree } = await prompts({
            type: "select",
            name: "degree",
            message: "Wybierz kierunek:",
            choices: degreeChoices,
        });
        schedules = schedules.filter((s) => {
            return s.degree == degree;
        });
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
        const groups = {
            lab: new Set(),
            exercise: new Set(),
            workshop: new Set(),
            language: new Set(),
            PE: new Set(),
        };
        schedules.forEach((s) => {
            if (s.type === "P" || s.type === "Ps")
                groups.workshop.add(s.group);
            if (s.type === "Ćw")
                groups.exercise.add(s.group);
            if (s.type === "L")
                groups.lab.add(s.group);
            if (s.type === "J")
                groups.language.add(s.group);
            if (s.type === "Wf")
                groups.PE.add(s.group);
        });
        const groupChoice = {
            lab: [],
            exercise: [],
            workshop: [],
            language: [],
            PE: [],
        };
        groups.lab.forEach((lab) => {
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
            : { lab: {} };
        const { exercise } = groupChoice.exercise.length
            ? await prompts({
                type: "select",
                name: "exercise",
                message: "Wybierz grupę ćwiczeniową:",
                choices: groupChoice.exercise.sort((a, b) => a.value - b.value),
            })
            : { exercise: {} };
        const { workshop } = groupChoice.workshop.length
            ? await prompts({
                type: "select",
                name: "workshop",
                message: "Wybierz grupę PS:",
                choices: groupChoice.workshop.sort((a, b) => a.value - b.value),
            })
            : { workshop: {} };
        const { language } = groupChoice.language.length
            ? await prompts({
                type: "select",
                name: "language",
                message: "Wybierz grupę językową:",
                choices: groupChoice.language.sort((a, b) => a.value - b.value),
            })
            : { language: {} };
        const { PE } = groupChoice.PE.length
            ? await prompts({
                type: "select",
                name: "PE",
                message: "Wybierz grupę wf:",
                choices: groupChoice.PE.sort((a, b) => a.value - b.value),
            })
            : { PE: {} };
        config = { degree, semester, lab, exercise, workshop, language, PE };
        await writeFile(configPath, JSON.stringify(config));
        console.log(chalk.bgGreenBright.black("Zapisano ustawienia"));
    }
    const { lab, workshop, exercise, language, PE, semester, degree } = config;
    schedules = schedules.filter((s) => {
        return s.semester == semester;
    });
    schedules = schedules.filter((s) => {
        return s.degree == degree;
    });
    schedules = schedules.filter((s) => {
        return (s.type == "W" ||
            (s.type == "L" && s.group == lab) ||
            ((s.type == "Ps" || s.type == "P") && s.group == workshop) ||
            (s.type == "Ćw" && s.group == exercise) ||
            (s.type == "J" && s.group == language) ||
            (s.type == "Wf" && s.group == PE));
    });
    const subjects = update.data.subjects;
    const plan = [];
    schedules.forEach((s) => {
        plan.push(subjects.find((sub) => sub.id === s.subject));
    });
    const planTable = [];
    days[today] = chalk.bgYellowBright.black(days[today]);
    const hours = {
        "1": [chalk.bold("8:20 - 9:15"), "", "", "", "", "", "", ""],
        "2": [chalk.bold("9:15 - 10:00"), "", "", "", "", "", "", ""],
        "3": [chalk.bold("10:15 - 11:00"), "", "", "", "", "", "", ""],
        "4": [chalk.bold("11:00 - 11:45"), "", "", "", "", "", "", ""],
        "5": [chalk.bold("12:00 - 12:45"), "", "", "", "", "", "", ""],
        "6": [chalk.bold("12:45 - 13:30"), "", "", "", "", "", "", ""],
        "7": [chalk.bold("14:00 - 14:45"), "", "", "", "", "", "", ""],
        "8": [chalk.bold("14:45 - 15:30"), "", "", "", "", "", "", ""],
        "9": [chalk.bold("16:00 - 16:45"), "", "", "", "", "", "", ""],
        "10": [chalk.bold("16:45 - 17:30"), "", "", "", "", "", "", ""],
        "11": [chalk.bold("17:40 - 18:25"), "", "", "", "", "", "", ""],
        "12": [chalk.bold("18:25 - 19:10"), "", "", "", "", "", "", ""],
        "13": [chalk.bold("19:20 - 20:05"), "", "", "", "", "", "", ""],
        "14": [chalk.bold("20:05 - 20:50"), "", "", "", "", "", "", ""],
    };
    planTable.push(days);
    const tableConfig = {
        border: {
            topBody: chalk.green.bold("─"),
            topJoin: chalk.green.bold("┬"),
            topLeft: chalk.green.bold("┌"),
            topRight: chalk.green.bold("┐"),
            bottomBody: chalk.green.bold("─"),
            bottomJoin: chalk.green.bold("┴"),
            bottomLeft: chalk.green.bold("└"),
            bottomRight: chalk.green.bold("┘"),
            bodyLeft: chalk.green.bold("│"),
            bodyRight: chalk.green.bold("│"),
            bodyJoin: chalk.green.bold("│"),
            joinBody: chalk.green.bold("─"),
            joinLeft: chalk.green.bold("├"),
            joinRight: chalk.green.bold("┤"),
            joinJoin: chalk.green.bold("┼"),
        },
        columns: [
            { alignment: "left", width: 18 },
            { alignment: "left", width: 22, wrapWord: true },
            { alignment: "left", width: 22, wrapWord: true },
            { alignment: "left", width: 22, wrapWord: true },
            { alignment: "left", width: 22, wrapWord: true },
            { alignment: "left", width: 22, wrapWord: true },
            { alignment: "left", width: 22, wrapWord: true },
            { alignment: "left", width: 22, wrapWord: true },
        ],
        spanningCells: new Array(),
    };
    schedules.forEach((lesson) => {
        if (lesson.type === "W" && lesson.group === 2)
            return;
        const lessonStart = lesson.hour.toString();
        const lessonSubject = subjects.find((s) => s.id == lesson.subject);
        if (lessonSubject) {
            let nameString = "";
            switch (lesson.weekFlags) {
                case 1:
                    if (isOdd) {
                        return;
                    }
                    else {
                        nameString = lessonSubject.name;
                        tableConfig.spanningCells.push({
                            col: lesson.day,
                            row: lesson.hour,
                            rowSpan: lesson.intervals,
                            verticalAlignment: "middle",
                            alignment: "center",
                        });
                    }
                    break;
                case 2:
                    if (!isOdd) {
                        return;
                    }
                    else {
                        nameString = lessonSubject.name;
                        tableConfig.spanningCells.push({
                            col: lesson.day,
                            row: lesson.hour,
                            rowSpan: lesson.intervals,
                            verticalAlignment: "middle",
                            alignment: "center",
                        });
                    }
                    break;
                case 3:
                    nameString = lessonSubject.name;
                    tableConfig.spanningCells.push({
                        col: lesson.day,
                        row: lesson.hour,
                        rowSpan: lesson.intervals,
                        verticalAlignment: "middle",
                        alignment: "center",
                    });
            }
            if (lesson.type === "W") {
                nameString = chalk.black.bgGreenBright(`\n${nameString}\n`);
            }
            else if (lesson.type === "Ćw") {
                nameString = chalk.black.bgRedBright(`\n${nameString}\n`);
            }
            else
                nameString = chalk.black.bgCyanBright(`\n${nameString}\n`);
            hours[lessonStart][lesson.day] = nameString;
        }
    });
    for (const [_, value] of Object.entries(hours)) {
        planTable.push(value);
    }
    loop2: while (true) {
        const { option } = await prompts({
            type: "select",
            name: "option",
            message: "Menu:",
            choices: [
                { title: "Wyświetl plan", value: 0 },
                { title: "Zmień ustawienia", value: 1 },
                { title: "Zamknij", value: -1 },
            ],
        });
        switch (option) {
            case 0:
                console.log(table(planTable, tableConfig));
                break;
            case 1:
                await rm(configPath);
                isConfig = false;
                break loop2;
            case -1:
                break loop;
        }
    }
}
