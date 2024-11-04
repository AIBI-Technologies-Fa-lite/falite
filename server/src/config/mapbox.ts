import mapbox from "@mapbox/mapbox-sdk";
import directions from "@mapbox/mapbox-sdk/services/directions";
import dotenv from "dotenv";
dotenv.config();
export const mapboxClient = mapbox({ accessToken: process.env.MAPBOX_ACCESS_TOKEN || "" });
export const directionsClient = directions(mapboxClient);
