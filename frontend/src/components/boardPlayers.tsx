import styled from "styled-components";
import { useAuth } from "../context/auth";
import Avatar from "./Avatar";

interface Props {
    idk: any;
    something: any;
}

const BoardPlayers: React.FC<Props> = ({idk, something}) => {

    const auth = useAuth();
    const user = auth?.user;
    

    return (
        <Style>
            <Avatar src={user?.avatar} />
        </Style>
    );
};

export default BoardPlayers;

const Style = styled.div`

`