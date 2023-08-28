const bi = document.querySelector(".bi");
const body = document.querySelector("body");
const fofos = document.querySelectorAll(".fofo");
const headCor = document.querySelector(".headCor");
const logo = document.querySelector(".logo");
const formcontrol = document.querySelectorAll(".form-control");
const formfloating = document.querySelectorAll(".form-floating");

bi.style.cursor = "pointer";

bi.addEventListener("click", () => {
    if(bi.classList.contains("bi-brightness-high-fill")){
        bi.classList.remove("bi-brightness-high-fill");
        bi.classList.add("bi-moon-stars-fill");
        body.style.backgroundImage = "url('../media/wallpaper.png')";
        fofos.forEach(fofo => fofo.style.color = "#A10AFF");
        headCor.style.backgroundColor = "#f7f0f0";
        logo.src = "../media/minilogo.png";
    }else{
        bi.classList.remove("bi-moon-stars-fill");
        bi.classList.add("bi-brightness-high-fill");
        body.style.backgroundImage = "url('../media/wallpaper-blue.png')";
        fofos.forEach(fofo => fofo.style.color = "#f7f0f0");
        headCor.style.backgroundColor = "#283655";
        logo.src = "../media/minilogo-roxo.png";
    }
});

if(bi.classList.contains("bi-moon-stars-fill")){
    fofos.forEach(fofo => fofo.style.color = "#A10AFF");
}

formcontrol.forEach(form => {
    form.classList.add("shadow-sm");
});

formfloating.forEach(form => {
    form.classList.add("roxo");
});

headCor.style.fontSize = "1.5rem";
headCor.style.fontWeight = "bold";