import { FC, useState, useRef } from "react";
import Link from "next/link";

import Avatar from "@/components/Avatar";
import Dropdown from "@/components/Dropdown";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { Setting, Logout } from "react-iconly";
import { useAuth } from "@/src/context/auth";

const Profile: FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<boolean>(false);
  const { user, logout } = useAuth();

  useOnClickOutside(divRef, () => setProfile(false));

  return (
    <Dropdown
      state={profile}
      useRef={divRef}
      target={
        <button
          style={{ borderRadius: "50px", height: "40px" }}
          className="none"
          onClick={() => setProfile((prev) => !prev)}
        >
          <Avatar
            src={user?.avatar}
            size={40}
            alt={user?.username}
            username={user?.username}
            link={false}
          />
        </button>
      }
    >
      <div style={{ top: "calc(100% + 14px)" }}>
        <ul>
          <li onClick={() => setProfile(false)} role="button">
            <Link href={`/${user?.username}`} className="item">
              <Avatar
                src={user?.avatar}
                size={50}
                alt={user?.username}
                username={user?.username}
                link={false}
              />
              <div className="info">
                <h5>{user?.username}</h5>
                <p>{"online"}</p>
              </div>
            </Link>
          </li>
          <hr />
          <li onClick={() => setProfile(false)}>
            <Link href={`/${user?.username}/settings`} className="item">
              <Setting set="bulk" />
              <span>Settings</span>
            </Link>
          </li>
          <li onClick={() => setProfile(false)}>
            <button className="none logout item" onClick={() => logout()}>
              <Logout set="bulk" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </Dropdown>
  );
};
export default Profile;
