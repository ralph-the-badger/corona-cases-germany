import { useState, useEffect } from "react";
import { csv } from "d3";

// const csvUrl = 'https://gist.githubusercontent.com/ralph-the-badger/203da1ddde4cb4ede4d8a954d5910183/raw/6f4d607a6b718f25bb2baaebdce982ced6e88333/rki_covid_age_groups.csv'
const csvUrl =
  "https://gist.githubusercontent.com/ralph-the-badger/203da1ddde4cb4ede4d8a954d5910183/raw/98faff350db61f3eec2a0e58bd77a106b451fd11/rki_covid_age_groups.csv";
// const csvUrl =
//   "https://gist.githubusercontent.com/ralph-the-badger/203da1ddde4cb4ede4d8a954d5910183/raw/31b3ad36706d512fb697a057b4902bdd9e714692/rki_covid_age_groups.csv";
// const csvUrl = 'https://gist.githubusercontent.com/ralph-the-badger/203da1ddde4cb4ede4d8a954d5910183/raw/039dce111acc80892e4dbb2b40ab3a084bc4f9af/rki_covid_age_groups_incidence.csv'

const useData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const row = (d) => {
      d.id = +d.id;
      d.kw = +d.kw;
      d.gesamt = +d.gesamt;
      d["90+"] = +d["90+"];
      d["85_89"] = +d["85_89"];
      d["80_84"] = +d["80_84"];
      d["75_79"] = +d["75_79"];
      d["70_74"] = +d["70_74"];
      d["65_69"] = +d["65_69"];
      d["60_64"] = +d["60_64"];
      d["55_59"] = +d["55_59"];
      d["50_54"] = +d["50_54"];
      d["45_49"] = +d["45_49"];
      d["40_44"] = +d["40_44"];
      d["35_39"] = +d["35_39"];
      d["30_34"] = +d["30_34"];
      d["25_29"] = +d["25_29"];
      d["20_24"] = +d["20_24"];
      d["15_19"] = +d["15_19"];
      d["10_14"] = +d["10_14"];
      d["5_9"] = +d["5_9"];
      d["0_4"] = +d["0_4"];
      return d;
    };

    csv(csvUrl, row).then((data) => {
      const condensedData = data.map((cd) => {
        const condensedDataObject = {
          id: parseInt(cd.id),
          kw: cd.kw,
          gesamt: parseInt(cd.gesamt),
          "90+": parseInt(cd["90+"]),
          "80_89": parseInt(cd["80_84"]) + parseInt(cd["85_89"]),
          "70_79": parseInt(cd["70_74"]) + parseInt(cd["75_79"]),
          "60_69": parseInt(cd["60_64"]) + parseInt(cd["65_69"]),
          "50_59": parseInt(cd["50_54"]) + parseInt(cd["55_59"]),
          "40_49": parseInt(cd["40_44"]) + parseInt(cd["45_49"]),
          "30_39": parseInt(cd["30_34"]) + parseInt(cd["35_39"]),
          "20_29": parseInt(cd["20_24"]) + parseInt(cd["25_29"]),
          "10_19": parseInt(cd["10_14"]) + parseInt(cd["15_19"]),
          "0_9": parseInt(cd["0_4"]) + parseInt(cd["5_9"]),
        };
        return condensedDataObject;
      });
      condensedData.columns = [
        "id",
        "kw",
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
      setData(condensedData);
    });
  }, []);
  return data;
};

export default useData;
