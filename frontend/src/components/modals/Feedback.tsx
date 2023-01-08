import { FC } from "react";
import Modale from "@/layout/Modal";
import { Props } from "./interface";
import Link from "next/link";

const Feedback: FC<Props> = ({ isOpen, setIsOpen, contentLabel }) => {
  return (
    <Modale isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <p className="text-center">
        If you have any feedback, please send it to{" "}
        <Link href="mailto:mohamedaitsimhand@gmail.com">PongChamp</Link>
      </p>
    </Modale>
  );
};
export default Feedback;
