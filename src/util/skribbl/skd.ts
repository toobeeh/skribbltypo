export const convertOldSkd = (oldSkd: number[][][]): number[][] => {
  const commands = oldSkd.flat();
  //return commands;
  commands.forEach(command => {
    switch (command[0]) {
      case 2:
        command[0] = 1;
      case 0:
        if (command[1] > 11) command[1] += 2; // if index > 11, skip new cyan color column
        if (command[1] > 21) command[1] += 2; // if index > 11, skip new skin tone color column
        /* command[1] = command[1] % 2 == 0 ? // if command is fill or brush
            command[1] + (command[1] / 2) : // if color is even, add half of index
            command[1] + ((command[1] + 1) / 2); // if odd, add half of index+1 */
        break;
      case 1:
        command = [command[0], 0, command[1], command[2], command[3], command[4], command[5]];
        break;
    }
  });
  return commands;
};