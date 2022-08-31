export function preFabchicken(auxChicken, id, now) {
  if (auxChicken) {
    return {
      name: auxChicken.name,
      id: id,
      dna: parseInt(auxChicken.dna._hex, 16),
      level: parseInt(auxChicken.level._hex, 16),
      readyTime:
        now >= parseInt(auxChicken.readyTime._hex, 16)
          ? "Ready"
          : getTimeDays(parseInt(auxChicken.readyTime._hex, 16), now),
      winCount: parseInt(auxChicken.winCount._hex, 16),
      lossCount: parseInt(auxChicken.lossCount._hex, 16),
      gestationTime:
        now >= parseInt(auxChicken.gestationTime._hex, 16)
          ? "Not an egg"
          : getTimeDays(parseInt(auxChicken.breedingTime._hex, 16), now),
      breedingTime:
        now >= parseInt(auxChicken.breedingTime._hex, 16)
          ? "Ready"
          : getTimeDays(parseInt(auxChicken.breedingTime._hex, 16), now),
    };
  } else {
    return {};
  }
}

export function getTimeDays(then, now) {
  let sec_num = then - now; // don't forget the second param
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  let seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}
