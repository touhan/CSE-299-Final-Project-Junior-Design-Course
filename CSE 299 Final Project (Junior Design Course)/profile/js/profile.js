// All global variables declaration
let userInfo;
let user;
let allBData = [];
let allInHData = [];
let allArchData = []; //touhan
let allCashData = [];
let allCashArchData = [];
let navBrand = document.querySelector(".navbar-brand");
let logoutBtn = document.querySelector('.logout-btn');
let bookingForm = document.querySelector(".booking-form");
let allBInput = bookingForm.querySelectorAll("input");
let bTextarea = bookingForm.querySelector("textarea");
let inHouseForm = document.querySelector(".inhouse-form");
let allInHInput = inHouseForm.querySelectorAll("input");
let InHTextarea = inHouseForm.querySelector("textarea");
let modalCBtn = document.querySelectorAll(".btn-close");
let bListTBody = document.querySelector(".booking-list");
let inHListTBody = document.querySelector(".inhouse-list");
let archListTBody = document.querySelector(".archive-list");
let bRegBtn = document.querySelector(".b-register-btn");
let inHRegBtn = document.querySelector(".in-house-reg-btn");
let allTabBtn = document.querySelectorAll(".tab-btn");
let searchEl = document.querySelector(".search-input");
let cashierbtn = document.querySelector(".cashier-tab");
let cashierTab = document.querySelector("#cashier");
let bookingTab = document.querySelector("#booking");
let cashierForm = document.querySelector(".cashier-form");
let allCInput = cashierForm.querySelectorAll("input");
let cashBtn = document.querySelector(".cash-btn");
let cashierTbody = document.querySelector(".cashier-list");
let cashTotal = document.querySelector(".total");
let closeCashierBtn = document.querySelector(".close-cahsier-btn");
let cashierArchTbody = document.querySelector(".cashier-arch-list");
let archTotal = document.querySelector(".arch-total");
let allPrintBtn = document.querySelectorAll(".print-btn");
let archPrintBtn = document.querySelector(".arch-print-btn");
let cashierTabPan = document.querySelector(".cashier-tab-pan");
let allTotalBtn = document.querySelectorAll(".total-btn");
let showBRoomsEl = document.querySelector(".show-booking-rooms"); // Jarif 
let showHRoomsEl = document.querySelector(".show-inhouse-rooms"); // Jarif 
let cashierInputFields = cashierForm.querySelectorAll("input");

//print coding
for (let btn of allPrintBtn) {
    btn.onclick = () => {
        window.print();
    }
}
archPrintBtn.onclick = () => {
    cashierTabPan.classList.add('d-none')
    window.print();
}
modalCBtn[3].onclick = () => {
    cashierTabPan.classList.remove('d-none')

}



// Check user login or not
if (sessionStorage.getItem("_au_") == null) {
    window.location = "../index.html";
}
userInfo = JSON.parse(sessionStorage.getItem("_au_"));
console.log(userInfo);
navBrand.innerHTML = userInfo.hotelName;
user = userInfo.email.split('@')[0];



//check hotel rooms

const checkRooms = (element) => {
    if (userInfo.totalRoom < element.value) {
        swal("Warning", `Total ${userInfo.totalRoom} rooms is available in the hotel`, 'warning');
        element.value = userInfo.totalRoom;
    }
}


allBInput[2].oninput = (e) => {
    checkRooms(e.target);

}
allInHInput[2].oninput = (e) => {
    checkRooms(e.target);

}


// Getting data from storage
const fetchData = (key) => {
    if (localStorage.getItem(key) != null) {
        const data = JSON.parse(localStorage.getItem(key));
        return data;
    } else {
        return [];
    }
}
allBData = fetchData(user + "_allBData");
allInHData = fetchData(user + "_allInHData");
allArchData = fetchData(user + "_allArchData");//touhan
allCashData = fetchData(user + "_allCashData");
allCashArchData = fetchData(user + "_allCashArchData");


// Format date function
const formatDate = (date) => {
    const formattedDate = new Date(date);
    let yy = formattedDate.getFullYear();
    let mm = formattedDate.getMonth() + 1;
    let dd = formattedDate.getDate();
    let time = formattedDate.toLocaleTimeString();

    // Pad the day and month with leading zeros
    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;

    return `${dd}-${mm}-${yy} ${time}`; // Return the formatted date and time
}
//registration coding
const registrationFunc = (textarea = null, inputs, array, key) => {
    let data = {
        notice: textarea && textarea.value,
        inHouse: false, // Jarif 
        createdAt: new Date()
    };

    // Loop through all inputs and get the name and value attributes
    for (let el of inputs) {
        let key = el.name;
        let value = el.value;
        data[key] = value;  // Store the value by name in the data object
    }

    array.push(data);
    localStorage.setItem(key, JSON.stringify(array));
    swal("Good Job!", "Booking Success", "success");
}



