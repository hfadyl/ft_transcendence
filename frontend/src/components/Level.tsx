import { FC, useMemo } from "react";
import Tippy from "@tippyjs/react";
import { getLevel } from "@/src/tools";

import Level_1_lg from "@/images/levels/newbie-lg.svg";
import Level_2_lg from "@/images/levels/nadi-lg.svg";
import Level_3_lg from "@/images/levels/agent-lg.svg";
import Level_4_lg from "@/images/levels/epic-lg.svg";
import Level_5_lg from "@/images/levels/legend-lg.svg";
import Level_6_lg from "@/images/levels/3ankoob-lg.svg";

import Level_1_sm from "@/images/levels/newbie-sm.svg";
import Level_2_sm from "@/images/levels/nadi-sm.svg";
import Level_3_sm from "@/images/levels/agent-sm.svg";
import Level_4_sm from "@/images/levels/epic-sm.svg";
import Level_5_sm from "@/images/levels/legend-sm.svg";
import Level_6_sm from "@/images/levels/3ankoob-sm.svg";

import Level_1_md from "@/images/levels/newbie-md.svg";
import Level_2_md from "@/images/levels/nadi-md.svg";
import Level_3_md from "@/images/levels/agent-md.svg";
import Level_4_md from "@/images/levels/epic-md.svg";
import Level_5_md from "@/images/levels/legend-md.svg";
import Level_6_md from "@/images/levels/3ankoob-md.svg";

interface Props {
  score?: number;
  size?: "sm" | "md" | "lg";
}
const Level: FC<Props> = ({ score = 0, size = "md" }) => {
  const grade = useMemo(() => getLevel(score), [score]);
  return (
    <Tippy content={grade} placement="left">
      <div
        style={{
          minWidth: ((size === "sm" && "18px") ||
            (size === "md" && "40px") ||
            (size === "lg" && "100px")) as string,
        }}
      >
        {grade == "Newbie" && size === "sm" && <Level_1_sm />}
        {grade == "Newbie" && size === "md" && <Level_1_md />}
        {grade == "Newbie" && size === "lg" && <Level_1_lg />}
        {grade == "Nadi" && size === "sm" && <Level_2_sm />}
        {grade == "Nadi" && size === "md" && <Level_2_md />}
        {grade == "Nadi" && size === "lg" && <Level_2_lg />}
        {grade == "Agent" && size === "sm" && <Level_3_sm />}
        {grade == "Agent" && size === "md" && <Level_3_md />}
        {grade == "Agent" && size === "lg" && <Level_3_lg />}
        {grade == "Expic" && size === "sm" && <Level_4_sm />}
        {grade == "Expic" && size === "md" && <Level_4_md />}
        {grade == "Expic" && size === "lg" && <Level_4_lg />}
        {grade == "Legend" && size === "sm" && <Level_5_sm />}
        {grade == "Legend" && size === "md" && <Level_5_md />}
        {grade == "Legend" && size === "lg" && <Level_5_lg />}
        {grade == "3ankoob" && size === "sm" && <Level_6_sm />}
        {grade == "3ankoob" && size === "md" && <Level_6_md />}
        {grade == "3ankoob" && size === "lg" && <Level_6_lg />}
      </div>
    </Tippy>
  );
};
export default Level;
