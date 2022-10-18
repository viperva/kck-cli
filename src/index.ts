import axios from "axios";
import prompts from "prompts";
import chalk from "chalk";
import table from "table";
import { schedules, update } from "./types.js";

const API_URL = "https://schedule.wvffle.net";

const { data: updates } = await axios.get(API_URL + "/updates");

const latestUpdate = updates[0];

const latestUpdateHash = latestUpdate.hash;

const { data: update }: { data: update } = await axios.get(
  API_URL + "/updates/" + latestUpdateHash
);

const schedules: schedules = update.data.schedules;

const { isStationary } = await prompts({
  type: "toggle",
  name: "isStationary",
  message: "Wyberz rodzaj studiów za pomocą strzałek:",
  active: "Stacjonarne",
  inactive: "Niestacjonarne",
  initial: true,
});

console.log(isStationary);
