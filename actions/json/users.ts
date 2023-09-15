import axios from "axios";
import { BunFile } from "bun";

type CommandOptions = {
  output: string;
  limit: string;
  force: boolean;
};

const writeUsersToFile = async (users: Array<any>, file: BunFile) => {
  await Bun.write(file, JSON.stringify(users, null, 2));
  console.log(`\nUsers saved to ${file.name}`);
};

export const fetchJsonUsers = async (options: CommandOptions) => {
  const { data: users } = await axios.get(
    `https://jsonplaceholder.typicode.com/users?_limit=${options.limit}`,
  );

  const file = Bun.file(options.output);
  const fileExists = await file.exists();

  if (fileExists) {
    if (options.force) {
      writeUsersToFile(users, file);
    } else {
      console.log(
        `File ${file.name} already exists. Use --force to overwrite.`,
      );
    }
  } else {
    writeUsersToFile(users, file);
  }
};
