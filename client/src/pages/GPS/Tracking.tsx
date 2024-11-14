import "mapbox-gl/dist/mapbox-gl.css";
import { useGetCheckinsQuery } from "@api/locationApi";
import Main from "./Main";

const Tracking = () => {
  const { data, isLoading } = useGetCheckinsQuery({});
  if (isLoading) {
    return <div>...Loading</div>;
  }
  if (data) {
    const users = data.data.users;
    return <Main users={users}></Main>;
  }
};

export default Tracking;
