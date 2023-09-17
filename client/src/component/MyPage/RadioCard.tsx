import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CardMedia from "@mui/material/CardMedia";

type RecipeReviewCardProps = {
  title: string;
  subheader: string;
  description: string;
  feeling: string;
  image: string;
};

export default function RecipeReviewCard({
  title,
  subheader,
  description,
}: RecipeReviewCardProps) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        height: "300px",
      }}
    >
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            style={{ textAlign: "left" }}
          >
            {title}
          </Typography>
          <Typography variant="h6" component="div" color="primary">
            JOYFUL
          </Typography>
        </div>
        <Typography variant="body2" color="text.secondary">
          <h1>{subheader}</h1>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <IconButton
          sx={{
            position: "absolute",
            right: 8,
            bottom: 8,
            color: "#FF5C58",
          }}
          aria-label="add to favorites"
        ></IconButton>
      </CardContent>
    </Card>
  );
}
