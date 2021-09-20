"use strict";
window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

function start() {
  console.log("ready");

  loadJSON();
  registerButtons();
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
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  console.log(`user selected ${sortBy}`);
  sortList(sortBy);
}
function sortList(sortBy) {
  let sortedList = allStudents;
  if (sortBy === "firstName") {
    sortedList = sortedList.sort(sortByFirstName);
  } else if (sortBy === "lastName") {
    sortedList = sortedList.sort(sortByLastName);
  } else if (sortBy === "house") {
    sortedList = sortedList.sort(sortByHouse);
  }

  displayList(sortedList);
}

function sortByFirstName(studentA, studentB) {
  if (studentA.firstName < studentB.firstName) {
    return -1;
  } else {
    return 1;
  }
}
function sortByLastName(studentA, studentB) {
  if (studentA.lastName < studentB.lastName) {
    return -1;
  } else {
    return 1;
  }
}
function sortByHouse(studentA, studentB) {
  if (studentA.house < studentB.house) {
    return -1;
  } else {
    return 1;
  }
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  filterList(filter);
}

function filterList(filterBy) {
  let filteredList = allStudents;

  if (filterBy === "gryffindor") {
    //create a filtered list of only gryffindor
    filterBy = allStudents.filter(isGryffindor);
  } else if (studentHouse === "hufflepuff") {
    filterBy = allStudents.filter(isHufflepuff);
  } else if (studentHouse === "ravenclaw") {
    filterBy = allStudents.filter(isRavenclaw);
  } else if (studentHouse === "slytherin") {
    filterBy = allStudents.filter(isSlytherin);
  }

  displayList(filteredList);
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
function displayList(students) {
  // clear the list
  document.querySelector("#list ul").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
  //   console.log(allStudents);
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
  // append clone to list
  document.querySelector("#list ul").appendChild(clone);
}
