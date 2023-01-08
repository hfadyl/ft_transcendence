import { useState, useRef } from "react";
import styled from "styled-components";
import { Notification as NotificationIcon } from "react-iconly";
import moment from "moment";

import Dropdown from "@/components/Dropdown";
import Request from "@/components/dropdowns/Notifications/Request";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useNotifications } from "@/hooks/useNotifications";

const Notifications = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<boolean>(false);
  const { notifications, updateNotifications } = useNotifications();

  useOnClickOutside(divRef, () => {
    setProfile(false);
    if (profile) updateNotifications();
  });

  const handleDropdown = async () => {
    setProfile((prev) => !prev);
    if (profile || notifications?.filter((n) => !n.seen).length === 0) return;
    await fetch(`${process.env.USERS}/notificationsSeen`, {
      method: "POST",
      credentials: "include",
    });
  };

  return (
    <Dropdown
      state={profile}
      useRef={divRef}
      target={
        <button className="icon md" onClick={handleDropdown}>
          {notifications?.length > 0 && notifications?.filter((n) => !n.seen).length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "8px",
                right: "10px",
                background: "#F65164",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
              }}
            ></span>
          )}
          <NotificationIcon set="bulk" size={20} />
        </button>
      }
    >
      <Style style={{ top: "calc(100% + 14px)" }}>
        <header>
          <h5>Notifications</h5>
          {notifications.length > 0 && notifications?.filter((n) => !n.seen).length > 0 && (
            <span>{notifications?.filter((n) => !n.seen).length}</span>
          )}
        </header>
        {notifications?.length > 0 ? (
          <ul>
            {notifications
              ?.sort((a: any, b: any) => moment(b.createdAt).date() - moment(a.createdAt).date())
              ?.map((req, index) => (
                <li className={`item ${req.seen === false && "active"}`} key={index}>
                  {req.type === "request" && <Request data={req} />}
                </li>
              ))}
          </ul>
        ) : (
          <p>No notifications</p>
        )}
      </Style>
    </Dropdown>
  );
};
export default Notifications;

const Style = styled.div`
  width: 350px !important;
  padding-top: 15px !important;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-left: 8px;
    span {
      font-size: 14px;
      font-family: var(--font-medium);
      font-weight: 700;
      background: var(--danger);
      padding: 2px 8px;
      border-radius: 50px;
      text-align: center;
    }
  }
  .active {
    position: relative;
    ::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 1px;
      transform: translateY(-50%);
      width: 10px;
      height: 10px;
      border-radius: 10px;
      background-color: var(--primary);
    }
  }
  .time {
    font-weight: 400;
    font-size: 14px;
    line-height: 15px;
    color: var(--text-200);
  }
  .item {
    align-items: flex-start !important;
    .avatar {
      margin-top: 8px;
    }
    h6 {
      b:first-child {
        font-family: var(--font-bold);
        margin-right: 5px;
      }
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 5px;
      button {
        flex: 1;
      }
      .secondary {
        border-color: var(--border);
      }
    }

    > div {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
`;
