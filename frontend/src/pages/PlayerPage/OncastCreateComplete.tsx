import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  Typography,
  styled,
  makeStyles,
} from "@mui/material";

import { ButtonProps } from "@mui/material/Button";
// import NavBar from "../../component/Common/Navbar";
import styles from "./OncastCreateComplete.module.css";

const CreateButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: "black",
  backgroundColor: "#EDEDED",
  "&:hover": {
    backgroundColor: "#444444",
  },
}));

const CancleButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: "white",
  backgroundColor: "#DA0037",
  "&:hover": {
    backgroundColor: "#444444",
  },
}));

const OncastCreateComplete: React.FC = () => {
  const navigate = useNavigate();

  const comeBackHome = () => {
    console.log("??");
    navigate("/");
  };

  const playOncast = () => {
    navigate("/Player");
  };

  return (
    <div>
      {/* <NavBar /> */}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "90vh" }}
      >
        <Grid item xs={12}>
          <div className={styles.centerContainer}>
            온캐스트가 생성되었습니다.
            <br />
            바로 재생하시겠습니까?
            <div>
              <CreateButton
                onClick={playOncast}
                className={styles.createButton}
              >
                바로 듣기
              </CreateButton>
              <CancleButton
                onClick={comeBackHome}
                className={styles.cancleButton}
              >
                나중에 듣기
              </CancleButton>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default OncastCreateComplete;
