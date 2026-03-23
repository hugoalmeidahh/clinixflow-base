import { eq } from "drizzle-orm";

import { db } from "../db";
import { usersTable } from "../db/schema";

interface Params {
  userId: string;
}

export const getUserProfile = async ({ userId }: Params) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });

  return user;
};
