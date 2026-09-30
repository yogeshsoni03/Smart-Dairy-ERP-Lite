const getCurrentCycle = () => {
  const today = new Date();
  const day = today.getDate();

  if (day <= 10) {
    return {
      cycle: "1-10",
      startDay: 1,
      endDay: 10,
    };
  }

  if (day <= 20) {
    return {
      cycle: "11-20",
      startDay: 11,
      endDay: 20,
    };
  }

  return {
    cycle: "21-End",
    startDay: 21,
    endDay: new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate(),
  };
};

module.exports = {
  getCurrentCycle,
};