const moment = require("moment");
require("moment/locale/vi");
exports.formatTime = async (data) => {
  try {
    const creatAT = data;
    const currentTime = moment();
    const creatTime = moment(creatAT.time);
    const duration = moment.duration(currentTime.diff(creatTime));
    const minutesAgo = duration.asMinutes();
    moment.locale("vi");
    let formattedTime = "";

    if (minutesAgo < 1) {
      formattedTime = "vừa xong";
    } else if (minutesAgo < 60) {
      formattedTime = `${Math.floor(minutesAgo)} phút trước`;
    } else if (duration.asHours() < 24) {
      formattedTime = moment.duration(minutesAgo, "minutes").humanize({ withSuffix: true });
    } else if (duration.asDays() < 2) {
      formattedTime = "hôm qua";
    } else {
      formattedTime = moment.duration(duration.asDays(), "days").humanize({ withSuffix: true });
    }

    return formattedTime;
  } catch (err) {
    console.log(err);
    return;
  }
};
