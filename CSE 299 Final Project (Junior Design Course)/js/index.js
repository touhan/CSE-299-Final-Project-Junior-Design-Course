// all global variables declarations
let allUserInfo = [];
let regForm = document.querySelector(".reg-form");
let loginForm = document.querySelector(".login-form");
let allInput = regForm.querySelectorAll("input");
let allLoginInput = loginForm.querySelectorAll("input");
let regBtn = regForm.querySelector("button");
let loginBtn = loginForm.querySelector("button");

// getting data from local storage
if (localStorage.getItem("allUserInfo") != null) {
    allUserInfo = JSON.parse(localStorage.getItem("allUserInfo"));
}
console.log(allUserInfo);

// registration coding
regForm.onsubmit = (e) => {
    e.preventDefault();
    let checkEmail = allUserInfo.find((data) => {
        return data.email == allInput[4].value;
    });

    if (checkEmail == undefined) {
        let data = {};
        for (let el of allInput) {
            let key = el.name;
            data[key] = el.value;
        }

        regBtn.innerText = "Processing...";

        setTimeout(() => {
            regBtn.innerText = "Register";
            allUserInfo.push(data);
            localStorage.setItem("allUserInfo", JSON.stringify(allUserInfo));
            swal("Good Job!", 'Registration Success!', 'success');
        }, 2000);
    } else {
        swal("Failed!", 'Email already registered!', 'warning');
    }
};

// login coding
loginForm.onsubmit = (e) => {
    e.preventDefault();
    if (allLoginInput[0].value != "") {
        if (allLoginInput[1].value != "") {
            // check email in our database
            let checkEmail = allUserInfo.find((data) => {
                return data.email == allLoginInput[0].value;
            });

            if (checkEmail != undefined) {
                // match password
                if (checkEmail.password == allLoginInput[1].value) {
                    loginBtn.innerText = "Please Wait...";
                    setTimeout(() => {
                        loginBtn.innerText = "Login";
                        window.location = "profile/profile.html";
                        checkEmail.password = null;
                        sessionStorage.setItem("_au_",JSON.stringify(checkEmail));                       
                    }, 2000);
                } else {
                    swal("Warning", "Wrong Password!", "warning");
                }
            } else {
                swal("Warning", "Wrong Email!", "warning");
            }
        } else {
            swal("Warning", "Password is empty!", "warning");
        }
    } else {
        swal("Warning", "Email is empty!", "warning");
    }
};
// Select feedback section for verified customers
const verifiedFeedbackSection = document.getElementById("verified-feedback-section");

// Customer Signup Form Submission
document.querySelector(".customer-signup-form").onsubmit = (e) => {
    e.preventDefault();

    const customerName = e.target.querySelector("input[name='customerFullName']").value;
    const customerEmail = e.target.querySelector("input[name='customerEmail']").value;
    const customerPassword = e.target.querySelector("input[name='customerPassword']").value;

    // Check if email already exists
    const existingCustomer = allUserInfo.find((user) => user.email === customerEmail);
    if (existingCustomer) {
        swal("Warning!", "Email already registered!", "warning");
    } else {
        // Register new customer
        const customerData = {
            name: customerName,
            email: customerEmail,
            password: customerPassword,
            role: "customer"  // differentiate user roles
        };

        allUserInfo.push(customerData);
        localStorage.setItem("allUserInfo", JSON.stringify(allUserInfo));
        swal("Success!", "Customer registration successful!", "success");
    }
};

// Customer Login Form Submission
document.querySelector(".customer-login-form").onsubmit = (e) => {
    e.preventDefault();

    const emailInput = e.target.querySelector("input[type='email']").value;
    const passwordInput = e.target.querySelector("input[type='password']").value;

    // Check if email and password match a verified customer in allUserInfo
    const verifiedCustomer = allUserInfo.find(
        (user) => user.email === emailInput && user.password === passwordInput && user.role === "customer"
    );

    if (verifiedCustomer) {
        swal("Success!", "Welcome, verified customer!", "success");
        verifiedFeedbackSection.classList.remove("d-none"); // Show feedback section for verified customers
        sessionStorage.setItem("_customer_verified_", JSON.stringify(verifiedCustomer));
    } else {
        swal("Failed!", "Incorrect email or password!", "warning");
    }
};
// animation
const container = document.getElementById('container');
const signInButton = document.getElementById('signIn');
const signUpButton = document.getElementById('signUp');

// Toggle the animation class on each click
document.querySelector('.sign-in-btn').addEventListener('click', () => {
    document.querySelector('.container').classList.remove('right-panel-active');
});

document.querySelector('.sign-up-btn').addEventListener('click', () => {
    document.querySelector('.container').classList.toggle('right-panel-active');
});
