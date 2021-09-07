"use strict";
window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

// let firstName;
// let lastName;
// let middleName;
// let nickName;
// let image;
// let house;

function start() {
  console.log("ready");

  loadJSON();
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
    let image = `${student.lastName.toLowerCase()}_${student.firstName.substring(
      0,
      1
    )}.png`;
    console.log(image);
    allStudents.push(student);
  });
  displayList();
}
function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent =
    student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=nickName]").textContent = student.nickName;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
