import { useState, useEffect } from "react";
import ReactDropdown from "react-dropdown";
import useData from "./useData";
// import Dropdown from './Dropdown/Dropdown';
import Linechart from "./Linechart/Linechart";
import Percentages from "./Percentages/Percentages";
import Legend from "./Legend/Legend";

import "./App.css";
import "./react-dropdown.css";

const attributes = [
  { value: "gesamt", label: "Alle Altersgruppen" },
  { value: "0_9", label: "0-9 Jahre" },
  { value: "10_19", label: "10-19 Jahre" },
  { value: "20_29", label: "20-29 Jahre" },
  { value: "30_39", label: "30-39 Jahre" },
  { value: "40_49", label: "40-49 Jahre" },
  { value: "50_59", label: "50-59 Jahre" },
  { value: "60_69", label: "60-69 Jahre" },
  { value: "70_79", label: "70-79 Jahre" },
  { value: "80_89", label: "80-89 Jahre" },
  { value: "90+", label: "90+ Jahre" },
];

// define age groups and color scheme
const allGroups = [
  "gesamt",
  "90+",
  "80_89",
  "70_79",
  "60_69",
  "50_59",
  "40_49",
  "30_39",
  "20_29",
  "10_19",
  "0_9",
];
const allColors = [
  "#000000",
  "#000000",
  "#000B1A",
  "#001128",
  "#001A43",
  "#002861",
  "#003F97",
  "#5C84BD",
  "#97B1D5",
  "#BDCDE4",
  "#DDE5F1",
];

const getLabel = (value) => {
  for (let i = 0; attributes.length; i++) {
    if (attributes[i].value === value) {
      return attributes[i].label;
    }
  }
};

const useResizeObserver = (ref) => {
  const [newDimensions, setNewDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setNewDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return newDimensions;
};

function App() {
  const data = useData();

  const initialYValue = attributes[0].value;

  const [casesYAttribute, setCasesYAttribute] = useState(initialYValue);

  const dimensions = {
    width: window.innerWidth,
    height: window.innerHeight * 0.4,
    margin: {
      top: 50,
      right: 50,
      bottom: 75,
      left: 75,
    },
  };

  return (
    <div className="App">
      <>
        <h1>Corona-Fälle nach Altersgruppen</h1>
        <div className="dropdown-menu">
          <span className="dropdown-label">
            Bitte wählen Sie eine Altersgruppe:{" "}
          </span>
          <ReactDropdown
            options={attributes}
            id="y-select"
            value={casesYAttribute}
            onChange={(option) => setCasesYAttribute(option.value)}
          />
        </div>
        <Linechart
          data={data}
          useResizeObserver={useResizeObserver}
          dimensions={dimensions}
          casesYAttribute={casesYAttribute}
          getLabel={getLabel}
          allGroups={allGroups}
          allColors={allColors}
        />
        <Percentages
          data={data}
          useResizeObserver={useResizeObserver}
          dimensions={dimensions}
          casesYAttribute={casesYAttribute}
          getLabel={getLabel}
          allGroups={allGroups}
          allColors={allColors}
        />
        <Legend
          useResizeObserver={useResizeObserver}
          dimensions={dimensions}
          allGroups={allGroups}
          allColors={allColors}
        />
        <div class="information">
          <h2>Beschreibung</h2>
          <p>
            Die Grafiken visualisieren den Verlauf der Corona-Fälle
            unterschiedlicher Altersgruppen von der Kalenderwoche (KW) 10 2020
            bis zur KW 4 2022. Zum einen werden die absoluten Fallzahlen
            dargestellt, als Übersicht über alle Altersklassen oder noch
            Altersklassen aufgeteilt. Zum anderen werden die relativen Anteile
            einzelner Altersgruppen ausgehend von den Gesamtfallzahlen aller
            Altersgruppen beschrieben.
          </p>
          <h2>Daten</h2>
          <p>
            Die Daten stammen vom Robert-Koch-Institut (RKI) und beschreiben den
            Verlauf der Corona-Fälle einzelner Altersgruppen (
            <a
              href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Altersverteilung.html"
              target="_blank"
            >
              https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Altersverteilung.html
            </a>
            ).
          </p>
          <p>
            Die Daten des RKI wurden editiert. Die Daten des RKI umfassen
            Altersgruppen mit einer Spanne von 5 Jahren: 0-4 Jahre, 5-9 Jahre,
            ..., 80-84 Jahre, 85-89 Jahre und 90+ Jahre. In dieser Analyse
            wurden jeweils 2 Altersgruppen aufaddiert, um Altersgruppen mit
            einer Spanne von 10 Jahren zu erhalten: 0-9 Jahre, 10-19 Jahre,
            80-89 Jahre und 90+ Jahre. Des Weiteren wurden die absoluten
            Fallzahlen dazu verwendet, um die relativen Fallzahlen der einzelnen
            Altersgruppen ausgehend von den gesamten Fällen aller Altersgruppen
            zu errechnen.
          </p>
          <p>
            Die Daten des Robert-Koch-Instituts dienen lediglich einem privaten
            Nutzen. Die Daten werden nicht kommerziell genutzt.
          </p>
          <h2>Programmierung</h2>
          <p>React, D3</p>
        </div>
      </>
    </div>
  );
}

export default App;
