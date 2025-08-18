import { Box, CircularProgress, Container } from "@mui/material";

import DetailCard from "@/components/detail/DetailCard";
import Breadcumb from "@/components/breadcumb/Breadcumb";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Detail = () => {
  const params = useParams();
  const [appliance, setAppliance] = useState();

  useEffect(() => {
    fetch(`/appliance/${params.id}`, {
        method: 'GET', // Or 'POST' if you're sending data
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      .then((res) => {
      res.json().then((data) => {
        setAppliance(data);
      });
    });
  }, [params.id]);

  return appliance ? (
    <Container sx={{ mt: 5 }}>
      <Breadcumb name={appliance.name} />

      {appliance ? <DetailCard appliance={appliance} /> : null}
    </Container>
  ) : (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Detail;
