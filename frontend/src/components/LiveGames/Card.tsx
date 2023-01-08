import { FC } from "react";
import Avatar from "@/components/Avatar";
import Map from "@/components/Map";
import Link from "next/link";
import { CardStyle } from "./styles";

export interface CardProps {
  id: string;
  map: string;
  players: {
    username: string;
    avatar: string;
  }[];
}

export const Card: FC<CardProps> = (props) => {
  return (
    <CardStyle>
      <Link href={`/game/${props.id}?map=default&requestType=toWatch`}>
        <div className="top">
          <div className="avatars">
            <Avatar src={props.players[0].avatar} size={137} radius={0} link={false} />
            <Avatar src={props.players[1].avatar} size={137} radius={0} link={false} />
          </div>
          <div className="map">
            <Map mapName={props.map} />
          </div>
        </div>
        <h5>
          {props.players[0].username} vs {props.players[1].username}
        </h5>
        <b>{props.map}</b>
      </Link>
    </CardStyle>
  );
};
