"use strict";
window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
const expelledStudents = [];
const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
};

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  blood: "half",
  image: "",
  house: "",
  status: "Not expelled",
  squad: false,
  prefect: false,
};

let filterBy = "all";

let popUp = document.querySelector("#popUp article");

function start() {
  console.log("ready");

  loadJSON();
  registerButtons();
}

//CALL THIS FUNCTION IN DISPLAY LIST
function displayGeneralData() {
  //number of all students displayed
  document.querySelector("#allStudentsNum span").textContent =
    allStudents.length;

  //number of students in each house displayed
  const elements = document.querySelectorAll("[data-housenum]");
  elements.forEach((e) => {
    const array = allStudents.filter((t) => {
      return t.house == e.dataset.housenum;
    });
    e.textContent = array.length;
  });
  //number of expelled students displayed
  document.querySelector("#expelledStudentsNum span").textContent =
    expelledStudents.length;
}

//REGISTER BUTTONS FUNCTION
function registerButtons() {
  document
    .querySelectorAll("[data-action = 'filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action = 'sort']")
    .forEach((button) => button.addEventListener("click", selectSort));

  document.querySelector(".searchBar").addEventListener("input", searchBar);
}
//SEARCHING FUNCTION
function searchBar(e) {
  const searchString = e.target.value.toLowerCase();
  const searchedStudents = allStudents.filter((student) => {
    return (
      student.firstName.toLowerCase().includes(searchString) ||
      student.lastName.toLowerCase().includes(searchString) ||
      student.house.toLowerCase().includes(searchString)
    );
  });
  displayList(searchedStudents);
}

function loadJSON() {
  Promise.all([
    fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((resp) =>
      resp.json()
    ),
    fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((resp) =>
      resp.json()
    ),
  ]).then((jsonData) => {
    prepareObjects(jsonData[0], jsonData[1]);
    console.log(jsonData[1]);
  });
}

//PREPARING OBJECTS FROM BPTH DATABASES
function prepareObjects(jsonData1, jsonData2) {
  console.log(jsonData1);
  console.log(jsonData2);

  jsonData1.forEach((elem) => {
    const student = Object.create(Student);
    //FULL NAME
    let fullName = (student.fullname = elem.fullname.trim());
    //FIRST NAME
    if (fullName.indexOf(" ") >= 0) {
      student.firstName = fullName.substring(
        fullName.indexOf(" "),
        fullName.lastIndexOf()
      );
      student.firstName =
        student.firstName[0].toUpperCase() +
        student.firstName.substring(1).toLowerCase();
      console.log(student.firstName);
    } else {
      student.firstName = fullName.substring(fullName.indexOf(" ") + 1);
      console.log(student.firstName);
    }
    //MIDDLE NAME
    student.middleName = fullName.substring(
      fullName.indexOf(" ") + 1,
      fullName.lastIndexOf(" ")
    );
    if (student.middleName.includes('"')) {
      student.nickName = fullName.substring(
        fullName.indexOf(" ") + 1,
        fullName.lastIndexOf(" ")
      );
      console.log(student.nickName);
    } else {
      student.middleName = fullName.substring(
        fullName.indexOf(" ") + 1,
        fullName.lastIndexOf(" ")
      );
      student.middleName =
        student.middleName.substring(0, 1).toUpperCase() +
        student.middleName.substring(1).toLowerCase();
    }
    console.log(student.middleName);

    //LAST NAME
    if (fullName.indexOf(" ") >= 0) {
      student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1);
      student.lastName =
        student.lastName[0].toUpperCase() +
        student.lastName.substring(1).toLowerCase();
      console.log(student.lastName);
    } else {
      student.lastName = "";
      console.log(student.lastName);
    }
    //BLOOD
    const array = Object.values(jsonData2);
    for (let i = 0; i < 2; i++) {
      if (array[i].includes(student.lastName)) {
        if (i == 1) {
          student.blood = "pure";
        }
      }
    }
    console.log(student.blood);
    //HOUSE
    let house = (student.house = elem.house.trim().toLowerCase());
    console.log(house);
    //IMAGE
    student.image = `${student.lastName.toLowerCase()}_${student.firstName
      .substring(0, 1)
      .toLowerCase()}.png`;
    console.log(student.image);
    allStudents.push(student);
  });

  displayList(allStudents);
}
//FILTERING

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  // filterList(filter);
  setFilter(filter);
}
function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // let filteredList = allStudents;
  if (settings.filterBy === "all") {
    filteredList = allStudents;
  } else if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledStudents;
  } else if (settings.filterBy === "notExpelled") {
    filteredList = allStudents;
  } else if (settings.filterBy === "half") {
    filteredList = allStudents.filter(isHalfBlood);
  } else if (settings.filterBy === "pure") {
    filteredList = allStudents.filter(isPureBlood);
  }

  return filteredList;
}
//IS FUNCTIONS

