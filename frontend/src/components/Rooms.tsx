import { useState } from "react";
import { Password, User, Chat } from "react-iconly";
import styled from "styled-components";
import GridEffect from "@/components/GridEffect";
import Avatar from "@/components/Avatar";
import { useRooms, RoomType, RoomParticipantsType } from "@/src/hooks/useRooms";

const Rooms = () => {
  const [filterBy, setFilterBy] = useState<"all" | "public" | "protected">("all");
  const { rooms } = useRooms();

  return (
    <Style>
      <header>
        <h1>
          <Chat set="bold" primaryColor="#EB8153" size={35} />
          Popular Rooms
        </h1>
        <div className="filters">
          {["public", "protected", "all"].map((f, i) => (
            <button
              className={filterBy === f ? "" : "secondary outline"}
              onClick={() => setFilterBy(f as any)}
              key={i}
            >
              {f}
            </button>
          ))}
        </div>
      </header>
      {rooms?.length === 0 ? (
        <p className="no-content">No rooms found</p>
      ) : (
        <GridEffect>
          {Array.isArray(rooms) &&
            rooms
              ?.filter((r) => (filterBy !== "all" ? r.state === filterBy : r))
              ?.map((room, index) => <Room key={index} {...room} />)}
        </GridEffect>
      )}
    </Style>
  );
};
export default Rooms;

const Style = styled.section`
  margin-bottom: 100px;
  header {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    h1 {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .filters {
      display: flex;
      overflow: hidden;
      border-radius: 5px;
      border: 1px solid var(--border);
      > button {
        border-radius: 0;
        border: none;
        padding-left: 1rem;
        padding-right: 1rem;
        :hover {
          transform: translateY(0);
        }
        :focus-within {
          box-shadow: none;
        }
        :nth-child(2) {
          border-left: none;
          border-right: none;
        }
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      > * {
        flex: 1;
      }

      .filters > * {
        flex: 1;
      }
    }
  }
  .card {
    max-height: 230px;
    .card-content {
      padding: 20px;
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 10px;
    h3 {
      word-break: break-all;
      margin-bottom: 5px;
    }
  }
  .text {
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--text-300);
    p {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 10px;
    margin-top: auto;

    .participants {
      display: flex;
      gap: 5px;
    }
    button {
      min-width: 120px;
    }
  }

  form {
    position: absolute;
    inset: 0;
    background-color: var(--background-200);
    z-index: 1;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 10px;
    border-radius: 9px;
    .actions {
      display: flex;
      gap: 10px;
    }
  }
  .joined {
    color: var(--text-200);
  }
`;

const Room = ({ state, name, participants, id, isJoined }: RoomType) => {
  const [password, setPassword] = useState<string>("");
  const [protectedRoom, setProtectedRoom] = useState<boolean>(false);
  const { handleJoin, passwordError } = useRooms();

  return (
    <div className="card">
      <div className="card-content">
        {protectedRoom && (
          <form onSubmit={(e) => handleJoin(e, id, password)}>
            <label htmlFor={`password-${id}`}>Enter room password</label>
            <input
              type="password"
              id={`password-${id}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? "error" : ""}
            />
            {passwordError && <p className="error">{passwordError}</p>}
            <div className="actions">
              <button
                onClick={() => {
                  setProtectedRoom(false);
                  setPassword("");
                }}
                className="secondary"
              >
                Cancel
              </button>
              <button type="submit">Join</button>
            </div>
          </form>
        )}
        <div className="header">
          <div>
            <h3>{name}</h3>
            <div className="text">
              <span>{participants?.length} participants</span>
              <p>
                {state === "public" ? <User set="bulk" /> : <Password set="bulk" />}
                {state}
              </p>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="participants">
            {participants?.map((member: RoomParticipantsType, index: number) =>
              index < 4 ? (
                <Avatar
                  key={index}
                  src={member?.avatar}
                  size={35}
                  alt={member?.username}
                  username={member?.username}
                />
              ) : null
            )}
          </div>
          {isJoined ? (
            <span className="joined">already joined</span>
          ) : (
            <button
              className="secondary outline"
              onClick={(e) => {
                state === "protected" ? setProtectedRoom(true) : handleJoin(e, id, password);
              }}
            >
              Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
