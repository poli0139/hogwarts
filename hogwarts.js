"use strict";
window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
const expelledStudents = [];
const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
};
let filterBy = "all";

let popUp = document.querySelector("#popUp article");

function start() {
  console.log("ready");

  loadJSON();
  registerButtons();
}
function displayGeneralData() {
  document.querySelector("#allStudentsNum span").textContent =
    allStudents.length;
  document.querySelector("#expelledStudentsNum span").textContent =
    expelledStudents.length;
}
function registerButtons() {
  document
    .querySelectorAll("[data-action = 'filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action = 'sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
}

function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}
function prepareObjects(jsonData) {
  jsonData.forEach((elem) => {
    // console.log(elem);
    const Student = {
      firstName: "",
      lastName: "",
      middleName: "",
      nickName: "",
      image: "",
      house: "",
      status: "Not expelled",
      prefect: false,
    };
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

  if (settings.filterBy === "gryffindor") {
    //create a filtered list of only gryffindor
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
  }

  return filteredList;
}

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
  clone.querySelector(".studentCard").addEventListener("click", showPopUp);

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
  // PREFECTS

  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone
    .querySelector("[data-field=prefect]")
    .addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
      // student.prefect = true;
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
function tryToMakeAPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const numberOfPrefects = prefects.length;
  const other = prefects
    .filter((student) => student.house === selectedStudent.house)
    .shift();

  //FI THERE IS ANOTHER OF THE SAME TYPE
  if (other !== undefined) {
    console.log("there can be only one prefect of each house");
    removeOther(other);
  } else if (numberOfPrefects >= 2) {
    console.log("there can only be two prefects");
    removeAorB(prefects[0], prefects[1]);
  } else makePrefect(selectedStudent);

  function removeOther(other) {
    //ASK THE USER TO IGNORE OR REMOVE THE OTHER

    //IF IGNORE DO NOTHING

    //IF REMOVE OTHER:
    removePrefect(other);
    makePrefect(selectedStudent);
  }
  function removeAorB(prefectA, prefectB) {
    //ASK THE USER TO IGNORE OR REVOME A OR B

    //IF IGNORE DO NOTHING

    //IF REMOVE A:
    removePrefect(prefectA);
    makePrefect(selectedStudent);
    //ELSE IF REMOVE B
    removePrefect(prefectB);
    makePrefect(selectedStudent);
  }

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}
