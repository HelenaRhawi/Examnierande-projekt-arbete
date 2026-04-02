import { seedMenuIfEmpty } from "./seedMenu.js";
import { seedUsersIfEmpty } from "./seedUrsers.js";

export function runSeeders() {
  seedMenuIfEmpty();
  seedUsersIfEmpty();
}
