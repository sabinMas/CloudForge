document.getElementById("upload-form").onsubmit = () => {
  clearErrors();
  let isValid = true;
  let name = document.getElementById("name").value.trim();
  let rate = document.getElementById("rate").value.trim();
  let price = document.getElementById("price").value.trim();
  let stats = document.getElementById("stat").value.trim();
  let category = document.getElementById("category");
  const imgUpload = document.getElementById("imgUpload");
  const imgPreview = document.getElementById("imgPreview");
  const imgLabel = document.getElementById("imgLabel");

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

  if (category.value === "none" || !category.value) {
    isValid = false;
    document.getElementById("ecate").style.display = "block";
  }

  return isValid;
};

imgUpload.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imgPreview.src = e.target.result;
      imgPreview.style.display = "block";
      imgLabel.style.display = "none"; 
    };
    reader.readAsDataURL(file);
  }
});

function clearErrors() {
  let error = document.getElementsByClassName("err");
  console.log(error.length);
  for (let i = 0; i < error.length; i++) {
    error[i].style.display = "none";
  }
}