// show "Total" coding
const showTotal = () => {
    allTotalBtn[0].innerText = "Total Booking = " + allBData.length;
    allTotalBtn[1].innerText = "Total InHouse = " + allInHData.length;
    allTotalBtn[2].innerText = "Total Archive = " + allArchData.length;
}
showTotal();


// Logout coding
logoutBtn.onclick = () => {
    logoutBtn.innerHTML = "Please wait...";
    setTimeout(() => {
        logoutBtn.innerHTML = "Logout";
        sessionStorage.removeItem("_au_");
        window.location = "../index.html";
    }, 3000);
}

// Show data
const ShowData = (element, array, key) => {

    let tmp = key.split("_")[1];

    element.innerHTML = ""; // Clear the table body before appending new rows
    array.forEach((item, index) => {
        element.innerHTML += `
        <tr>
            <td class="no-print text-nowrap">${index + 1}</td>
            <td class="text-nowrap">${item.location}</td>
            <td class="text-nowrap">${item.roomNo}</td>
            <td class="text-nowrap">${item.fullname}</td>
            <td class="text-nowrap">${item.checkInDate}</td>
            <td class="text-nowrap">${item.checkOutDate}</td> 
            <td class="text-nowrap">${item.totalPeople}</td>
            <td class="text-nowrap">${item.mobile}</td>         
            <td class="text-nowrap">${item.price}</td>
            <td class="text-nowrap">${item.notice}</td>
            <td class=" no-print text-nowrap">${formatDate(item.createdAt)}</td>
            <td class="text-nowrap no-print">
                <button class=" ${tmp == 'allArchData' && 'd-none'} btn edit-btn p-1 px-2 btn-primary">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn checkin-btn p-1 px-2 text-white btn-info">
                    <i class="fa fa-check"></i>
                </button>
                <button class="btn del-btn p-1 px-2 btn-danger">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>`;
    });
    deleteDataFunc(element, array, key);
    updateDataFunc(element, array, key);
    checkInAndCheckout(element, array, key);

}

// delete coding
const deleteDataFunc = (element, array, key) => {
    let allDelBtn = element.querySelectorAll(".del-btn");

    allDelBtn.forEach((btn, index) => {
        btn.onclick = () => {
            // First confirmation alert
            swal({
                title: "Are you sure?",
                text: "Do you really want to delete this booking?",
                icon: "warning",
                buttons: true,   // Show "OK" and "Cancel" buttons
                dangerMode: true,  // Highlight "OK" as dangerous action
            })
                .then((willDelete) => {
                    if (willDelete) {
                        // Show second confirmation if user clicked "OK"
                        swal({
                            title: "Are you really sure?",
                            text: "This action cannot be undone. Are you absolutely sure?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        }).then((confirmDelete) => {
                            if (confirmDelete) {
                                // Delete the booking entry from allBData only after second confirmation
                                array.splice(index, 1);

                                // Update localStorage with the modified booking data
                                localStorage.setItem(key, JSON.stringify(array));

                                // Re-render the booking data table
                                ShowData(element, array, key);

                                // Show success message after deletion
                                swal("Deleted!", "Your booking has been deleted!", "success");
                            } else {
                                // If the second alert is canceled
                                swal("Your booking is safe!", "", "info");
                            }
                        });
                    } else {
                        // If the first alert is canceled
                        swal("Your booking is safe!", "", "info");
                    }
                });
        };
    });
}

