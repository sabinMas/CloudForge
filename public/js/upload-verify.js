/** updated by Kelley Castillo 3/3 to include error handling for image upload */

document.addEventListener("DOMContentLoaded", () => {
  let form = document.getElementById("upload-form");
  let imgUpload = document.getElementById("imgUpload");
  let imgPreview = document.getElementById("imgPreview");
  let imgLabel = document.getElementById("imgLabel");

  if (!form) return;

  form.onsubmit = () => {
    clearErrors();
    let isValid = true;
    let name = document.getElementById("name").value.trim();
    let rate = document.getElementById("rate").value.trim();
    let price = document.getElementById("price").value;
    let stats = document.getElementById("stat").value.trim();
    let category = document.getElementById("category");

    if (!name) {
      isValid = false;
      document.getElementById("ename").style.display = "block";
    }
    if (!rate) {
      isValid = false;
      document.getElementById("erate").style.display = "block";
    }
    if (!stats) {
      isValid = false;
      document.getElementById("estat").style.display = "block";
    }
    if (!price) {
      isValid = false;
      document.getElementById("eprice").style.display = "block";
    }
    if(price<0){
      isValid = false;
      document.getElementById("epricenegative").style.display = "block";
    }
    if (category.value === "none" || !category.value) {
      isValid = false;
      document.getElementById("ecate").style.display = "block";
    }

    return isValid;
  };

// Image upload preview and validation, with error handling for invalid files
// 
 if (imgUpload) {
  imgUpload.addEventListener("change", function () {
    const eimg = document.getElementById("eimg");
    if (eimg) eimg.style.display = "none";

    const file = this.files[0];
    if (!file) {
      imgPreview.src = "";
      imgPreview.style.display = "none";
      imgLabel.style.display = "block";
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml"
    ];

    if (!allowedTypes.includes(file.type)) {
      // invalid
      this.value = "";
      imgPreview.src = "";
      imgPreview.style.display = "none";
      imgLabel.style.display = "block";
      if (eimg) eimg.style.display = "block";
      return;
    }

    // valid
    const reader = new FileReader();
    reader.onload = function (e) {
      imgPreview.src = e.target.result;
      imgPreview.style.display = "block";
      imgLabel.style.display = "none";
    };
    reader.readAsDataURL(file);
  });
}

});

function clearErrors() {
  let error = document.getElementsByClassName("err");
  for (let i = 0; i < error.length; i++) {
    error[i].style.display = "none";
  }
}
