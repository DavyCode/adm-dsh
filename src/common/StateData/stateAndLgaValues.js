import states from "./state.json";
import { nestedStatesWithLGA } from "./lgaValues";
export const stateValues = states.map((state, id) => {
  return { value: state.state.name, label: state.state.name, stateId: id };
});
export const lgaValues = nestedStatesWithLGA(states, "state", "locals");