//update coding
const updateDataFunc = (element, array, key) => {
    let allEditBtn = element.querySelectorAll(".edit-btn");

    allEditBtn.forEach((btn, index) => {
        btn.onclick = () => {

            let tmp = key.split("_")[1];
            tmp == 'allBData' ? bRegBtn.click() : inHRegBtn.click()
            let allBtn = tmp == 'allBData'
                ? bookingForm.querySelectorAll("button")
                : inHouseForm.querySelectorAll("button");

            let allInput = tmp == 'allBData'
                ? bookingForm.querySelectorAll("input")
                : inHouseForm.querySelectorAll("input");

            let textarea = tmp == 'allBData'
                ? bookingForm.querySelector("textarea")
                : inHouseForm.querySelector("textarea");

            allBtn[0].classList.add("d-none");  // Hide the "save/register" button
            allBtn[1].classList.remove("d-none"); // Show the "update" button
            // Load the existing data into the form fields for editing
            let obj = array[index];
            allInput[0].value = obj.fullname;
            allInput[1].value = obj.location;
            allInput[2].value = obj.roomNo;
            allInput[3].value = obj.totalPeople;
            allInput[4].value = obj.checkInDate;
            allInput[5].value = obj.checkOutDate;
            allInput[6].value = obj.price;
            allInput[7].value = obj.mobile;
            textarea.value = obj.notice;

            // Handle the update button click event
            allBtn[1].onclick = () => {
                // First confirmation alert
                swal({
                    title: "Are you sure?",
                    text: "Do you really want to update this booking?",
                    icon: "warning",
                    buttons: ["Cancel", "Confirm"],
                    dangerMode: true,
                }).then((willUpdate) => {
                    if (willUpdate) {
                        // Second confirmation alert
                        swal({
                            title: "Are you really sure?",
                            text: "This action cannot be undone. Are you absolutely sure?",
                            icon: "warning",
                            buttons: ["No, go back!", "Yes, update it!"],
                            dangerMode: true,
                        }).then((finalUpdate) => {
                            if (finalUpdate) {
                                let formData = {
                                    notice: textarea.value,
                                    createdAt: new Date(),
                                };

                                // Collect form data and assign to formData object
                                for (let el of allInput) {
                                    let key = el.name;
                                    let value = el.value;
                                    formData[key] = value;
                                }
                                array[index] = formData;
                                allBtn[0].classList.remove("d-none");
                                allBtn[1].classList.add("d-none");

                                tmp == "allBData"
                                    ? bookingForm.reset('')
                                    : inHouseForm.reset('');

                                tmp == "allBData"
                                    ? modalCBtn[0].click()
                                    : modalCBtn[1].click();

                                // Save updated data to localStorage
                                localStorage.setItem(key, JSON.stringify(array));

                                // Show success alert using SweetAlert
                                swal("Success!", "Booking data has been updated successfully.", "success");

                                // Refresh the booking data display
                                ShowData(element, array, key);
                            } else {
                                // If the second confirmation is cancelled
                                swal("Your booking data is safe!", "", "info");
                            }
                        });
                    } else {
                        // If the first confirmation is cancelled
                        swal("Update cancelled!", "Your booking data is safe.", "info");
                    }
                });
            }
        }
    });
}

// checkin and checkout coding 
const checkInAndCheckout = (element, array, key) => {
    let allCheckBtn = element.querySelectorAll(".checkin-btn");
    allCheckBtn.forEach((btn, index) => {
        btn.onclick = () => {

            let tmp = key.split("_")[1];
            let data = array[index];
            array.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(array));
            if (tmp == "allBData") {
                allInHData.push(data);
                localStorage.setItem(user + "_allInHData", JSON.stringify(allInHData));
                ShowData(element, array, key);
                showBookingRooms();
                showInhouseRooms();
            }
            else if (tmp == "allArchData") {
                allBData.push(data);
                localStorage.setItem(user + "_allBData", JSON.stringify(allBData));
                ShowData(element, array, key);
                showBookingRooms();
                showInhouseRooms();
            }
            else {
                allArchData.push(data);
                localStorage.setItem(user + "_allArchData", JSON.stringify(allArchData));
                ShowData(element, array, key);
                showBookingRooms();
                showInhouseRooms();
            }
        }
    });
}

// show booking rooms 
const showBookingRooms = () => {
    showBRoomsEl.innerHTML = '';
    allBData.forEach((item, index) => {
        console.log(item);
        showBRoomsEl.innerHTML += `
        <div class="card text-center px-0 col-md-2">
            <div class="bg-danger text-white fw-bold card-header">
                ${item.roomNo}
            </div>
            <div class="bg-success text-white fw-bold card-body">
                <p>${formatDate(item.checkInDate)}</p>
                <p>To</p>
                <p>${formatDate(item.checkOutDate)}</p>
            </div>
        </div>
        `;
    })

}
showBookingRooms();


