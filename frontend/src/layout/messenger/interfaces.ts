// conversations component props
export interface ConversationProps {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadMessages: boolean;
  state: "private" | "protected" | "public" | null;
}

// Right side informations component of the messenger props
export interface InfoProps {
  data: DataType;
  setToggle: (value: boolean) => void;
  toggle: boolean;
  roomId: string;
  setState: (value: "private" | "protected" | "public" | null) => void;
  state: "private" | "protected" | "public" | null;
}

// room participants component
export interface ParticipantType {
  id: string;
  username: string;
  avatar: string;
  isOwner: boolean;
  isAdmin: boolean;
  isMutted: boolean;
  isBanned: boolean;
}
export interface MessagesType {
  id: string;
  roomId: string;
  username: string;
  avatar: string;
  message: string;
  time: Date;
  blockedUsers: string[];
  bannedUsers: string[];
  isRoom: boolean;
}

// a room or direct conversation data type
export interface DataType {
  id: string;
  userId: string;
  isBlocked: boolean;
  name: string;
  avatar: string | null;
  state: "private" | "protected" | "public" | null;
  participants: ParticipantType[] | null;
  isAdmin: boolean;
  isOwner: boolean;
  messages: MessagesType[];
}
