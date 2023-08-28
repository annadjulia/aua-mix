const formcontrol = document.querySelectorAll(".form-control");
const formfloating = document.querySelectorAll(".form-floating");
const form = document.querySelector("form");
const btn = document.querySelector(".btn");

formfloating.forEach(form => {
    form.classList.add("roxo");
    form.classList.add("shadow");
    form.classList.add("rounded");
    form.classList.add("mb-3");
});

form.classList.add("px-5");

btn.classList.add("py-2");
btn.classList.add("lara");
btn.classList.add("shadow");
btn.classList.add("slab");
btn.classList.add("w-100");
btn.classList.add("mt-3")

function readImage() {
    if (this.files && this.files[0]) {
        console.log(this.files[0]);
        var file = new FileReader();
        file.onload = function(e) {
            document.getElementById("preview").src = e.target.result;
        };       
        file.readAsDataURL(this.files[0]);
        uploadImageToCloudinary(e.target.result)
        .then(imageUrl => {
            if (imageUrl) {
            console.log('URL da imagem no Cloudinary:', imageUrl);
            } else {
            console.log('Falha ao enviar a imagem.');
            }
        });
    }
}

document.getElementById("img-input").addEventListener("change", readImage, false);