// show inhouse rooms 
const showInhouseRooms = () => {
    showHRoomsEl.innerHTML = '';
    allInHData.forEach((item, index) => {
        console.log(item);
        showHRoomsEl.innerHTML += `
        <div class="card text-center px-0 col-md-2">
            <div class="bg-danger text-white fw-bold card-header">
                ${item.roomNo}
            </div>
            <div class="card-body">
             <img src="${item.inHouse ? '../Images/dummy.jpg' : '../Images/lock.png'}" class="w-100" alt="">
            </div>
            <div class="card-footer">
                <button class="in-btn action-btn btn text-white">
                    In
                </button>
                <button class="out-btn action-btn btn text-white">
                    Out
                </button>
            </div>
            
        </div>
        `;
    });

    // in coding
    let allInBtn = showHRoomsEl.querySelectorAll(".in-btn");
    allInBtn.forEach((btn,index)=>{
        btn.onclick = () =>{
           let data = allInHData[index];
           data.inHouse = true;
           allInHData[index] = data;
           localStorage.setItem(user+"_allInHData",JSON.stringify(allInHData));
           showBookingRooms();
        }


    });
    // out coding 
    let allOutBtn = showHRoomsEl.querySelectorAll(".out-btn");
    allOutBtn.forEach((btn,index)=>{
        btn.onclick = () =>{
           let data = allInHData[index];
           data.inHouse = false;
           allInHData[index] = data;
           localStorage.setItem(user+"_allInHData",JSON.stringify(allInHData));
           showBookingRooms();
        }


    })

}
showInhouseRooms();

// Start booking store coding
bookingForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(bTextarea, allBInput, allBData, user + "_allBData");
    bookingForm.reset();
    modalCBtn[0].click();
    ShowData(bListTBody, allBData, user + "_allBData");
    showTotal(); // Jarif
    showBookingRooms(); /// Jarif
}

// Start cashier store coding
cashierForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(null, allCInput, allCashData, user + "_allCashData");
    cashierForm.reset();
    modalCBtn[2].click();
    showCashierhFunc();
}

// Start inhouse booking coding
inHouseForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(InHTextarea, allInHInput, allInHData, user + "_allInHData");
    inHouseForm.reset();
    modalCBtn[1].click();
    ShowData(inHListTBody, allInHData, user + "_allInHData");
    showTotal(); //Jarif
    showInhouseRooms();
}

// Function to reset the form to its initial state for new registrations
const resetForm = () => {
    let allBBtn = bookingForm.querySelectorAll("button");

    // Show the "save/register" button and hide the "update" button
    allBBtn[0].classList.remove("d-none");  // Show the "save/register" button
    allBBtn[1].classList.add("d-none");     // Hide the "update" button

    // Clear the form fields
    bookingForm.reset(); // Reset all the form fields
}

// Register button click event to reset the form for new registrations
bRegBtn.onclick = resetForm;

