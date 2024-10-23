import { get_qs_values } from "./qs";
import { loadState } from "./localStorage";
import { subOptions } from "../config/legends/subs/subs";
import COLORWAYS from "../config/colorways/colorways";
import settings from "../config/settings_user_default.json";

const starting_colorway_options = [
  "cafe",
  "mecha",
  "lunar",
  "jamon",
  "bento",
  "olivia",
  "striker",
  "bushido",
  "oblivion",
  "nautilus",
  "vilebloom",
  "handarbeit",
  "hammerhead",
  "modern_dolch",
  "blue_samurai",
  "red_samurai",
];

const starting_layout_options = ["60iso", "65"];

let randomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getInitialState = () => {
  let qs = get_qs_values();
  let saved_colorways = loadState();
  let initial = { ...settings }; // Create a copy of the settings object

  // If saved colorways exist, update custom colorways
  if (saved_colorways) {
    initial = {
      ...initial,
      colorways: {
        ...initial.colorways,
        custom: saved_colorways.settings,
      },
    };
  }

  // Set random initial values
  if (!qs) {
    initial = {
      ...initial,
      colorways: {
        ...initial.colorways,
        active: randomItem(starting_colorway_options),
      },
      case: {
        ...initial.case,
        layout: randomItem(starting_layout_options),
      },
      keys: {
        ...initial.keys,
        legendSecondaryStyle: randomItem([
          randomItem(subOptions),
          "",
        ]),
      },
    };
  }

  // Update active colorway if saved colorways exist
  if (saved_colorways && saved_colorways.active) {
    initial = {
      ...initial,
      colorways: {
        ...initial.colorways,
        active: saved_colorways.active,
      },
    };
  }

  // Set debug mode from query string
  if (qs?.["debug"]) {
    initial = {
      ...initial,
      settings: {
        ...initial.settings,
        debug: true,
      },
    };
  }

  // Set initial values from query string
  if (qs?.["size"]) {
    initial = {
      ...initial,
      case: {
        ...initial.case,
        layout: qs["size"],
      },
    };
  }

  if (qs?.["colorway"]) {
    if (typeof qs["colorway"] === "object") {
      if (!initial.colorways.custom.find((x) => x.id === qs["colorway"].id)) {
        initial = {
          ...initial,
          colorways: {
            ...initial.colorways,
            custom: [...initial.colorways.custom, qs["colorway"]],
            active: qs["colorway"].id,
          },
        };
      }
    } else {
      initial = {
        ...initial,
        colorways: {
          ...initial.colorways,
          active: qs["colorway"],
        },
      };
    }
  }

  if (qs?.["legend"]) {
    initial = {
      ...initial,
      keys: {
        ...initial.keys,
        legendPrimaryStyle: qs["legend"],
      },
    };
  }

  if (qs?.["sub"]) {
    initial = {
      ...initial,
      keys: {
        ...initial.keys,
        legendSecondaryStyle: qs["sub"],
      },
    };
  }

  if (qs?.["cc"]) {
    initial = {
      ...initial,
      case: {
        ...initial.case,
        primaryColor: `#${qs["cc"]}`,
        autoColor: false,
      },
    };
  }

  if (qs?.["cf"]) {
    initial = {
      ...initial,
      case: {
        ...initial.case,
        material: qs["cf"],
      },
    };
  }

  // Set scene color based on the active colorway
  let accent = "";
  if (typeof qs?.["colorway"] === "object") {
    accent = qs["colorway"].swatches.accent.background;
  } else {
    accent =
      COLORWAYS[initial?.colorways?.active]?.swatches?.accent?.background;
  }
  initial = {
    ...initial,
    settings: {
      ...initial.settings,
      sceneColor: accent,
    },
  };

  return initial;
};

export const initial_settings = getInitialState();