function isGryffindor(student) {
  if (student.house === "gryffindor") {
    return true;
  } else {
    return false;
  }
}
function isHufflepuff(student) {
  if (student.house === "hufflepuff") {
    return true;
  } else {
    return false;
  }
}
function isRavenclaw(student) {
  if (student.house === "ravenclaw") {
    return true;
  } else {
    return false;
  }
}
function isSlytherin(student) {
  if (student.house === "slytherin") {
    return true;
  } else {
    return false;
  }
}
function isHalfBlood(student) {
  if (student.blood === "half") {
    return true;
  } else {
    return false;
  }
}
function isPureBlood(student) {
  if (student.blood === "pure") {
    return true;
  } else {
    return false;
  }
}

//SORTING
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  //TOGGLE THE DIRECTION
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`user selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}
function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir == "desc") {
    direction = -1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

//ADDING CONTENT

function displayList(students) {
  // clear the list
  document.querySelector("#list ul").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
  //   console.log(allStudents);
  document.querySelector("#resultsFound span").textContent = students.length;
  displayGeneralData();
}
function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("#studentCardTemplate")
    .content.cloneNode(true);
  // set clone data
  clone.querySelector(".name").textContent = student.firstName;
  clone.querySelector(".lastName").textContent = student.lastName;
  clone.querySelector(".house-name").textContent = student.house;
  clone.querySelector(
    ".houseImgCard"
  ).src = `assets/houses/${student.house}.png`;
  if (student.lastName.includes("-")) {
    clone.querySelector(
      ".studentImgCard"
    ).src = `assets/images/${student.lastName.substring(
      student.lastName.indexOf("-") + 1
    )}_${student.firstName[0]}.png`;
  } else if (student.lastName.includes("Patil")) {
    clone.querySelector(
      ".studentImgCard"
    ).src = `assets/images/${student.lastName}_${student.firstName}.png`;
  } else {
    clone.querySelector(
      ".studentImgCard"
    ).src = `assets/images/${student.image}`;
  }

  clone.querySelector(".studentCard").classList.add(`${student.house}Border`);
  clone
    .querySelector(".studentCard .seeMore")
    .addEventListener("click", showPopUp);

  //EXPELLING

  clone
    .querySelector("#expellContainer")
    .addEventListener("click", expelStudent);

  function expelStudent() {
    student.status = "Expelled";
    // console.log(student.status);
    const indexOfcurrentStudents = allStudents.findIndex(
      (element) => element.firstName === student.firstName
    );
    const arrayOfRemovedStudents = allStudents.splice(
      indexOfcurrentStudents,
      1
    );

    expelledStudents.push(arrayOfRemovedStudents[0]);
    console.log("expelStudent index in array", allStudents);
    console.log("expelled students", expelledStudents);
    buildList();
  }

  //SQUAD

  clone.querySelector("[data-field=squad]").dataset.squad = student.squad;
  clone
    .querySelector("[data-field=squad]")
    .addEventListener("click", makeSquadSlytherin);

  function makeSquadSlytherin() {
    console.log("squadSlytherin works");
    if (student.house !== "slytherin") {
      cannotSquad();
    } else if (student.blood !== "pure") {
      cannotSquad();
    } else {
      makeSquad(student);
    }
  }

  function makeSquad(student) {
    if (student.squad === false) {
      student.squad = true;
    } else {
      student.squad = false;
    }
    buildList();
  }

  //PREFECTS
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone
    .querySelector("[data-field=prefect]")
    .addEventListener("click", clickPrefect);
  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }
    buildList();
  }

  //POPUP

  function showPopUp() {
    popUp.classList.remove("hidden");
    // console.log("popup");
    popUp.removeAttribute("class");
    popUp.classList.add(`${student.house}BG`);
    popUp.classList.add(`${student.house}Border`);
    popUp.querySelector(
      "#studentImgPopUp"
    ).src = `assets/images/${student.image}`;
    popUp.querySelector("#firstName").textContent = student.firstName;
    popUp.querySelector("#middleName").textContent = student.middleName;
    popUp.querySelector("#nickname").textContent = student.nickName;
    popUp.querySelector("#lastName").textContent = student.lastName;
    if (student.blood === "half") {
      popUp.querySelector("#bloodStatus").textContent = "Half blood";
    } else if (student.blood === "pure") {
      popUp.querySelector("#bloodStatus").textContent = "Pure blood";
    }
    let squadStatus = popUp.querySelector(".squadStatus");
    if (student.squad === true) {
      squadStatus.textContent = "???";
    } else if (student.squad === false) {
      squadStatus.textContent = "X";
    }
    popUp.querySelector(".expelledOrNot").textContent = student.status;
    popUp.querySelector(
      "#housePopUp img"
    ).src = `assets/houses/${student.house}.png`;
    popUp.querySelector("#housePopUp h2").textContent = student.house;
    popUp
      .querySelector("#closeContainer")
      .addEventListener("click", closePopUp);
  }
  // append clone to list
  document.querySelector("#list ul").appendChild(clone);
}
function closePopUp() {
  popUp.classList.add("hidden");
}

// PREFECTS FUNCTIONS

function tryToMakeAPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const numberOfPrefects = prefects.length;
  const other = prefects
    .filter((student) => student.house === selectedStudent.house)
    .shift();

  //IF THERE IS ANOTHER OF THE SAME TYPE
  if (other !== undefined) {
    console.log("there can be only one prefect of each house");
    removeOther(other);
  } else if (numberOfPrefects >= 2) {
    console.log("there can only be two prefects");
    removeAorB(prefects[0], prefects[1]);
  } else makePrefect(selectedStudent);

  function removeOther(other) {
    //ASK THE USER TO IGNORE OR REMOVE THE OTHER
    document.querySelector("#removeOther").classList.remove("hidden");
    document.querySelector("#removeOther").classList.add("show");
    document
      .querySelector("#removeOther .closeBtn")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#removeOther #removeOtherBtn")
      .addEventListener("click", clickRemoveOther);

    //IF IGNORE DO NOTHING

    function closeDialog() {
      document.querySelector("#removeOther").classList.remove("show");
      document.querySelector("#removeOther").classList.add("hidden");
      document
        .querySelector("#removeOther #removeOtherBtn")
        .removeEventListener("click", clickRemoveOther);
      document
        .querySelector("#removeOther .closeBtn")
        .removeEventListener("click", closeDialog);
    }

    //IF REMOVE OTHER:

    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
  function removeAorB(prefectA, prefectB) {
    //ASK THE USER TO IGNORE OR REVOME A OR B
    document.querySelector("#removeAorB").classList.remove("hidden");
    document.querySelector("#removeAorB").classList.add("show");
    document
      .querySelector("#removeAorB .closeBtn")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#removeAorB #removeA")
      .addEventListener("click", clickRemoveA);
    document
      .querySelector("#removeAorB #removeB")
      .addEventListener("click", clickRemoveB);
    //SHOW NAMES FOR BUTTONS
    document.querySelector("#removeAorB [data-field=prefectA]").textContent =
      prefectA.firstName;
    document.querySelector("#removeAorB [data-field=prefectB]").textContent =
      prefectB.firstName;
    // console.log(prefectA.firstName, prefectB.firstName);
    //IF IGNORE DO NOTHING
    function closeDialog() {
      document.querySelector("#removeAorB").classList.remove("show");
      document.querySelector("#removeAorB").classList.add("hidden");
      document
        .querySelector("#removeAorB .closeBtn")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#removeAorB #removeA")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#removeAorB #removeB")
        .removeEventListener("click", clickRemoveB);
    }

    //IF REMOVE A:
    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
    //ELSE IF REMOVE B
    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}
//SQAUD FUNCTIONS

function cannotSquad() {
  console.log("can't squad works");
  document.querySelector("#cannotSquad").classList.remove("hidden");
  document.querySelector("#cannotSquad").classList.add("show");
  document
    .querySelector("#cannotSquad .closeBtn")
    .addEventListener("click", closeDialog);

  function closeDialog() {
    document.querySelector("#cannotSquad").classList.remove("show");
    document.querySelector("#cannotSquad").classList.add("hidden");
    document
      .querySelector("#cannotSquad .closeBtn")
      .removeEventListener("click", closeDialog);
  }
}
//hacking
document.querySelector(".hack").addEventListener("click", hackTheSystem);
function hackTheSystem() {
  const newStudent = {
    firstName: "Polina",
    middleName: "",
    nickName: "Poli",
    lastName: "Artamonova",
    image: "artamonova_p.png",
    house: "gryffindor",
    prefect: false,
    status: "Not expelled",
    blood: "pure",
    squad: false,
  };

  allStudents.unshift(newStudent);
  console.log(allStudents);

  buildList();
}