const searchFunc = () => {
    let value = searchEl.value.toLowerCase();
    let tableEl = document.querySelector(".tab-content .search-pane.active");
    let tr = tableEl.querySelectorAll("tbody tr");
    for (let el of tr) {
        let srNo = el.querySelectorAll("TD")[0].innerText;
        let location = el.querySelectorAll("TD")[1].innerText;
        let roomNo = el.querySelectorAll("TD")[2].innerText;
        let fullname = el.querySelectorAll("TD")[3].innerText;
        let mobile = el.querySelectorAll("TD")[7].innerText;
        let price = el.querySelectorAll("TD")[8].innerText;
        if (srNo.indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else if (location.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else if (roomNo.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else if (fullname.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else if (mobile.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else if (price.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else {
            el.classList.add('d-none');
        }
    }
}

// search coding
searchEl.oninput = () => {
    searchFunc();
}

//refresh UI data coding
for (let btn of allTabBtn) {
    btn.onclick = () => {
        ShowData(bListTBody, allBData, user + "_allBData");
        ShowData(inHListTBody, allInHData, user + "_allInHData");
        ShowData(archListTBody, allArchData, user + "_allArchData");
    }
}


// Initial load of booking data
// allBData = fetchData(user + "_allBData");
ShowData(bListTBody, allBData, user + "_allBData");
ShowData(inHListTBody, allInHData, user + "_allInHData");
ShowData(archListTBody, allArchData, user + "_allArchData");

//cashier coding
const showCashierhFunc = () => {
    let totalAmount = 0;
    cashierTbody.innerHTML = '';
    allCashData.forEach((item, index) => {
        totalAmount += +item.amount;
        cashierTbody.innerHTML += `  
            <tr>
                <td>${index + 1}</td>
                <td>${item.roomNo}</td>
                <td>${item.cashierName}</td>
                <td>${formatDate(item.createdAt)}</td>
                <td>${item.amount}</td>
                <td>
                    <button class="action-btn update-btn" onclick="updateCashierData(${index})">
                        Update
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteCashierData(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });
    cashTotal.innerHTML = "<i>৳</i> " + totalAmount;
};

showCashierhFunc();

// Function to update cashier data
const updateCashierData = (index) => {
    const item = allCashData[index];
    const newAmount = prompt("Enter new amount:", item.amount);
    const newRoomNo = prompt("Enter new room number:", item.roomNo);

    if (newAmount && !isNaN(newAmount) && newRoomNo) {
        allCashData[index].amount = parseFloat(newAmount);
        allCashData[index].roomNo = newRoomNo;

        // Update localStorage after update
        localStorage.setItem(user + "_allCashData", JSON.stringify(allCashData));
        
        // Refresh the display
        showCashierhFunc();
        
        // Success alert
        swal("Success", "Cashier data updated successfully!", "success");
    } else {
        swal("Invalid Input", "Please enter valid data.", "error");
    }
};

// Function to delete cashier data
const deleteCashierData = (index) => {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            allCashData.splice(index, 1);

            // Update localStorage after deletion
            localStorage.setItem(user + "_allCashData", JSON.stringify(allCashData));
            
            // Refresh the display
            showCashierhFunc();
            
            // Success alert
            swal("Deleted!", "Cashier data has been deleted.", "success");
        } else {
            swal("Cancelled", "Your data is safe!", "info");
        }
    });
};

// all archive cash coding Touhan
const showCashArchFunc = () => {
    let totalAmount = 0;
    cashierArchTbody.innerHTML = '';
    allCashArchData.forEach((item, index) => {
        totalAmount += +item.total;
        cashierArchTbody.innerHTML += `  
            <tr>
                <td>${index + 1}</td>
                <td>${item.cashierName}</td>
                <td>${formatDate(item.createdAt)}</td>
                <td>${item.total}</td>
            </tr>`;
    });
    // archTotal.innerHTML = "<i>৳</i> " + totalAmount;
};
showCashArchFunc();

cashBtn.onclick = () => {
    allCInput[2].value = sessionStorage.getItem("c_name");
};
//cashier modal//
cashierbtn.onclick = () => {
    if (sessionStorage.getItem("c_name") == null) {
        let name = window.prompt("Enter Your Name Please!");
        if (name) {
            sessionStorage.setItem("c_name", name);
        } else {
            allTabBtn[0].classList.add("active");
            bookingTab.classList.add("active");
            cashierbtn.classList.remove("active");
            cashierTab.classList.remove("active");
        }
    } else {
        allCInput[2].value = sessionStorage.getItem("c_name");
    }
};
//cashier modal//
closeCashierBtn.onclick = () => {
    if (allCashData.length > 0) {
        let data = {
            cashierName: sessionStorage.getItem("c_name"),
            total: cashTotal.innerText,
            createdAt: new Date()
        };

        allCashArchData.push(data);
        allCashData = [];
        localStorage.removeItem(user + "_allCashData");
        localStorage.setItem(user + "_allCashArchData", JSON.stringify(allCashArchData));
        sessionStorage.removeItem("c_name");
        
        showCashierhFunc();
        
        // Success alert
        swal("Success", "Cashier has been closed successfully!", "success");
    } else {
        swal('Warning', "There is no cash to close", 'warning');
    }
};

// Function to update cashier name
const updateCashierName = () => {
    const currentName = sessionStorage.getItem("c_name");
    const newName = prompt("Enter new cashier name:", currentName);

    if (newName && newName.trim() !== "") { // Validate new name
        sessionStorage.setItem("c_name", newName);
        cashierInputFields[2].value = newName; // Update the cashier input field

        // Success alert
        swal("Success", "Cashier name updated successfully!", "success");
    } else {
        swal("Cancelled", "Cashier name was not updated.", "info");
    }
};

// Add Update Cashier Name button
const updateCashierNameButton = document.createElement('button');
updateCashierNameButton.innerText = "Update Cashier Name";
updateCashierNameButton.classList.add("action-btn", "update-name-btn");
updateCashierNameButton.onclick = updateCashierName;

// Append the button to an appropriate container in your HTML
document.getElementById('your-button-container-id').appendChild(updateCashierNameButton);ded

