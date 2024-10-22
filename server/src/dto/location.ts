import { Coordinates } from "@prisma/client";

export type CreateCoordinates = Pick<Coordinates, "latitude" | "longitude">;
