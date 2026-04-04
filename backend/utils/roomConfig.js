const ROOM_CATEGORIES = [
  {
    key: "NON_AC_6",
    name: "Non AC 6 Sharing",
    roomType: "Non AC",
    capacity: 6,
    start: 601,
    prefix: "N"
  },
  {
    key: "AC_6",
    name: "AC 6 Sharing",
    roomType: "AC",
    capacity: 6,
    start: 601,
    prefix: "A"
  },
  {
    key: "NON_AC_4",
    name: "Non AC 4 Sharing",
    roomType: "Non AC",
    capacity: 4,
    start: 401,
    prefix: "N"
  },
  {
    key: "AC_4",
    name: "AC 4 Sharing",
    roomType: "AC",
    capacity: 4,
    start: 401,
    prefix: "A"
  },
  {
    key: "AC_3",
    name: "AC 3 Sharing",
    roomType: "AC",
    capacity: 3,
    start: 301,
    prefix: "A"
  }
];

const buildRoomNumbers = ({ prefix, start }) =>
  Array.from({ length: 20 }, (_, index) => `${prefix}${start + index}`);

module.exports = { ROOM_CATEGORIES, buildRoomNumbers };
